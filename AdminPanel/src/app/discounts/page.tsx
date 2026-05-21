"use client";

import { Percent, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSiteContext, withSiteId } from "@/lib/site-context";

type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: string;
  min_order_amount: string | null;
  max_discount_amount: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

export default function DiscountsPage() {
  const activeSiteId = useSiteContext((s) => s.activeSiteId);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "flat">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function loadCoupons() {
    setLoading(true);
    try {
      const res = await fetch(withSiteId("/api/admin/discounts", activeSiteId));
      const data = await res.json();
      setCoupons(data.coupons ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, [activeSiteId]);

  async function createCoupon() {
    if (!code.trim()) {
      setMessage("Coupon code is required.");
      return;
    }
    if (!Number(discountValue) || Number(discountValue) <= 0) {
      setMessage("Discount value must be greater than 0.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(withSiteId("/api/admin/discounts", activeSiteId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: activeSiteId,
          code,
          discount_type: discountType,
          discount_value: Number(discountValue),
          min_order_amount: minOrderAmount ? Number(minOrderAmount) : null,
          max_discount_amount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
          starts_at: startsAt || null,
          ends_at: endsAt || null,
          is_active: isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save coupon");

      setCode("");
      setDiscountValue("");
      setMinOrderAmount("");
      setMaxDiscountAmount("");
      setStartsAt("");
      setEndsAt("");
      setIsActive(true);
      setMessage("Coupon saved successfully.");
      await loadCoupons();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCoupon(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(withSiteId(`/api/admin/discounts?id=${id}`, activeSiteId), { method: "DELETE" });
    await loadCoupons();
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#202223]">Discount Coupons</h2>
          <p className="mt-0.5 text-[13px] text-[#6d7175]">Create and manage coupon codes for checkout discounts.</p>
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-semibold text-[#202223]">Create Coupon</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon Code (e.g. SAVE10)" className="h-10 rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          <select value={discountType} onChange={(e) => setDiscountType(e.target.value as "percent" | "flat")} className="h-10 rounded-md border border-[#c9cccf] px-3 text-[13px]">
            <option value="percent">Percentage (%)</option>
            <option value="flat">Flat amount (INR)</option>
          </select>
          <input value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="Discount Value" type="number" className="h-10 rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          <input value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} placeholder="Min Order Amount (optional)" type="number" className="h-10 rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          <input value={maxDiscountAmount} onChange={(e) => setMaxDiscountAmount(e.target.value)} placeholder="Max Discount (optional)" type="number" className="h-10 rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          <label className="inline-flex items-center gap-2 rounded-md border border-[#c9cccf] px-3 text-[13px] font-medium text-[#202223]">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[#008060]" />
            Active
          </label>
          <div>
            <label className="mb-1 block text-[12px] text-[#6d7175]">Starts At (optional)</label>
            <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} type="datetime-local" className="h-10 w-full rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-[#6d7175]">Ends At (optional)</label>
            <input value={endsAt} onChange={(e) => setEndsAt(e.target.value)} type="datetime-local" className="h-10 w-full rounded-md border border-[#c9cccf] px-3 text-[13px]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={createCoupon} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-[#008060] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#006e52] disabled:opacity-60">
            <Plus className="h-4 w-4" /> {saving ? "Saving..." : "Save Coupon"}
          </button>
          {message ? <p className="text-[13px] text-[#6d7175]">{message}</p> : null}
        </div>
      </div>

      <div className="rounded-lg border border-[#e1e3e5] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="border-b border-[#e1e3e5] px-5 py-3 text-[13px] font-semibold text-[#202223]">Saved Coupons</div>
        {loading ? (
          <div className="p-6 text-[13px] text-[#6d7175]">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f6f8]"><Percent className="h-6 w-6 text-[#8c9196]" /></div>
            <p className="mt-3 text-[14px] font-semibold text-[#202223]">No coupons created yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e1e3e5]">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#202223]">{coupon.code}</p>
                  <p className="text-[12px] text-[#6d7175]">
                    {coupon.discount_type === "percent" ? `${coupon.discount_value}% off` : `INR ${coupon.discount_value} off`}
                    {coupon.min_order_amount ? ` | Min INR ${coupon.min_order_amount}` : ""}
                    {coupon.max_discount_amount ? ` | Max INR ${coupon.max_discount_amount}` : ""}
                    {coupon.is_active ? " | Active" : " | Inactive"}
                  </p>
                </div>
                <button onClick={() => deleteCoupon(coupon.id)} className="inline-flex items-center gap-1 rounded-md border border-[#e0b3b3] bg-[#fff4f4] px-2.5 py-1.5 text-[12px] font-semibold text-[#d72c0d] hover:bg-[#ffe9e9]">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
