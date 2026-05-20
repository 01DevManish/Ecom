"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Package,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

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
  subtotal: string;
  shipping_total: string;
  grand_total: string;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  notes: string | null;
  placed_at: string | null;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  items: OrderItem[] | null;
}

interface Metrics {
  today: { count: number; revenue: number };
  yesterday: { count: number; revenue: number };
}

interface Pagination {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    today: { count: 0, revenue: 0 },
    yesterday: { count: 0, revenue: 0 },
  });
  const [pagination, setPagination] = useState<Pagination>({
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Default date bounds: last 7 days to today
  const getPastDateString = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getPastDateString(7));
  const [endDate, setEndDate] = useState(getPastDateString(0));
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async (targetPage = page) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        page: targetPage.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    setPage(1);
  }, [startDate, endDate, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      fetchOrders(newPage);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleResetFilters = () => {
    setStartDate(getPastDateString(7));
    setEndDate(getPastDateString(0));
  };

  const getPaymentStatusBadge = (status: string) => {
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
            <Clock className="h-3 w-3 animate-pulse" /> Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fbeae5] px-2.5 py-0.5 text-xs font-semibold text-[#bf0711] border border-[#f9d0c4]">
            <AlertTriangle className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 border border-gray-200">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e2f1e8] px-2.5 py-0.5 text-xs font-semibold text-[#108043]">
            Fulfilled
          </span>
        );
      case "placed":
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f3f5] px-2.5 py-0.5 text-xs font-semibold text-[#005c6e]">
            Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {status || "Placed"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Refresh */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#202223] tracking-tight">Orders</h2>
          <p className="mt-1 text-[13px] text-[#6d7175]">
            Overview your storefront orders, monitor real-time sales performance, and track shipments.
          </p>
        </div>
        <button
          onClick={() => fetchOrders(page)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#c9cccf] bg-white px-4 text-xs font-bold text-[#202223] hover:bg-[#f6f6f7] transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* IST Performance Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Today Card */}
        <div className="relative overflow-hidden rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7175]">TODAY'S TRANSACTIONS</span>
              <h3 className="text-3xl font-black text-[#202223] tracking-tight">
                ₹{metrics.today.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#008060]/10 text-[#008060]">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-[#f4f6f8] pt-3 text-xs text-[#6d7175]">
            <ShoppingBag className="h-3.5 w-3.5 text-[#008060]" />
            <span className="font-semibold text-[#202223]">{metrics.today.count} orders</span>
            <span>placed today (IST)</span>
          </div>
        </div>

        {/* Yesterday Card */}
        <div className="relative overflow-hidden rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6d7175]">YESTERDAY'S TRANSACTIONS</span>
              <h3 className="text-3xl font-black text-[#202223] tracking-tight">
                ₹{metrics.yesterday.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-[#f4f6f8] pt-3 text-xs text-[#6d7175]">
            <ShoppingBag className="h-3.5 w-3.5 text-[#6d7175]" />
            <span className="font-semibold text-[#202223]">{metrics.yesterday.count} orders</span>
            <span>placed yesterday (IST)</span>
          </div>
        </div>
      </div>

      {/* Filters and Table Grid */}
      <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Advanced Filters Header */}
        <div className="border-b border-[#e1e3e5] bg-[#fafbfb] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#6d7175]" />
              <span className="text-[13px] font-semibold text-[#202223]">Range:</span>
            </div>
            {/* Start Date */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-[#c9cccf] bg-white px-2.5 py-1 text-xs font-bold text-[#202223] focus:border-[#008060] focus:outline-none"
            />
            <span className="text-xs text-[#6d7175]">to</span>
            {/* End Date */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-[#c9cccf] bg-white px-2.5 py-1 text-xs font-bold text-[#202223] focus:border-[#008060] focus:outline-none"
            />
            
            {(startDate !== getPastDateString(7) || endDate !== getPastDateString(0)) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#008060] hover:text-[#006e52] underline transition-colors"
              >
                Reset range
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6d7175] font-semibold uppercase">Show per page:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="rounded-lg border border-[#c9cccf] bg-white px-2 py-1 text-xs font-bold text-[#202223] focus:border-[#008060] focus:outline-none"
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </div>

        {/* Content Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e1e3e5] border-t-[#008060]" />
            <span className="mt-4 text-xs font-semibold text-[#6d7175]">Loading orders data...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f6f8]">
              <ShoppingBag className="h-7 w-7 text-[#8c9196]" />
            </div>
            <h3 className="mt-4 text-[15px] font-bold text-[#202223]">No orders found</h3>
            <p className="mt-1 max-w-xs text-center text-xs text-[#6d7175]">
              No transactions matched this date range. Try choosing broader filter bounds.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e1e3e5]">
            {/* Desktop Table Header */}
            <div className="hidden grid-cols-12 bg-[#fafbfb] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-[#6d7175] border-b border-[#e1e3e5] md:grid">
              <div className="col-span-2">Order</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2 text-center">Items Count</div>
              <div className="col-span-2 text-right">Total (INR)</div>
              <div className="col-span-2 text-center">Statuses</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Orders Rows */}
            {orders.map((ord) => {
              const isExpanded = expandedOrderId === ord.id;
              const formattedDate = new Date(ord.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              });

              const itemsCount = ord.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

              return (
                <div key={ord.id} className="transition-all hover:bg-slate-50/50">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4.5 gap-4 md:gap-0">
                    
                    {/* Order Identifier */}
                    <div className="md:col-span-2 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#202223] text-[14px]">
                        <Package className="h-4 w-4 text-[#008060]" />
                        <span>#{ord.order_number}</span>
                      </div>
                      <p className="text-[11px] text-[#6d7175]">{formattedDate}</p>
                    </div>

                    {/* Customer identity */}
                    <div className="md:col-span-3 space-y-1 text-[13px] text-[#202223]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <User className="h-3.5 w-3.5 text-[#6d7175]" />
                        <span>{ord.shipping_name || ord.customer_name || "Guest User"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6d7175]">
                        {ord.customer_phone && <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" />{ord.customer_phone}</span>}
                        {ord.customer_email && <span className="truncate max-w-[120px] flex items-center gap-0.5"><Mail className="h-3 w-3" />{ord.customer_email}</span>}
                      </div>
                    </div>

                    {/* Items count summary */}
                    <div className="md:col-span-2 flex flex-col md:items-center text-center">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 inline-block">
                        {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Grand Total Financial values */}
                    <div className="md:col-span-2 text-right flex flex-col pr-4">
                      <span className="text-[14px] font-black text-[#202223]">
                        ₹{parseFloat(ord.grand_total).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-[10px] text-[#6d7175]">
                        Sub: ₹{parseFloat(ord.subtotal).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    {/* Transaction & Order Status badges */}
                    <div className="md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                      {getPaymentStatusBadge(ord.payment_status)}
                      {getOrderStatusBadge(ord.status)}
                    </div>

                    {/* Expand Detail Drawer */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        onClick={() => toggleExpand(ord.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#c9cccf] bg-white px-3 text-xs font-bold text-[#202223] hover:bg-[#f6f6f7] transition-all shadow-sm"
                      >
                        Details
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expand Tray details Drawer */}
                  {isExpanded && (
                    <div className="bg-[#fafbfb] border-t border-b border-[#e1e3e5] px-6 py-6 transition-all duration-300">
                      <div className="grid gap-6 md:grid-cols-12">
                        
                        {/* Left column: Receipt itemization */}
                        <div className="md:col-span-7 rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6d7175] border-b border-gray-100 pb-3">
                            Itemized Receipt
                          </h4>
                          
                          {(!ord.items || ord.items.length === 0) ? (
                            <p className="text-xs text-[#6d7175] italic">No items aggregated in database order items table.</p>
                          ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3.5 rounded-lg border border-gray-50 bg-slate-50/20 p-2.5 hover:bg-slate-50 transition-colors">
                                  <div className="h-12 w-12 shrink-0 rounded-md border border-[#e1e3e5] bg-white overflow-hidden flex items-center justify-center">
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
                                  <div className="text-right shrink-0 space-y-0.5">
                                    <span className="text-xs font-bold text-[#202223]">
                                      ₹{parseFloat(item.line_total).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                                    </span>
                                    <p className="text-[10px] text-[#6d7175] font-medium">
                                      ₹{parseFloat(item.unit_price).toLocaleString("en-IN", { maximumFractionDigits: 0 })} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}

                              {/* Small financial receipt recap */}
                              <div className="border-t border-[#e1e3e5] pt-3 mt-4 text-xs text-[#6d7175] space-y-1 text-right max-w-xs ml-auto">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span className="font-semibold text-[#202223]">₹{parseFloat(ord.subtotal).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Shipping:</span>
                                  <span className="font-semibold text-[#202223]">₹{parseFloat(ord.shipping_total).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between border-t border-dashed border-gray-200 pt-1 text-sm text-[#202223]">
                                  <span className="font-bold">Total:</span>
                                  <span className="font-black text-[#008060]">₹{parseFloat(ord.grand_total).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right column: Delivery Shipping Label details */}
                        <div className="md:col-span-5 rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                          <div>
                            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#6d7175] border-b border-gray-100 pb-3 flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-indigo-500" />
                              Shipping Label
                            </h4>

                            <div className="space-y-3.5 text-xs text-[#202223]">
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-[#6d7175] uppercase">Recipient Name</p>
                                <p className="font-bold text-[13px]">{ord.shipping_name || "N/A"}</p>
                              </div>

                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-[#6d7175] uppercase">Contact Number</p>
                                <p className="font-semibold">{ord.shipping_phone || "N/A"}</p>
                              </div>

                              <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-[#6d7175] uppercase">Delivery Address</p>
                                <p className="leading-relaxed font-medium">
                                  {ord.shipping_address || "N/A"}
                                </p>
                                <p className="font-bold mt-1 text-[#202223]">
                                  {ord.shipping_city ? `${ord.shipping_city}, ` : ""}
                                  {ord.shipping_state ? `${ord.shipping_state} ` : ""}
                                  {ord.shipping_pincode ? `- ${ord.shipping_pincode}` : ""}
                                </p>
                              </div>

                              {ord.notes && (
                                <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-2.5 mt-2">
                                  <p className="text-[9px] font-bold uppercase text-yellow-700">Customer Notes / Instructions</p>
                                  <p className="mt-0.5 font-medium text-yellow-800 text-[11px] leading-relaxed">"{ord.notes}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="border-t border-[#f4f6f8] pt-3.5 mt-4 text-[10px] text-[#8c9196] text-center flex items-center justify-center gap-1">
                            <span>🔒 Secured Encrypted Payment Details</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="border-t border-[#e1e3e5] bg-[#fafbfb] px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#6d7175]">
              Showing orders {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.totalCount)} of {pagination.totalCount} results
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c9cccf] bg-white text-[#202223] hover:bg-[#f6f6f7] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold text-[#202223] px-2">
                Page {page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#c9cccf] bg-white text-[#202223] hover:bg-[#f6f6f7] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
