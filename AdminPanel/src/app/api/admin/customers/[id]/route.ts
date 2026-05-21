import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const runtime = "nodejs";

async function ensureCustomerWishlistTables() {
  await query(`
    create table if not exists customer_wishlists (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null unique references users(id) on delete cascade,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await query(`
    create table if not exists customer_wishlist_items (
      id uuid primary key default gen_random_uuid(),
      wishlist_id uuid not null references customer_wishlists(id) on delete cascade,
      product_slug varchar(260) not null,
      product_title varchar(220) not null,
      product_image text,
      unit_price numeric(12,2),
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique (wishlist_id, product_slug)
    )
  `);
}

interface CustomerRow {
  id: string;
  phone_e164: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  total_orders: number;
  paid_orders_count: number;
  pending_orders_count: number;
  latest_payment_status: string | null;
  cart_items: unknown[];
  wishlist_items: unknown[];
}

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await ensureCustomerWishlistTables();
    const resolvedParams = await context.params;
    const rawId = resolvedParams?.id;
    const customerId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!customerId) {
      return NextResponse.json({ error: "Customer id is required" }, { status: 400 });
    }

    const customerResult = await query<CustomerRow>(
      `
      select
        u.id,
        u.phone_e164,
        u.full_name,
        u.email,
        u.created_at,
        coalesce(o.total_orders, 0)::int as total_orders,
        coalesce(o.paid_orders_count, 0)::int as paid_orders_count,
        coalesce(o.pending_orders_count, 0)::int as pending_orders_count,
        o.latest_payment_status,
        coalesce(cart.cart_items, '[]'::json) as cart_items,
        coalesce(wish.wishlist_items, '[]'::json) as wishlist_items
      from users u
      left join (
        select
          user_id,
          count(*) as total_orders,
          count(*) filter (where payment_status = 'paid') as paid_orders_count,
          count(*) filter (where payment_status = 'pending') as pending_orders_count,
          (array_agg(payment_status order by created_at desc))[1] as latest_payment_status
        from customer_orders
        group by user_id
      ) o on o.user_id = u.id
      left join lateral (
        select json_agg(json_build_object(
          'product_slug', cci.product_slug,
          'product_title', cci.product_title,
          'product_image', cci.product_image,
          'unit_price', cci.unit_price::text,
          'quantity', cci.quantity
        )) as cart_items
        from customer_carts cc
        join customer_cart_items cci on cci.cart_id = cc.id
        where cc.user_id = u.id
      ) cart on true
      left join lateral (
        select json_agg(json_build_object(
          'product_slug', cwi.product_slug,
          'product_title', cwi.product_title,
          'product_image', cwi.product_image,
          'unit_price', cwi.unit_price::text
        )) as wishlist_items
        from customer_wishlists cw
        join customer_wishlist_items cwi on cwi.wishlist_id = cw.id
        where cw.user_id = u.id
      ) wish on true
      where u.id = $1
      limit 1
      `,
      [customerId]
    );

    if (!customerResult.rows[0]) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const ordersResult = await query(
      `
      select
        co.id,
        co.order_number,
        co.status,
        co.payment_status,
        co.subtotal::text as subtotal,
        co.shipping_total::text as shipping_total,
        co.grand_total::text as grand_total,
        co.shipping_name,
        co.shipping_phone,
        co.shipping_address,
        co.shipping_city,
        co.shipping_state,
        co.shipping_pincode,
        co.notes,
        co.placed_at,
        co.created_at,
        (
          select coalesce(json_agg(json_build_object(
            'product_slug', coi.product_slug,
            'product_title', coi.product_title,
            'product_image', coi.product_image,
            'unit_price', coi.unit_price::text,
            'quantity', coi.quantity,
            'line_total', coi.line_total::text
          )), '[]'::json)
          from customer_order_items coi
          where coi.order_id = co.id
        ) as items
      from customer_orders co
      where co.user_id = $1
      order by co.created_at desc
      `,
      [customerId]
    );

    return NextResponse.json({
      customer: customerResult.rows[0],
      orders: ordersResult.rows,
    });
  } catch (error) {
    console.error("GET /api/admin/customers/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
  }
}
