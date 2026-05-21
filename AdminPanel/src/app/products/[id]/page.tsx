"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Droplet,
  GripVertical,
  ImagePlus,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { withSiteId } from "@/lib/site-context";

const MAX_IMAGES = 10;

type KeyValueRow = {
  label: string;
  value: string;
};

type DescriptionSections = {
  highlights: KeyValueRow[];
  details: KeyValueRow[];
  care: KeyValueRow[];
};

function parseToKeyValueArray(input: any, defaultLabel: string): KeyValueRow[] {
  if (Array.isArray(input)) {
    return input.map(item => ({
      label: item.label || defaultLabel,
      value: item.value || ""
    }));
  }
  
  if (typeof input === "string" && input.trim()) {
    return input.split("\n").map(line => {
      const trimmed = line.trim().replace(/^•\s*/, "");
      if (!trimmed) return null;
      
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx > 0) {
        return {
          label: trimmed.substring(0, colonIdx).trim(),
          value: trimmed.substring(colonIdx + 1).trim()
        };
      }
      return {
        label: defaultLabel,
        value: trimmed
      };
    }).filter(Boolean) as KeyValueRow[];
  }
  
  return [];
}

type CollectionOption = {
  id: string;
  name: string;
  slug: string;
};

type AssignedCollection = {
  collection_id: string;
  name: string;
  slug: string;
};

type ProductDetail = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  is_active: boolean;
  descriptionSections: DescriptionSections;
  gallery_images: { id: string; image_url: string; sort_order: number }[];
  variant: {
    sku: string | null;
    sale_price: string | null;
    mrp: string | null;
    collection: string | null;
    size: string | null;
  } | null;
  collections: AssignedCollection[];
};

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state
  const [imageUrls, setImageUrls] = useState<string[]>(Array(MAX_IMAGES).fill(""));
  const [sections, setSections] = useState<DescriptionSections>({
    highlights: [],
    details: [],
    care: [],
  });
  const [activeTab, setActiveTab] = useState<"highlights" | "details" | "care">("highlights");
  const [size, setSize] = useState("");
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Collections
  const [allCollections, setAllCollections] = useState<CollectionOption[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);

  async function loadProduct() {
    setLoading(true);
    try {
      const res = await fetch(withSiteId(`/api/admin/products/${id}`));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setProduct(data);

      // Populate images
      const imgs = (data.gallery_images || []).map((g: { image_url: string }) => g.image_url);
      while (imgs.length < MAX_IMAGES) imgs.push("");
      setImageUrls(imgs.slice(0, MAX_IMAGES));

      // Populate descriptions
      const loaded = data.descriptionSections || { highlights: "", details: "", care: "" };
      setSections({
        highlights: parseToKeyValueArray(loaded.highlights, "Highlight"),
        details: parseToKeyValueArray(loaded.details, "Detail"),
        care: parseToKeyValueArray(loaded.care, "Care"),
      });

      if (data.variant?.size) {
        setSize(data.variant.size);
      }
      setTitle(data.title || "");
      setSku(data.variant?.sku || "");
      setSalePrice(data.variant?.sale_price || "");
      setMrp(data.variant?.mrp || "");
      setIsActive(Boolean(data.is_active));

      // Populate collections
      setSelectedCollectionIds(
        (data.collections || []).map((c: AssignedCollection) => c.collection_id),
      );
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to load product",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadCollections() {
    try {
      const res = await fetch(withSiteId("/api/admin/collections"));
      const data = await res.json();
      setAllCollections(
        (data.collections || []).map((c: CollectionOption) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
      );
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    loadProduct();
    loadCollections();
  }, [id]);

  function updateImage(index: number, value: string) {
    setImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function removeImage(index: number) {
    setImageUrls((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      next.push("");
      return next;
    });
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= MAX_IMAGES) return;
    setImageUrls((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function toggleCollection(colId: string) {
    setSelectedCollectionIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId],
    );
  }

  const filledImages = imageUrls.filter((u) => u.trim());

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(withSiteId(`/api/admin/products/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          is_active: isActive,
          sale_price: salePrice.trim() || null,
          mrp: mrp.trim() || null,
          descriptionSections: sections,
          images: imageUrls.filter((u) => u.trim()),
          collectionIds: selectedCollectionIds,
          size: size,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setMessage({ text: "Product enrichment saved successfully!", type: "success" });
      // Reload to get fresh data
      await loadProduct();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to save",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#008060]" />
          <p className="text-[13px] text-[#6d7175]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-[15px] font-medium text-[#6d7175]">Product not found</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#008060] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#006e52]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const descTabs = [
    {
      key: "highlights" as const,
      label: "Highlights",
      icon: <Sparkles className="h-4 w-4 shrink-0" />,
      placeholder: "Key features, USPs, and bullet points that make this product special...\n\n• Feature one\n• Feature two\n• Feature three"
    },
    {
      key: "details" as const,
      label: "Details & Specs",
      icon: <ClipboardList className="h-4 w-4 shrink-0" />,
      placeholder: "Material, dimensions, weight, included items, compatibility...\n\nMaterial: 100% Cotton\nDimensions: 90\" x 100\"\nWeight: 800g"
    },
    {
      key: "care" as const,
      label: "Care Instructions",
      icon: <Droplet className="h-4 w-4 shrink-0" />,
      placeholder: "Washing, drying, storage tips for the product...\n\n• Machine wash cold\n• Tumble dry low\n• Do not bleach"
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Back & Title */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d6d9dc] bg-white text-[#6d7175] transition-all hover:bg-[#f6f6f7] hover:text-[#202223]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-[#202223]">{title || product.title}</h2>
            <p className="mt-0.5 text-[12px] text-[#8c9196]">
              /{product.slug}
              {product.variant?.sku ? ` · SKU: ${product.variant.sku}` : ""}
              {product.variant?.sale_price ? ` · ₹${product.variant.sale_price}` : ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008060] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_0_rgba(0,0,0,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all hover:bg-[#006e52] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px] font-medium ${
            message.type === "success"
              ? "border-[#b6d3b2] bg-[#e3f1df] text-[#1a5e1a]"
              : "border-[#e0b3b3] bg-[#fdf0f0] text-[#d72c0d]"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <X className="h-4 w-4 shrink-0" />
          )}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── LEFT: Images & Description ── */}
        <div className="grid gap-6">
          {/* ── IMAGES SECTION ── */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#e1e3e5] px-5 py-4">
              <div className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-[#008060]" />
                <h3 className="text-[15px] font-semibold text-[#202223]">Product Images</h3>
                <span className="ml-auto rounded-full bg-[#f3f5f7] px-2.5 py-0.5 text-[11px] font-semibold text-[#6d7175]">
                  {filledImages.length} / {MAX_IMAGES}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#8c9196]">
                Add up to 10 high-quality images. First image is used as the main thumbnail.
              </p>
            </div>

            <div className="p-5">
              {/* Preview Grid */}
              <div className="mb-6 grid grid-cols-5 gap-3.5">
                {filledImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-[#e1e3e5] bg-[#fafbfc] transition-all hover:shadow-md hover:border-[#8c9196]"
                  >
                    <Image
                      src={url}
                      alt={`Product ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    {idx === 0 ? (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-[#008060] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                        Main
                      </span>
                    ) : (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white/90">
                        #{idx + 1}
                      </span>
                    )}
                    
                    {/* Hover controls overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-1.5 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                      {/* Top controls (Delete) */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeImage(idx)}
                          className="rounded-lg bg-red-500/90 p-1.5 text-white hover:bg-red-600 shadow-md transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Bottom controls (Reordering) */}
                      <div className="flex justify-between gap-1">
                        {idx > 0 ? (
                          <button
                            onClick={() => moveImage(idx, idx - 1)}
                            className="rounded-lg bg-white/90 p-1 text-[#202223] hover:bg-white shadow-sm transition-colors"
                            title="Move Left"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        ) : (
                          <div />
                        )}
                        {idx < filledImages.length - 1 ? (
                          <button
                            onClick={() => moveImage(idx, idx + 1)}
                            className="rounded-lg bg-white/90 p-1 text-[#202223] hover:bg-white shadow-sm transition-colors"
                            title="Move Right"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add new image placeholder card */}
                {filledImages.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => {
                      const inputs = document.querySelectorAll('input[type="url"]');
                      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
                      if (lastInput) {
                        lastInput.focus();
                        lastInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9cccf] bg-white text-[#6d7175] transition-all hover:bg-[#fafbfc] hover:border-[#008060] hover:text-[#008060]"
                  >
                    <ImagePlus className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                  </button>
                )}
              </div>

              {/* URL Inputs */}
              <div className="grid gap-2.5 border-t border-[#f1f2f3] pt-4">
                <span className="text-[12px] font-semibold text-[#6d7175]">Image URL Sources</span>
                {Array.from({ length: Math.min(MAX_IMAGES, filledImages.length + 1) }).map((_, idx) => {
                  const url = imageUrls[idx] || "";
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 text-right text-[11px] font-bold text-[#8c9196]">
                        {idx + 1}
                      </span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImage(idx, e.target.value)}
                        placeholder={idx === 0 ? "Main image URL (required)" : `Paste image URL here...`}
                        className={`flex-1 rounded-lg border px-3 py-2 text-[13px] transition-colors focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20 ${
                          url.trim()
                            ? "border-[#b6d3b2] bg-[#f8fcf8]"
                            : "border-[#d6d9dc] bg-white border-dashed"
                        }`}
                      />
                      {url.trim() && (
                        <button
                          onClick={() => removeImage(idx)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c9196] transition-colors hover:bg-[#fdf0f0] hover:text-[#d72c0d]"
                          title="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── DESCRIPTION SECTIONS ── */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#e1e3e5] px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#008060]" />
                <h3 className="text-[15px] font-semibold text-[#202223]">
                  Product Description
                </h3>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e1e3e5]">
              {descTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-semibold transition-all ${
                    activeTab === tab.key
                      ? "border-b-2 border-[#008060] bg-[#f0fdf9] text-[#008060]"
                      : "text-[#6d7175] hover:bg-[#f6f6f7] hover:text-[#202223]"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {sections[tab.key]?.some(r => r.value.trim()) && (
                    <Check className="ml-1 inline-block h-3.5 w-3.5 text-[#008060] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6d7175]">
                  Manage specifications and highlights as custom key-value rows.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSections((prev) => {
                      const next = { ...prev };
                      next[activeTab] = [...next[activeTab], { label: "", value: "" }];
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#008060] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#008060] hover:bg-[#008060]/5 transition-colors"
                >
                  + Add Row
                </button>
              </div>

              {!sections[activeTab] || sections[activeTab].length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#c9cccf] py-8 text-center">
                  <p className="text-[13px] text-[#6d7175]">No rows added yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSections((prev) => {
                        const next = { ...prev };
                        const defaultLabel = activeTab === "highlights" ? "Highlight" : activeTab === "details" ? "Detail" : "Care";
                        next[activeTab] = [
                          { label: defaultLabel, value: "" }
                        ];
                        return next;
                      });
                    }}
                    className="mt-2 text-[12px] font-bold text-[#008060] hover:underline"
                  >
                    Add custom row template
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {sections[activeTab].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      {/* Drag / Reorder Handle */}
                      <div className="flex flex-col gap-1 text-[#8c9196]">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSections((prev) => {
                                const next = { ...prev };
                                const list = [...next[activeTab]];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                next[activeTab] = list;
                                return next;
                              });
                            }}
                            className="hover:text-[#202223] transition-colors"
                            title="Move Up"
                          >
                            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                          </button>
                        )}
                        {idx < sections[activeTab].length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSections((prev) => {
                                const next = { ...prev };
                                const list = [...next[activeTab]];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                next[activeTab] = list;
                                return next;
                              });
                            }}
                            className="hover:text-[#202223] transition-colors"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Label Input */}
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => {
                          setSections((prev) => {
                            const next = { ...prev };
                            const list = [...next[activeTab]];
                            list[idx] = { ...list[idx], label: e.target.value };
                            next[activeTab] = list;
                            return next;
                          });
                        }}
                        placeholder="Label"
                        className="w-[180px] shrink-0 rounded-lg border border-[#d6d9dc] px-3 py-2 text-[13px] font-semibold text-[#202223] focus:border-[#008060] focus:outline-none focus:ring-1 focus:ring-[#008060]/20"
                      />

                      {/* Value Input */}
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => {
                          setSections((prev) => {
                            const next = { ...prev };
                            const list = [...next[activeTab]];
                            list[idx] = { ...list[idx], value: e.target.value };
                            next[activeTab] = list;
                            return next;
                          });
                        }}
                        placeholder="Value"
                        className="flex-1 rounded-lg border border-[#d6d9dc] px-3 py-2 text-[13px] text-[#202223] focus:border-[#008060] focus:outline-none focus:ring-1 focus:ring-[#008060]/20"
                      />

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSections((prev) => {
                            const next = { ...prev };
                            const list = [...next[activeTab]];
                            list.splice(idx, 1);
                            next[activeTab] = list;
                            return next;
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c9196] hover:bg-red-50 hover:text-[#d72c0d] transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="grid gap-6 self-start">
          {/* Product Status Card */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#6d7175]">
              Status
            </h3>
            <div className="mt-3">
              <label className="text-[12px] font-medium text-[#6d7175]">Product Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d6d9dc] px-3 py-2 text-[13px] text-[#202223] focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? "bg-[#008060]" : "bg-[#ffc453]"
                }`}
              />
              <span className="text-[14px] font-medium text-[#202223]">
                {isActive ? "Active" : "Draft"}
              </span>
            </div>
            <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#202223]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-[#c9cccf]"
              />
              Product Active
            </label>
            {product.variant && (
              <div className="mt-4 grid gap-2 border-t border-[#f1f2f3] pt-4">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6d7175]">Price</span>
                  <span className="font-semibold text-[#202223]">
                    ₹{salePrice || "0"}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#6d7175]">MRP</span>
                  <span className="text-[#6d7175] line-through">
                    ₹{mrp || "0"}
                  </span>
                </div>
                {sku && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#6d7175]">SKU</span>
                    <span className="font-mono text-[12px] text-[#202223]">
                      {sku}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 grid gap-3 border-t border-[#f1f2f3] pt-4">
              <div className="grid gap-1">
                <label className="text-[12px] font-medium text-[#6d7175]">Sale Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="no-spinner rounded-lg border border-[#d6d9dc] px-3 py-2 text-[13px] text-[#202223] focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-[12px] font-medium text-[#6d7175]">MRP</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="no-spinner rounded-lg border border-[#d6d9dc] px-3 py-2 text-[13px] text-[#202223] focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-[12px] font-medium text-[#6d7175]">SKU</label>
                <div className="rounded-lg border border-[#e1e3e5] bg-[#f6f6f7] px-3 py-2 font-mono text-[12px] text-[#6d7175]">
                  {sku || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Size / Attributes Card */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#6d7175]">
              Attributes
            </h3>
            <div className="grid gap-2">
              <label className="text-[12px] font-medium text-[#6d7175]">Size</label>
              <div className="relative">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#d6d9dc] bg-white px-3 py-2.5 pr-10 text-[13px] text-[#202223] transition-colors hover:border-[#008060] focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                >
                  <option value="">Select Size...</option>
                  <option value="Single">Single</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                  <option value="Super King">Super King</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c9196]" />
              </div>
            </div>
          </div>

          {/* Collections Card */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#e1e3e5] px-5 py-4">
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#6d7175]">
                Collections
              </h3>
              <p className="mt-0.5 text-[11px] text-[#8c9196]">
                Assign this product to one or more collections
              </p>
            </div>
            <div className="p-5">
              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCollectionDropdownOpen(!collectionDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-[#d6d9dc] bg-white px-3 py-2.5 text-[13px] text-[#202223] transition-colors hover:border-[#008060] focus:border-[#008060] focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                >
                  <span>
                    {selectedCollectionIds.length === 0
                      ? "Select collections..."
                      : `${selectedCollectionIds.length} selected`}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8c9196] transition-transform ${
                      collectionDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {collectionDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[#e1e3e5] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                    {allCollections.length === 0 ? (
                      <p className="px-3 py-4 text-center text-[13px] text-[#8c9196]">
                        No collections yet.{" "}
                        <Link href="/collections" className="text-[#008060] underline">
                          Create one
                        </Link>
                      </p>
                    ) : (
                      allCollections.map((col) => {
                        const isSelected = selectedCollectionIds.includes(col.id);
                        return (
                          <button
                            key={col.id}
                            onClick={() => toggleCollection(col.id)}
                            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] transition-colors ${
                              isSelected
                                ? "bg-[#e3f1df] text-[#1a5e1a]"
                                : "text-[#202223] hover:bg-[#f9fafb]"
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                isSelected
                                  ? "border-[#008060] bg-[#008060]"
                                  : "border-[#c9cccf] bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="flex-1 truncate">{col.name}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Selected tags */}
              {selectedCollectionIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedCollectionIds.map((colId) => {
                    const col = allCollections.find((c) => c.id === colId);
                    if (!col) return null;
                    return (
                      <span
                        key={colId}
                        className="inline-flex items-center gap-1 rounded-full bg-[#e3f1df] px-2.5 py-1 text-[11px] font-semibold text-[#008060]"
                      >
                        {col.name}
                        <button
                          onClick={() => toggleCollection(colId)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-[#b6d3b2]"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-[#e1e3e5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#6d7175]">
              Quick Actions
            </h3>
            <div className="grid gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-[#008060] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#006e52] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save All Changes"}
              </button>
              <Link
                href="/products"
                className="w-full rounded-lg border border-[#d6d9dc] bg-white px-4 py-2.5 text-center text-[13px] font-semibold text-[#202223] transition-colors hover:bg-[#f6f6f7]"
              >
                Discard & Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
