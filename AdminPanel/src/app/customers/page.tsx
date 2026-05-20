"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  ShoppingCart,
  Heart,
  Calendar,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface CartItem {
  product_slug: string;
  product_title: string;
  product_image: string | null;
  unit_price: string;
  quantity: number;
}

interface WishlistItem {
  product_slug: string;
  product_title: string;
  product_image: string | null;
  unit_price: string;
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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  // Fetch customers from API
  const fetchCustomers = async (searchQuery: string = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  const toggleExpand = (id: string) => {
    setExpandedCustomerId(expandedCustomerId === id ? null : id);
  };

  const getPaymentStatusBadge = (status: string | null, totalOrders: number) => {
    if (totalOrders === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f6f8] px-2.5 py-0.5 text-xs font-semibold text-[#6d7175] border border-[#e1e3e5]">
          No orders
        </span>
      );
    }
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e2f1e8] px-2.5 py-0.5 text-xs font-semibold text-[#108043] border border-[#aee9d1]">
            <CheckCircle className="h-3 w-3" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fdf2e2] px-2.5 py-0.5 text-xs font-semibold text-[#9c5700] border border-[#ffebcc]">
            <Clock className="h-3 w-3 animation-pulse" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f6f8] px-2.5 py-0.5 text-xs font-semibold text-[#6d7175] border border-[#e1e3e5]">
            Unknown
          </span>
        );
    }
  };

  // Aggregated quick stats
  const totalCustomersCount = customers.length;
  const totalItemsInCarts = customers.reduce((acc, c) => acc + c.cart_items.reduce((sum, item) => sum + item.quantity, 0), 0);
  const totalItemsInWishlists = customers.reduce((acc, c) => acc + c.wishlist_items.length, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#202223] tracking-tight">Customers</h2>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            Analyze customer actions, manage profiles, and monitor live carts & wishlists in real-time.
          </p>
        </div>
      </div>

      {/* Modern Analytics Quick Stats Card Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#6d7175]">Total Registered Customers</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#008060]/10 text-[#008060]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#202223]">{totalCustomersCount}</span>
            <span className="text-[11px] font-bold text-[#108043]">Active users</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#6d7175]">Total Live Cart Items</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#202223]">{totalItemsInCarts}</span>
            <span className="text-[11px] font-bold text-indigo-600">Ready to buy</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#6d7175]">Total Wishlist Likes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#202223]">{totalItemsInWishlists}</span>
            <span className="text-[11px] font-bold text-rose-600">High intent</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Search Header Bar */}
        <div className="border-b border-[#e1e3e5] bg-[#fafbfb] p-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#8c9196]">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search customers by name, phone (+91...) or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#c9cccf] bg-white pl-10 pr-4 text-[13px] font-medium text-[#202223] placeholder-[#8c9196] focus:border-[#008060] focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#008060] px-5 text-[13px] font-bold text-white shadow-[0_1px_0_rgba(0,0,0,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:bg-[#006e52] focus:outline-none focus:ring-2 focus:ring-[#008060] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Customer Table List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e1e3e5] border-t-[#008060]" />
            <span className="mt-4 text-xs font-semibold text-[#6d7175]">Loading premium customers dashboard...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f6f8]">
              <Users className="h-7 w-7 text-[#8c9196]" />
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-[#202223]">No customers found</h3>
            <p className="mt-1 max-w-xs text-center text-xs text-[#6d7175]">
              No customer records matched your query. Try adjusting your search term.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e1e3e5]">
            {/* Table Header for Desktop */}
            <div className="hidden grid-cols-12 bg-[#fafbfb] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#6d7175] border-b border-[#e1e3e5] md:grid">
              <div className="col-span-4">Customer Details</div>
              <div className="col-span-3">Contact Information</div>
              <div className="col-span-2 text-center">Orders Placed</div>
              <div className="col-span-2 text-center">Payment Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Customer List Rows */}
            {customers.map((cust) => {
              const nameInitial = cust.full_name ? cust.full_name.trim().charAt(0).toUpperCase() : "?";
              const isExpanded = expandedCustomerId === cust.id;

              return (
                <div key={cust.id} className="transition-all hover:bg-slate-50/50">
                  {/* Row Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4.5 gap-4 md:gap-0">
                    {/* Customer Identity */}
                    <div className="md:col-span-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#008060] to-[#00b087] text-sm font-black text-white shadow-sm">
                        {nameInitial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-[14px] font-bold text-[#202223]">
                          {cust.full_name || <span className="italic text-gray-400">Unnamed Customer</span>}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6d7175]">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Joined {new Date(cust.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-3 text-[13px] text-[#202223] space-y-1">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Phone className="h-3.5 w-3.5 text-[#6d7175]" />
                        <span>{cust.phone_e164}</span>
                      </div>
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-xs text-[#6d7175]">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{cust.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Total Orders counts */}
                    <div className="md:col-span-2 flex flex-col md:items-center text-center">
                      <span className="text-[14px] font-black text-[#202223]">{cust.total_orders}</span>
                      {cust.total_orders > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold">
                          <span className="rounded bg-[#e2f1e8] px-1.5 py-0.2 text-[#108043]">{cust.paid_orders_count} Paid</span>
                          {cust.pending_orders_count > 0 && (
                            <span className="rounded bg-[#fdf2e2] px-1.5 py-0.2 text-[#9c5700]">{cust.pending_orders_count} Pending</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Latest Payment Badge */}
                    <div className="md:col-span-2 flex md:justify-center">
                      {getPaymentStatusBadge(cust.latest_payment_status, cust.total_orders)}
                    </div>

                    {/* Expand Trigger */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => toggleExpand(cust.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#c9cccf] bg-white px-3 text-xs font-bold text-[#202223] hover:bg-[#f6f6f7] transition-colors"
                      >
                        Details
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Sliding Tray */}
                  {isExpanded && (
                    <div className="bg-[#fafbfb] border-t border-b border-[#e1e3e5] px-6 py-6 transition-all duration-300">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Cart Items Section */}
                        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2 font-bold text-[#202223] text-[13px]">
                              <ShoppingCart className="h-4.5 w-4.5 text-indigo-600" />
                              <span>Live Shopping Cart ({cust.cart_items.length} items)</span>
                            </div>
                            {cust.cart_items.length > 0 && (
                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                                Subtotal: ₹
                                {cust.cart_items
                                  .reduce((acc, item) => acc + parseFloat(item.unit_price) * item.quantity, 0)
                                  .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                              </span>
                            )}
                          </div>

                          {cust.cart_items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <ShoppingCart className="h-8 w-8 text-[#c9cccf]" />
                              <p className="mt-2 text-xs font-medium text-[#6d7175]">Cart is currently empty</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                              {cust.cart_items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-gray-50 bg-slate-50/30 p-2 hover:bg-slate-50 transition-colors">
                                  <div className="h-11 w-11 shrink-0 rounded-md border border-[#e1e3e5] bg-white overflow-hidden flex items-center justify-center">
                                    {item.product_image ? (
                                      <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] text-[#8c9196] font-semibold">No Image</span>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="truncate text-xs font-bold text-[#202223]">{item.product_title}</h5>
                                    <p className="mt-0.5 text-[10px] text-[#6d7175]">Slug: {item.product_slug}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-bold text-[#202223]">₹{parseFloat(item.unit_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                    <p className="mt-0.5 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1 rounded inline-block">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Wishlist Items Section */}
                        <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2 font-bold text-[#202223] text-[13px]">
                              <Heart className="h-4.5 w-4.5 text-rose-500" />
                              <span>Live Customer Wishlist ({cust.wishlist_items.length} items)</span>
                            </div>
                          </div>

                          {cust.wishlist_items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Heart className="h-8 w-8 text-[#c9cccf]" />
                              <p className="mt-2 text-xs font-medium text-[#6d7175]">Wishlist is currently empty</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                              {cust.wishlist_items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-gray-50 bg-slate-50/30 p-2 hover:bg-slate-50 transition-colors">
                                  <div className="h-11 w-11 shrink-0 rounded-md border border-[#e1e3e5] bg-white overflow-hidden flex items-center justify-center">
                                    {item.product_image ? (
                                      <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      <span className="text-[9px] text-[#8c9196] font-semibold">No Image</span>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="truncate text-xs font-bold text-[#202223]">{item.product_title}</h5>
                                    <p className="mt-0.5 text-[10px] text-[#6d7175]">Slug: {item.product_slug}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-bold text-[#202223]">₹{parseFloat(item.unit_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                    <p className="mt-0.5 text-[9px] text-rose-600 bg-rose-50 px-1 rounded inline-block font-bold">Saved Item</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
