/**
 * Builder Canvas Section Previews
 * 
 * Each component renders a WYSIWYG preview of a storefront section.
 * These use the EXACT same HTML structure and Tailwind classes as
 * the QuirkyHome storefront components, minus framer-motion animations.
 * 
 * Since the AdminPanel and QuirkyHome share identical tailwind.config.ts
 * (same CSS custom properties / design tokens), these previews are
 * pixel-perfect matches of the live storefront.
 */

import React, { useState, useEffect } from "react";
import type { Section } from "@/lib/builder/types";
import { withSiteId } from "@/lib/site-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── BannerStrip ──────────────────────────────────────────── */

export function BannerStripPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <div
      className="px-4 py-2.5 text-center text-sm font-semibold"
      style={{
        backgroundColor: settings.bgColor || "#008060",
        color: settings.textColor || "#ffffff",
      }}
    >
      {settings.text}
    </div>
  );
}

/* ─── HeroBanner (matches HeroSection.tsx 1:1) ─────────────── */

export function HeroBannerPreview({ settings }: { settings: Section["settings"] }) {
  const heading = settings.heading || "Buy Home Decor Items Online for Every Indian Home";
  const subheading = settings.subheading || "Shop bedsheets, wall decor, table lamps, kitchen essentials, dining pieces, planters, gifts, and curated home accessories at friendly prices.";
  const badgeText = settings.badgeText || "Festive Home Refresh Sale";
  const button1Text = settings.button1Text || "Shop the Sale";
  const button2Text = settings.button2Text || "Explore Collections";
  const imageUrl = settings.imageUrl || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80";
  const feature1 = settings.feature1 || "Fast delivery";
  const feature2 = settings.feature2 || "Secure checkout";
  const feature3 = settings.feature3 || "Curated picks";

  return (
    <section className="bg-background-elevated">
      <div className="qh-container py-4 md:py-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background-soft shadow-soft">
          <img src={imageUrl} alt="" className="h-[360px] w-full object-cover md:h-[460px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/10 md:from-black/55 md:via-black/25 md:to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-xl p-5 md:p-10">
          {badgeText && (
                <div className="mb-4 w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#202223] inline-flex items-center">
              ✨ {badgeText}
            </div>
          )}
              <h1 className="font-display text-[1.75rem] font-black leading-tight text-white md:text-[2.6rem]">
                {heading}
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">{subheading}</p>
              <div className="mt-6 bp-btn-group">
            {button1Text && (
                  <span className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#202223] shadow-glow md:h-12 md:px-8 md:text-base">
                {button1Text}
              </span>
            )}
            {button2Text && (
                  <span className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-transparent px-6 text-sm font-semibold text-white md:h-12 md:px-8 md:text-base">
                {button2Text}
              </span>
            )}
              </div>
              <div className="mt-6 bp-features font-bold text-white/95">
            {feature1 && <div className="flex items-center gap-2">🚚 {feature1}</div>}
            {feature2 && <div className="flex items-center gap-2">🛡️ {feature2}</div>}
            {feature3 && <div className="flex items-center gap-2">✨ {feature3}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SearchBand (matches page.tsx search chips) ───────────── */

export function SearchBandPreview({ settings }: { settings: Section["settings"] }) {
  const chips = (settings.chips || "").split(",").map((c: string) => c.trim()).filter(Boolean);
  return (
    <section className="qh-market-band">
      <div className="qh-container flex flex-wrap items-center gap-3 py-4">
        <span className="text-sm font-black text-text-main">{settings.label || "Search for"}</span>
        {chips.map((chip: string) => (
          <span key={chip} className="bp-chip rounded-full border border-text-main/10 bg-background-elevated px-4 py-2 text-sm font-bold text-text-main shadow-soft">
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─── CategoryGrid (matches CategoryGrid.tsx) ──────────────── */

export function CategoryGridPreview({ settings }: { settings: Section["settings"] }) {
  const eyebrow = settings.eyebrow || "Shop by category";
  const heading = settings.heading || "Home decor, furnishing and essentials";
  const subheading = settings.subheading || "Find bedding, wall decor, lighting, kitchen, dining, bath, garden, gifts, storage and showpieces in one place.";

  const demoCategories = [
    { name: "Bedding", image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=300&q=60" },
    { name: "Furnishing", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=60" },
    { name: "Organiser", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=60" },
    { name: "Bath Gifts", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=60" },
    { name: "New Arrival", image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=300&q=60" },
  ];

  return (
    <section className="qh-container qh-section-pad">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
        <p className="mt-3 text-base leading-relaxed text-text-muted">{subheading}</p>
      </div>
      <div className="grid bp-cat-grid gap-y-7">
        {demoCategories.map((cat) => (
          <div key={cat.name} className="block text-center">
            <div className="relative mx-auto bp-cat-img overflow-hidden rounded-full border border-border bg-background-elevated shadow-soft">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
            </div>
            <div className="pt-3">
              <h3 className="text-base font-bold text-text-main">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CollectionsSection (matches CollectionsSection.tsx) ──── */

export function CollectionsSectionPreview({ settings }: { settings: Section["settings"] }) {
  const eyebrow = settings.eyebrow || "Collections";
  const heading = settings.heading || "Shop by collection";
  const subheading = settings.subheading || "Curated product sets to help you discover your style.";
  const collectionSlug = settings.collectionSlug || "";

  const [selectedCol, setSelectedCol] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collectionSlug) {
      setSelectedCol(null);
      return;
    }
    setLoading(true);
    fetch(withSiteId(`/api/admin/collections?products=1`))
      .then((r) => r.json())
      .then((data) => {
        const found = data.collections?.find((c: any) => c.slug === collectionSlug);
        setSelectedCol(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [collectionSlug]);

  return (
    <section className="qh-container qh-section-pad">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
        <p className="mt-3 text-base leading-relaxed text-text-muted">{subheading}</p>
      </div>

      {!collectionSlug ? (
        <div className="rounded-xl border-2 border-dashed border-border p-8 text-center text-text-muted bg-background-elevated">
          📂 Please select a collection in the sidebar settings.
        </div>
      ) : loading ? (
        <div className="text-center text-text-muted py-8 bg-background-elevated rounded-xl border border-border">Loading collection preview...</div>
      ) : selectedCol ? (
        /* Single premium collection row layout — exactly 1 collection per row */
        <div className="group rounded-2xl border border-border bg-background-elevated overflow-hidden shadow-soft transition-all duration-base hover:shadow-dropdown">
          <div className="grid md:grid-cols-12 items-stretch divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Info and Banner block (left 5 columns) */}
            <div className="md:col-span-5 p-6 flex flex-col justify-between bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent">
              <div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">Collection Spotlight</span>
                  {selectedCol.is_active === false && (
                    <span className="rounded-full bg-[#ffe0b2] border border-[#ffb74d] px-2.5 py-0.5 text-[10px] font-bold text-[#e65100] inline-flex items-center gap-1 shadow-sm animate-pulse">
                      ⚠️ Hidden from Storefront
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-2xl font-black text-text-main group-hover:text-brand-primary transition-colors">{selectedCol.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted line-clamp-4">
                  {selectedCol.description || "Explore our carefully handpicked items curated for high quality and beautiful aesthetics."}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-soft">{selectedCol.products?.length || 0} product(s) inside</span>
                <span className="text-sm font-bold text-brand-primary group-hover:translate-x-1 transition-transform">View Collection →</span>
              </div>
            </div>
            {/* Products grid preview (right 7 columns) */}
            <div className="md:col-span-7 bg-background-soft p-6 flex items-center justify-center">
              {selectedCol.products && selectedCol.products.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 w-full">
                  {selectedCol.products.slice(0, 3).map((slug: string, i: number) => (
                    <div key={slug} className="aspect-square bg-background-elevated rounded-xl border border-border/40 overflow-hidden relative shadow-soft">
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-text-soft bg-background-muted">
                        Product {i + 1}
                      </div>
                      <span className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-white">#{i+1}</span>
                    </div>
                  ))}
                  {selectedCol.products.length < 3 && Array.from({ length: 3 - selectedCol.products.length }).map((_, i) => (
                    <div key={i} className="aspect-square bg-background-elevated/40 border border-dashed border-border rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="text-center text-text-soft text-sm">No products in this collection yet.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500 py-4 bg-background-elevated rounded-xl border border-border">Selected collection not found.</div>
      )}
    </section>
  );
}

/* ─── ProductGrid (matches page.tsx product section) ───────── */

export function ProductGridPreview({ settings }: { settings: Section["settings"] }) {
  const eyebrow = settings.eyebrow || "Sale picks";
  const heading = settings.heading || "Premium finds, friendly prices";
  const subheading = settings.subheading || "Shop bestselling home decor products.";
  const cols = parseInt(settings.columns || "4");
  const rows = parseInt(settings.rows || "2");
  const gap = parseInt(settings.gap || "24");
  const total = cols * rows;
  const source = settings.productSource || "manual";
  const selectedIds: string[] = settings.productIds || [];

  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetch(withSiteId("/api/admin/products"))
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Filter by selected IDs or show all
  let displayProducts = products;
  if (source === "manual" && selectedIds.length > 0) {
    displayProducts = products.filter(p => selectedIds.includes(p.id));
  }
  displayProducts = displayProducts.slice(0, total);

  // Pad with placeholders if not enough
  const cards = [...displayProducts];
  while (cards.length < total) cards.push(null);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <section className="qh-container qh-section-pad">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
        <p className="mt-3 text-base leading-relaxed text-text-muted">{subheading}</p>
      </div>
      <div className="mb-3 flex items-center gap-2 text-[11px] text-text-muted">
        <span className="rounded bg-background-soft px-2 py-0.5 font-semibold">
          {source === "manual" ? `Manual • ${selectedIds.length} selected` : source === "latest" ? "Latest" : "All"}
        </span>
        <span>{cols}×{rows} = {total} cards</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }}>
        {cards.map((p, i) => (
          <div key={p?.id || i} className="qh-card overflow-hidden">
            <div className="relative rounded-b-none rounded-t-xl bg-background-soft" style={{ aspectRatio: "1/1" }}>
              {p?.image_url ? (
                <img src={p.image_url} alt="" className="h-full w-full object-cover rounded-t-xl" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-text-soft">Product {i + 1}</div>
              )}
              {p && <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-yellow-400">★ 4.5</div>}
              {p && Number(p.mrp) > Number(p.sale_price) && (
                <div className="absolute left-2 top-2">
                  <span className="rounded-full bg-accent-sale px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {Math.round(((Number(p.mrp) - Number(p.sale_price)) / Number(p.mrp)) * 100)}% Off
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-text-main">{p?.title || "Sample Product"}</h3>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-base font-bold text-text-main">{p ? fmt(Number(p.sale_price || p.mrp || 599)) : "₹599"}</span>
                {p?.mrp && Number(p.mrp) > Number(p.sale_price) && <span className="text-xs text-text-soft line-through">{fmt(Number(p.mrp))}</span>}
              </div>
              <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-background-elevated px-4 py-2 text-xs font-semibold text-text-main">
                🛒 Add to Cart
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



/* ─── PromisesSection (matches page.tsx promises) ──────────── */

export function PromisesSectionPreview({ settings }: { settings: Section["settings"] }) {
  const eyebrow = settings.eyebrow || "Why choose us";
  const heading = settings.heading || "A calmer, warmer way to shop for home";

  const promises = [
    { emoji: "✨", title: "Curated decor", text: "Thoughtfully selected pieces with warmth and personality." },
    { emoji: "🛡️", title: "Premium quality", text: "Affordable luxury without fragile showroom energy." },
    { emoji: "↩️", title: "Easy returns", text: "A smoother post-purchase experience for real life." },
    { emoji: "🚚", title: "Fast shipping", text: "Quick dispatch across India on everyday favourites." },
    { emoji: "💳", title: "Secure payments", text: "UPI, cards, wallets, and protected checkout flows." },
  ];

  return (
    <section className="qh-container qh-section-pad">
      <div className="mb-8 mx-auto max-w-narrow text-center">
        <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
      </div>
      <div className="grid bp-promises-grid">
        {promises.map((item) => (
          <div key={item.title} className="qh-card p-5 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background-soft text-brand-primary text-xl">
              {item.emoji}
            </div>
            <h3 className="font-semibold text-text-main">{item.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter (matches page.tsx newsletter) ─────────────── */

export function NewsletterPreview({ settings }: { settings: Section["settings"] }) {
  const eyebrow = settings.eyebrow || "Decor notes";
  const heading = settings.heading || "Ideas, offers and new drops";
  const subheading = settings.subheading || "Get room styling inspiration, festive sale alerts and new home essentials in your inbox.";
  const buttonText = settings.buttonText || "Join Newsletter";

  return (
    <section className="qh-container qh-section-pad">
      <div className="grid gap-6 rounded-lg bg-background-soft p-6 qh-newsletter-grid items-center">
        <div>
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
            <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-text-muted">{subheading}</p>
          </div>
        </div>
        <div className="grid gap-3">
          <input className="h-12 rounded-full border border-border bg-background-elevated px-5 text-text-main placeholder:text-text-soft" placeholder="Enter email for decor notes" readOnly />
          <span className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-base font-semibold text-text-inverse shadow-glow">
            {buttonText}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── SeoArticle (matches page.tsx SEO section) ────────────── */

export function SeoArticlePreview({ settings }: { settings: Section["settings"] }) {
  const allowedTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
  const headingTag = allowedTags.has(String(settings.headingTag || "")) ? String(settings.headingTag) : "h2";
  const subheadingTag = allowedTags.has(String(settings.subheadingTag || "")) ? String(settings.subheadingTag) : "h2";
  const HeadingTag = headingTag as any;
  const SubheadingTag = subheadingTag as any;

  if (
    typeof settings.content === "string" &&
    settings.content.includes("<") &&
    settings.content.includes(">")
  ) {
    return (
      <section className="qh-container qh-section-pad">
        <article
          className="qh-seo-copy max-w-none rounded-lg border border-border bg-background-elevated p-6 md:p-8"
          dangerouslySetInnerHTML={{ __html: settings.content || "" }}
        />
      </section>
    );
  }

  return (
    <section className="qh-container qh-section-pad">
      <article className="qh-seo-copy max-w-none rounded-lg border border-border bg-background-elevated p-6 md:p-8">
        {settings.headingText ? <HeadingTag>{String(settings.headingText)}</HeadingTag> : null}
        {settings.content ? <p>{String(settings.content)}</p> : null}
        {settings.subheadingText ? <SubheadingTag>{String(settings.subheadingText)}</SubheadingTag> : null}
        {settings.content2 ? <p>{String(settings.content2)}</p> : null}
      </article>
    </section>
  );
}

/* ─── Testimonials ─────────────────────────────────────────── */

export function TestimonialsPreview({ settings }: { settings: Section["settings"] }) {
  const testimonials = [
    { name: settings.testimonial1Name, text: settings.testimonial1Text },
    { name: settings.testimonial2Name, text: settings.testimonial2Text },
    { name: settings.testimonial3Name, text: settings.testimonial3Text },
  ].filter((t) => t.name && t.text);

  return (
    <section className="qh-container qh-section-pad">
      <h2 className="mb-8 text-center font-bold text-text-main">{settings.heading}</h2>
      <div className="grid bp-testimonial-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="qh-card p-6">
            <div className="mb-3 text-2xl text-brand-primary">"</div>
            <p className="text-sm leading-relaxed text-text-muted">{t.text}</p>
            <p className="mt-4 text-sm font-semibold text-text-main">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── RichText ─────────────────────────────────────────────── */

export function RichTextPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad text-center">
      <div dangerouslySetInnerHTML={{ __html: settings.content || "" }} />
    </section>
  );
}

/* ─── ImageWithText ────────────────────────────────────────── */

export function ImageWithTextPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad bp-img-text">
      <img src={settings.imageUrl || "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80"} alt="" className="rounded-lg object-cover w-full" style={{ maxHeight: 400 }} />
      <div>
        <h2 className="text-3xl font-bold mb-4 text-text-main">{settings.heading}</h2>
        <p className="text-text-muted mb-6">{settings.text}</p>
      </div>
    </section>
  );
}

/* ─── FeaturedCollection ───────────────────────────────────── */

export function FeaturedCollectionPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad">
      <h2 className="text-2xl font-bold mb-6 text-center text-text-main">{settings.heading}</h2>
      <div className="text-center text-text-muted">Featured Collection: {settings.collectionId || "None"}</div>
    </section>
  );
}

/* ─── Slideshow ─────────────────────────────────────────────── */

export function SlideshowPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <div className="relative overflow-hidden" style={{ height: settings.height || "500px" }}>
      <img src={settings.slide1Image || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="font-black text-white">{settings.slide1Heading || "New Season Collection"}</h2>
        <p className="mt-3 text-lg opacity-90">{settings.slide1Subtext || "Explore our latest arrivals"}</p>
      </div>
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-white" /><div className="h-2.5 w-2.5 rounded-full bg-white/50" />
      </div>
    </div>
  );
}

/* ─── ImageGrid Preview ────────────────────────────────────── */

export function ImageGridPreview({ settings }: { settings: Section["settings"] }) {
  const gap = settings.gap ?? 12;
  const radius = settings.borderRadius ?? 12;
  const height = settings.desktopHeight ?? 360;

  const uid = `qh-preview-imggrid-${Math.random().toString(36).slice(2, 8)}`;
  const css = `
    .${uid} {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: repeat(2, ${Math.round(height / 2)}px);
      gap: ${gap}px;
      height: ${height}px;
    }
    .${uid} > div {
      height: 100%;
      width: 100%;
    }
    .${uid} .qh-ig-large {
      grid-row: 1 / 3;
    }

    @container (max-width: 767px) {
      .${uid} {
        grid-template-columns: repeat(2, 1fr) !important;
        grid-template-rows: auto auto !important;
        height: auto !important;
        gap: ${gap}px !important;
      }
      .${uid} > div {
        height: 160px !important;
      }
      .${uid} .qh-ig-large {
        grid-column: span 2 !important;
        grid-row: auto !important;
        height: 240px !important;
      }
    }
  `;

  const renderSlot = (imageUrl: string, alt: string, placeholder: string) => (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-full w-full"
      style={{ borderRadius: `${radius}px` }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt || ""} className="absolute inset-0 h-full w-full object-cover" style={{ borderRadius: `${radius}px` }} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span className="text-xs font-medium">{placeholder}</span>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "16px 24px" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={uid}>
        <div className="qh-ig-large">
          {renderSlot(settings.image1Url, settings.image1Alt, "Image 1 (Large — Left)")}
        </div>
        <div>
          {renderSlot(settings.image2Url, settings.image2Alt, "Image 2 (Top Right)")}
        </div>
        <div>
          {renderSlot(settings.image3Url, settings.image3Alt, "Image 3 (Bottom Right)")}
        </div>
      </div>
    </div>
  );
}

/* ─── ImageBanner Preview ──────────────────────────────────── */

export function ImageBannerPreview({ settings }: { settings: Section["settings"] }) {
  const height = settings.desktopHeight ?? 280;
  const radius = settings.borderRadius ?? 12;
  const fullWidth = settings.fullWidth ?? false;
  const imageUrl = settings.desktopImageUrl || settings.imageUrl || "";

  return (
    <div style={{ maxWidth: fullWidth ? "100%" : "var(--container-max)", margin: "0 auto", padding: fullWidth ? "0" : "16px 24px" }}>
      <div
        className="relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200"
        style={{
          height: `${height}px`,
          borderRadius: fullWidth ? "0" : `${radius}px`,
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={settings.altText || ""} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span className="text-sm font-medium">Upload a banner image</span>
            <span className="text-xs text-gray-300">Recommended: 1920 × {height}px</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ReelImage Preview ────────────────────────────────────── */

export function ReelImagePreview({ settings }: { settings: Section["settings"] }) {
  const cardH = settings.cardHeight ?? 400;
  const gap = settings.gap ?? 16;
  const radius = settings.borderRadius ?? 16;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Collect reel items
  const reels: { image: string; text: string }[] = [];
  for (let i = 1; i <= 8; i++) {
    const img = settings[`reel${i}Image`];
    if (img) reels.push({ image: img, text: settings[`reel${i}Text`] || "" });
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(handleScroll, 500);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [reels.length]);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -container.clientWidth * 0.75 : container.clientWidth * 0.75;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const scrollContainerCss = `
    .qh-reel-scroll-preview::-webkit-scrollbar { display: none; }
    .qh-reel-scroll-preview { -ms-overflow-style: none; scrollbar-width: none; }
    @media (max-width: 768px) {
      .qh-reel-card-preview {
        height: ${Math.min(cardH, 320)}px !important;
      }
    }
  `;

  const hasItems = reels.length > 0;
  const displayItems = hasItems ? reels : Array.from({ length: 4 }).map((_, i) => ({
    image: "",
    text: `Reel ${i + 1}`,
  }));

  return (
    <div className="relative w-full overflow-hidden py-10 md:py-16">
      {settings.heading && <h2 className="mb-8 text-center font-display text-3xl font-black tracking-tight text-text-main md:text-4xl">{settings.heading}</h2>}
      <style dangerouslySetInnerHTML={{ __html: scrollContainerCss }} />
      
      <div className="relative group/arrows w-full">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-background-elevated text-text-main shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-105 border border-border/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2]" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-background-elevated text-text-main shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all hover:scale-105 border border-border/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 stroke-[2]" />
          </button>
        )}

        <div
          ref={containerRef}
          className="qh-reel-scroll-preview flex overflow-x-auto snap-x snap-mandatory px-4 md:px-12"
          style={{ gap: \`\${gap}px\` }}
        >
          {displayItems.map((reel, i) => {
            const inner = (
              <div
                className="qh-reel-card-preview relative overflow-hidden group/card bg-gray-100 shadow-sm transition-shadow hover:shadow-lg"
                style={{
                  height: \`\${cardH}px\`,
                  aspectRatio: "9/16",
                  borderRadius: \`\${radius}px\`,
                }}
              >
                {reel.image ? (
                  <img
                    src={reel.image}
                    alt={reel.text || ""}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <span className="text-xs font-medium">{reel.text}</span>
                  </div>
                )}
                {reel.image && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover/card:opacity-100" />}
                {reel.text && reel.image && (
                  <div className="absolute inset-x-0 bottom-0 p-4 pb-6 text-center transform transition-transform duration-300 group-hover/card:-translate-y-1">
                    <p className="text-base md:text-lg font-bold text-white drop-shadow-md">{reel.text}</p>
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={i}
                className="shrink-0 snap-start animate-fade-in"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Multicolumn ──────────────────────────────────────────── */

export function MulticolumnPreview({ settings }: { settings: Section["settings"] }) {
  const cols = parseInt(settings.columns) || 3;
  const columns = [
    { title: settings.col1Title, text: settings.col1Text, image: settings.col1Image },
    { title: settings.col2Title, text: settings.col2Text, image: settings.col2Image },
    { title: settings.col3Title, text: settings.col3Text, image: settings.col3Image },
    { title: settings.col4Title, text: settings.col4Text, image: settings.col4Image },
  ].slice(0, cols).filter((c) => c.title);

  return (
    <section className="qh-container qh-section-pad">
      {settings.heading && <h2 className="mb-8 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>}
      <div className="grid bp-multi-grid" style={{ "--bp-cols": cols } as React.CSSProperties}>
        {columns.map((col, i) => (
          <div key={i} className="qh-card p-6 text-center">
            {col.image ? <img src={col.image} alt="" className="mx-auto mb-4 h-16 w-16 rounded-full object-cover" /> : <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-background-soft" />}
            <h3 className="font-semibold text-text-main">{col.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{col.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CollapsibleContent ───────────────────────────────────── */

export function CollapsibleContentPreview({ settings }: { settings: Section["settings"] }) {
  const faqs = [
    { q: settings.q1, a: settings.a1 }, { q: settings.q2, a: settings.a2 },
    { q: settings.q3, a: settings.a3 }, { q: settings.q4, a: settings.a4 },
    { q: settings.q5, a: settings.a5 },
  ].filter((f) => f.q);

  return (
    <section className="qh-container qh-section-pad">
      <h2 className="mb-8 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>
      <div className="mx-auto max-w-2xl grid gap-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-border bg-background-elevated">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-semibold text-text-main">{faq.q}</span>
              <span className="text-text-muted">+</span>
            </div>
            {i === 0 && <div className="border-t border-border px-5 py-4 text-sm text-text-muted">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Video ─────────────────────────────────────────────────── */

export function VideoPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad">
      {settings.heading && <h2 className="mb-6 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>}
      <div className="relative mx-auto aspect-video max-w-3xl overflow-hidden rounded-xl bg-background-soft">
        {settings.videoUrl ? (
          <iframe src={settings.videoUrl} className="h-full w-full" allowFullScreen title="Video" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-text-soft">▶</div>
        )}
      </div>
      {settings.description && <p className="mt-4 text-center text-text-muted">{settings.description}</p>}
    </section>
  );
}

/* ─── ContactForm ──────────────────────────────────────────── */

export function ContactFormPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-2 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>
        {settings.subheading && <p className="mb-8 text-center text-text-muted">{settings.subheading}</p>}
        <div className="grid gap-4">
          <input className="rounded-lg border border-border bg-background-elevated px-4 py-3 text-sm" placeholder="Your Name" readOnly />
          <input className="rounded-lg border border-border bg-background-elevated px-4 py-3 text-sm" placeholder="Email Address" readOnly />
          {settings.showPhone && <input className="rounded-lg border border-border bg-background-elevated px-4 py-3 text-sm" placeholder="Phone Number" readOnly />}
          <textarea className="rounded-lg border border-border bg-background-elevated px-4 py-3 text-sm" placeholder="Your Message" rows={4} readOnly />
          <span className="inline-flex items-center justify-center rounded-full bg-brand-primary py-3 font-semibold text-text-inverse">{settings.buttonText || "Send Message"}</span>
        </div>
      </div>
    </section>
  );
}

/* ─── LogoList ─────────────────────────────────────────────── */

export function LogoListPreview({ settings }: { settings: Section["settings"] }) {
  const logos = [settings.logo1, settings.logo2, settings.logo3, settings.logo4, settings.logo5].filter(Boolean);
  return (
    <section className="qh-container qh-section-pad">
      {settings.heading && <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-text-muted">{settings.heading}</h2>}
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {logos.length > 0 ? logos.map((logo, i) => (
          <img key={i} src={logo} alt="" className="h-10 object-contain opacity-60 grayscale" />
        )) : [1,2,3,4].map((i) => (
          <div key={i} className="h-10 w-24 rounded bg-background-soft" />
        ))}
      </div>
    </section>
  );
}

/* ─── FeaturedProduct ──────────────────────────────────────── */

export function FeaturedProductPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad">
      <h2 className="mb-6 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>
      <div className="mx-auto grid max-w-4xl gap-8 bp-featured-product items-center">
        <div className="aspect-square rounded-xl bg-background-soft flex items-center justify-center text-text-soft">Product Image</div>
        <div>
          <h3 className="text-2xl font-black text-text-main">Product Name</h3>
          <p className="mt-2 text-xl font-bold text-brand-primary">₹1,299</p>
          {settings.showDescription && <p className="mt-4 text-text-muted">Product description will appear here based on the selected product.</p>}
          <span className="mt-6 inline-flex rounded-full bg-brand-primary px-8 py-3 font-semibold text-text-inverse">Add to Cart</span>
        </div>
      </div>
    </section>
  );
}

/* ─── MapSection ───────────────────────────────────────────── */

export function MapSectionPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <section className="qh-container qh-section-pad">
      <h2 className="mb-6 text-center font-display text-3xl font-black text-text-main">{settings.heading}</h2>
      <div className="grid gap-6 bp-map-grid">
        <div className="aspect-video rounded-xl bg-background-soft flex items-center justify-center text-text-soft">
          {settings.mapEmbed ? <iframe src={settings.mapEmbed} className="h-full w-full rounded-xl" title="Map" /> : "📍 Map Preview"}
        </div>
        <div className="flex items-center">
          <p className="text-text-muted whitespace-pre-line">{settings.address}</p>
        </div>
      </div>
    </section>
  );
}

/* ─── CustomHTML ────────────────────────────────────────────── */

export function CustomHTMLPreview({ settings }: { settings: Section["settings"] }) {
  return <div dangerouslySetInnerHTML={{ __html: settings.content || "<div style='padding:2rem;text-align:center;color:#888'>Custom HTML</div>" }} />;
}

/* ─── Divider ──────────────────────────────────────────────── */

export function DividerPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <div style={{ paddingTop: settings.paddingTop || 32, paddingBottom: settings.paddingBottom || 32 }}>
      {settings.style === "space" ? null : (
        <hr className="qh-container border-0" style={{ height: 1, background: "var(--color-border)", borderStyle: settings.style === "dotted" ? "dotted" : "solid" }} />
      )}
    </div>
  );
}

/* ─── Component Map ────────────────────────────────────────── */

export const sectionComponentMap: Record<string, React.FC<{ settings: Section["settings"] }>> = {
  BannerStrip: BannerStripPreview,
  HeroBanner: HeroBannerPreview,
  Slideshow: SlideshowPreview,
  ImageBanner: ImageBannerPreview,
  ImageGrid: ImageGridPreview,
  SearchBand: SearchBandPreview,
  CategoryGrid: CategoryGridPreview,
  CollectionsSection: CollectionsSectionPreview,
  ProductGrid: ProductGridPreview,
  FeaturedCollection: FeaturedCollectionPreview,
  FeaturedProduct: FeaturedProductPreview,
  PromisesSection: PromisesSectionPreview,
  Multicolumn: MulticolumnPreview,
  ImageWithText: ImageWithTextPreview,
  Video: VideoPreview,
  RichText: RichTextPreview,
  CollapsibleContent: CollapsibleContentPreview,
  ContactForm: ContactFormPreview,
  Newsletter: NewsletterPreview,
  Testimonials: TestimonialsPreview,
  LogoList: LogoListPreview,
  MapSection: MapSectionPreview,
  SeoArticle: SeoArticlePreview,
  CustomHTML: CustomHTMLPreview,
  Divider: DividerPreview,
  ReelImage: ReelImagePreview,
};
