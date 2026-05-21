"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, CheckCircle, Clock, Mail, Phone, Search, ShoppingCart, Users } from "lucide-react";

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
  cart_items: { quantity: number }[];
  wishlist_items: unknown[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (searchQuery = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) return;
      const data = await res.json();
      setCustomers(data.customers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const totalCustomersCount = customers.length;
  const totalItemsInCarts = customers.reduce((acc, c) => acc + c.cart_items.reduce((sum, item) => sum + item.quantity, 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#202223] tracking-tight">Customers</h2>
        <p className="mt-1 text-[13px] text-[#6d7175]">Fast overview + single-click deep customer profile.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#6d7175]">Total Registered Customers</span>
            <Users className="h-5 w-5 text-[#008060]" />
          </div>
          <p className="mt-2 text-3xl font-black text-[#202223]">{totalCustomersCount}</p>
        </div>
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#6d7175]">Live Cart Items</span>
            <ShoppingCart className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-2 text-3xl font-black text-[#202223]">{totalItemsInCarts}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-[#e1e3e5] bg-[#fafbfb] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchCustomers(search);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c9196]" />
              <input
                type="text"
                placeholder="Search by name, phone, email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#c9cccf] bg-white pl-10 pr-4 text-[13px]"
              />
            </div>
            <button className="h-10 rounded-lg bg-[#008060] px-5 text-[13px] font-bold text-white hover:bg-[#006e52]" type="submit">
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-[#6d7175]">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-sm text-[#6d7175]">No customers found.</div>
        ) : (
          <div className="divide-y divide-[#e1e3e5]">
            {customers.map((cust) => {
              const status = (cust.latest_payment_status || "none").toLowerCase();
              return (
                <div key={cust.id} className="grid gap-4 px-6 py-4 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-4">
                    <p className="text-sm font-bold text-[#202223]">{cust.full_name || "Unnamed Customer"}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#6d7175]"><Calendar className="h-3.5 w-3.5" />Joined {new Date(cust.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="space-y-1 text-xs text-[#4f5357] md:col-span-3">
                    <p className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{cust.phone_e164}</p>
                    {cust.email && <p className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{cust.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-bold text-[#202223]">{cust.total_orders} Orders</p>
                    <p className="mt-1 text-[11px] text-[#6d7175]">{cust.paid_orders_count} paid, {cust.pending_orders_count} pending</p>
                  </div>
                  <div className="md:col-span-2">
                    {status === "paid" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle className="h-3.5 w-3.5" />Paid</span>
                    ) : status === "pending" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Clock className="h-3.5 w-3.5" />Pending</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">No orders</span>
                    )}
                  </div>
                  <div className="md:col-span-1 md:text-right">
                    <Link href={`/customers/${cust.id}`} className="inline-flex items-center gap-1 rounded-lg border border-[#b7e5d8] bg-[#ebf9f4] px-3 py-2 text-xs font-bold text-[#006e52] transition-colors hover:bg-[#dbf3eb]">
                      View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
