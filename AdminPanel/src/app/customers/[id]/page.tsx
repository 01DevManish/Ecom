"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Clock3, Heart, Mail, Phone, ShoppingCart, ShoppingBag } from "lucide-react";

interface CartItem {
  product_slug: string;
  product_title: string;
  product_image: string | null;
  unit_price: string | null;
  quantity: number;
}

interface WishlistItem {
  product_slug: string;
  product_title: string;
  product_image: string | null;
  unit_price: string | null;
}

interface OrderItem {
  product_slug: string;
  product_title: string;
  product_image: string | null;
  unit_price: string;
  quantity: number;
  line_total: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  grand_total: string;
  created_at: string;
  items: OrderItem[];
}

interface Customer {
  id: string;
  phone_e164: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  total_orders: number;
  paid_orders_count: number;
  pending_orders_count: number;
  latest_payment_status: string | null;
  cart_items: CartItem[];
  wishlist_items: WishlistItem[];
}

function badge(status: string) {
  if (status.toLowerCase() === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status.toLowerCase() === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const customerId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!customerId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/customers/${customerId}`);
        if (!res.ok) return;
        const data = await res.json();
        setCustomer(data.customer || null);
        setOrders(data.orders || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [customerId]);

  const orderRevenue = useMemo(
    () => orders.reduce((sum, ord) => sum + Number.parseFloat(ord.grand_total || "0"), 0),
    [orders]
  );

  if (loading) {
    return <div className="rounded-xl border border-[#e1e3e5] bg-white p-8 text-sm text-[#6d7175]">Loading customer profile...</div>;
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <Link href="/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#006e52]">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-8 text-sm text-[#6d7175]">Customer not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <Link href="/customers" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#008060] hover:text-[#006e52]">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
        <div className="rounded-xl border border-[#d8efe8] bg-gradient-to-r from-[#f1fbf7] via-white to-[#eef8ff] p-5">
          <h1 className="text-2xl font-black text-[#202223]">{customer.full_name || "Unnamed Customer"}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#4f5357]">
            <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{customer.phone_e164}</span>
            {customer.email && <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" />{customer.email}</span>}
            <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {new Date(customer.created_at).toLocaleDateString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-4"><p className="text-xs text-[#6d7175]">Orders</p><p className="mt-1 text-2xl font-black text-[#202223]">{customer.total_orders}</p></div>
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-4"><p className="text-xs text-[#6d7175]">Revenue</p><p className="mt-1 text-2xl font-black text-[#202223]">Rs {orderRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p></div>
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-4"><p className="text-xs text-[#6d7175]">Cart Items</p><p className="mt-1 text-2xl font-black text-[#202223]">{customer.cart_items.length}</p></div>
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-4"><p className="text-xs text-[#6d7175]">Wishlist Items</p><p className="mt-1 text-2xl font-black text-[#202223]">{customer.wishlist_items.length}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#e1e3e5] bg-white">
          <div className="border-b border-[#e1e3e5] px-5 py-3 text-sm font-bold text-[#202223]">Order History</div>
          <div className="max-h-[480px] space-y-3 overflow-y-auto p-4">
            {orders.length === 0 ? <p className="text-sm text-[#6d7175]">No orders placed yet.</p> : orders.map((ord) => (
              <div key={ord.id} className="rounded-lg border border-[#e1e3e5] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#202223]">#{ord.order_number}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge(ord.payment_status)}`}>{ord.payment_status}</span>
                </div>
                <p className="mt-1 text-xs text-[#6d7175]">{new Date(ord.created_at).toLocaleString("en-IN")} | Rs {Number.parseFloat(ord.grand_total || "0").toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <div className="mt-2 space-y-1">
                  {ord.items.map((it, idx) => <p key={`${ord.id}-${idx}`} className="text-xs text-[#4f5357]">{it.product_title} x {it.quantity}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[#e1e3e5] bg-white">
            <div className="flex items-center gap-2 border-b border-[#e1e3e5] px-5 py-3 text-sm font-bold text-[#202223]"><ShoppingCart className="h-4 w-4 text-indigo-600" />Cart Snapshot</div>
            <div className="space-y-2 p-4">
              {customer.cart_items.length === 0 ? <p className="text-sm text-[#6d7175]">The cart is currently empty.</p> : customer.cart_items.map((it, idx) => (
                <div key={`${it.product_slug}-${idx}`} className="rounded-lg border border-[#e1e3e5] p-3 text-sm text-[#202223]">
                  <p className="font-semibold">{it.product_title}</p>
                  <p className="text-xs text-[#6d7175]">Qty: {it.quantity} | {it.unit_price ? `Rs ${Number.parseFloat(it.unit_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "Price unavailable"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e3e5] bg-white">
            <div className="flex items-center gap-2 border-b border-[#e1e3e5] px-5 py-3 text-sm font-bold text-[#202223]"><Heart className="h-4 w-4 text-rose-600" />Wishlist Snapshot</div>
            <div className="space-y-2 p-4">
              {customer.wishlist_items.length === 0 ? <p className="text-sm text-[#6d7175]">The wishlist is currently empty.</p> : customer.wishlist_items.map((it, idx) => (
                <div key={`${it.product_slug}-${idx}`} className="rounded-lg border border-[#e1e3e5] p-3 text-sm text-[#202223]">
                  <p className="font-semibold">{it.product_title}</p>
                  <p className="text-xs text-[#6d7175]">Slug: {it.product_slug}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
