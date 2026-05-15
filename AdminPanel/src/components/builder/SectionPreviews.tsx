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
      <div className="qh-container qh-hero-grid grid gap-6 py-6">
        <div className="flex flex-col justify-center">
          {badgeText && (
            <div className="mb-5 w-fit rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-text-main inline-flex items-center">
              ✨ {badgeText}
            </div>
          )}
          <h1 className="font-display font-black leading-tight text-text-main">{heading}</h1>
          <p className="mt-5 max-w-narrow bp-text-lg leading-relaxed text-text-muted">{subheading}</p>
          <div className="mt-8 bp-btn-group">
            {button1Text && (
              <span className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-base font-semibold text-text-inverse shadow-glow">
                {button1Text}
              </span>
            )}
            {button2Text && (
              <span className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background-elevated px-8 text-base font-semibold text-text-main">
                {button2Text}
              </span>
            )}
          </div>
          <div className="mt-8 bp-features font-bold text-text-main">
            {feature1 && <div className="flex items-center gap-2">🚚 {feature1}</div>}
            {feature2 && <div className="flex items-center gap-2">🛡️ {feature2}</div>}
            {feature3 && <div className="flex items-center gap-2">✨ {feature3}</div>}
          </div>
        </div>
        <div className="relative qh-hero-media overflow-hidden rounded-lg bg-background-soft">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-5 left-5 rounded-lg border border-border bg-background-elevated p-4 shadow-dropdown">
            <p className="text-sm font-bold text-brand-primary">Up to 60% Off</p>
            <p className="text-sm text-text-muted">Bedding, lamps, wall art and more</p>
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

  const demoCollections = [
    { name: "Cozy Bedroom", count: 8 },
    { name: "Modern Living", count: 12 },
    { name: "Kitchen Essentials", count: 6 },
  ];

  return (
    <section className="qh-container qh-section-pad">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase text-brand-primary">{eyebrow}</p>
        <h2 className="font-display text-3xl font-black text-text-main">{heading}</h2>
        <p className="mt-3 text-base leading-relaxed text-text-muted">{subheading}</p>
      </div>
      <div className="mt-8 grid bp-collection-grid gap-5">
        {demoCollections.map((col) => (
          <div key={col.name} className="qh-card overflow-hidden">
            <div className="grid h-48 grid-cols-3 gap-px bg-background-muted">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background-soft flex items-center justify-center text-xs text-text-soft">
                  Product {i}
                </div>
              ))}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-black text-text-main">{col.name}</h3>
              <p className="mt-2 text-sm font-semibold text-brand-primary">
                {col.count} products →
              </p>
            </div>
          </div>
        ))}
      </div>
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
  return (
    <section className="qh-container qh-section-pad">
      <article
        className="qh-seo-copy max-w-none rounded-lg border border-border bg-background-elevated p-6 md:p-8"
        dangerouslySetInnerHTML={{ __html: settings.content || "" }}
      />
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

/* ─── ImageBanner ───────────────────────────────────────────── */

export function ImageBannerPreview({ settings }: { settings: Section["settings"] }) {
  return (
    <div className="relative overflow-hidden" style={{ height: settings.height || "400px" }}>
      <img src={settings.imageUrl || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80"} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(settings.overlayOpacity || 40) / 100})` }} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6" style={{ textAlign: settings.textAlign || "center" }}>
        <h2 className="font-black text-white">{settings.heading}</h2>
        {settings.subheading && <p className="mt-3 text-lg text-white/90">{settings.subheading}</p>}
        {settings.buttonText && <span className="mt-6 inline-flex rounded-full bg-brand-primary px-8 py-3 font-semibold text-text-inverse">{settings.buttonText}</span>}
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
};
