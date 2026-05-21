/**
 * QuirkyHome Visual Page Builder — Section Registry (Shopify-complete)
 * 
 * Every section type Shopify offers, adapted for QuirkyHome.
 */

import type { SectionDefinition } from "./types";

const _rawSections: SectionDefinition[] = [
  /* ─── HERO ─────────────────────────────────────────────────── */
  {
    type: "BannerStrip", label: "Announcement Bar", icon: "Megaphone", category: "hero",
    description: "Top-of-page promotional strip with custom colors",
    fields: [
      { key: "text", label: "Announcement Text", type: "text", defaultValue: "Free shipping on orders above ₹999!" },
      { key: "bgColor", label: "Background Color", type: "color", defaultValue: "#008060" },
      { key: "textColor", label: "Text Color", type: "color", defaultValue: "#ffffff" },
      { key: "link", label: "Link (optional)", type: "url", defaultValue: "" },
    ],
    defaultSettings: { text: "Free shipping on orders above ₹999!", bgColor: "#008060", textColor: "#ffffff", link: "" },
  },
  {
    type: "HeroBanner", label: "Hero Banner", icon: "Image", category: "hero",
    description: "Single-image hero banner optimized for mobile and desktop",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "Buy Home Decor Items Online for Every Indian Home", group: "content" },
      { key: "subheading", label: "Subheading", type: "textarea", defaultValue: "Shop bedsheets, wall decor, table lamps, kitchen essentials, dining pieces, planters, gifts, and curated home accessories at friendly prices.", group: "content" },
      { key: "badgeText", label: "Badge Text", type: "text", defaultValue: "Festive Home Refresh Sale", group: "content" },
      { key: "button1Text", label: "Primary Button", type: "text", defaultValue: "Shop the Sale", group: "content" },
      { key: "button1Link", label: "Primary Button Link", type: "url", defaultValue: "/search", group: "content" },
      { key: "button2Text", label: "Secondary Button", type: "text", defaultValue: "Explore Collections", group: "content" },
      { key: "button2Link", label: "Secondary Button Link", type: "url", defaultValue: "/search", group: "content" },
      { key: "imageUrl", label: "Hero Image (single)", type: "image", defaultValue: "", group: "media", helpText: "Use one high-quality banner image. This image is used on both mobile and desktop." },
      { key: "contentPosition", label: "Content Position", type: "alignment", defaultValue: "center-left", group: "layout" },
      { key: "overlayOpacity", label: "Overlay Opacity", type: "range", defaultValue: 0, min: 0, max: 100, step: 5, group: "layout" },
      { key: "minHeight", label: "Min Height", type: "select", defaultValue: "auto", options: [{ label: "Auto", value: "auto" }, { label: "400px", value: "400px" }, { label: "600px", value: "600px" }, { label: "Full Screen", value: "100vh" }], group: "layout" },
      { key: "feature1", label: "Feature 1", type: "text", defaultValue: "Fast delivery", group: "content" },
      { key: "feature2", label: "Feature 2", type: "text", defaultValue: "Secure checkout", group: "content" },
      { key: "feature3", label: "Feature 3", type: "text", defaultValue: "Curated picks", group: "content" },
    ],
    defaultSettings: { heading: "Buy Home Decor Items Online for Every Indian Home", subheading: "Shop bedsheets, wall decor, table lamps, kitchen essentials, dining pieces, planters, gifts, and curated home accessories at friendly prices.", badgeText: "Festive Home Refresh Sale", button1Text: "Shop the Sale", button1Link: "/search", button2Text: "Explore Collections", button2Link: "/search", imageUrl: "", contentPosition: "center-left", overlayOpacity: 0, minHeight: "auto", feature1: "Fast delivery", feature2: "Secure checkout", feature3: "Curated picks" },
  },
  {
    type: "Slideshow", label: "Slideshow", icon: "GalleryHorizontal", category: "hero",
    description: "Auto-playing image slideshow with text overlays",
    fields: [
      { key: "slide1Image", label: "Slide 1 Image", type: "image", defaultValue: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80" },
      { key: "slide1Heading", label: "Slide 1 Heading", type: "text", defaultValue: "New Season Collection" },
      { key: "slide1Subtext", label: "Slide 1 Subtext", type: "text", defaultValue: "Explore our latest arrivals" },
      { key: "slide2Image", label: "Slide 2 Image", type: "image", defaultValue: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1200&q=80" },
      { key: "slide2Heading", label: "Slide 2 Heading", type: "text", defaultValue: "Up to 60% Off" },
      { key: "slide2Subtext", label: "Slide 2 Subtext", type: "text", defaultValue: "Limited time festive deals" },
      { key: "autoplay", label: "Auto-play", type: "toggle", defaultValue: true },
      { key: "interval", label: "Interval (seconds)", type: "number", defaultValue: 5 },
      { key: "height", label: "Height", type: "select", defaultValue: "500px", options: [{ label: "Small (300px)", value: "300px" }, { label: "Medium (500px)", value: "500px" }, { label: "Large (700px)", value: "700px" }, { label: "Full Screen", value: "100vh" }] },
    ],
    defaultSettings: { slide1Image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80", slide1Heading: "New Season Collection", slide1Subtext: "Explore our latest arrivals", slide2Image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1200&q=80", slide2Heading: "Up to 60% Off", slide2Subtext: "Limited time festive deals", autoplay: true, interval: 5, height: "500px" },
  },
  {
    type: "ImageGrid",
    label: "Image Grid",
    icon: "LayoutGrid",
    category: "media",
    description: "3-image promotional grid with clickable links (1 large + 2 small)",
    fields: [
      { key: "image1Url", label: "Image 1 URL (Large — Left)", type: "image", defaultValue: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80" },
      { key: "image1Link", label: "Image 1 Link", type: "text", defaultValue: "/" },
      { key: "image1Alt", label: "Image 1 Alt Text", type: "text", defaultValue: "Lamps & Lighting" },
      { key: "image2Url", label: "Image 2 URL (Top Right)", type: "image", defaultValue: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80" },
      { key: "image2Link", label: "Image 2 Link", type: "text", defaultValue: "/" },
      { key: "image2Alt", label: "Image 2 Alt Text", type: "text", defaultValue: "Showpieces & Vases" },
      { key: "image3Url", label: "Image 3 URL (Bottom Right)", type: "image", defaultValue: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" },
      { key: "image3Link", label: "Image 3 Link", type: "text", defaultValue: "/" },
      { key: "image3Alt", label: "Image 3 Alt Text", type: "text", defaultValue: "Accent Furniture" },
      { key: "gap", label: "Gap Between Images (px)", type: "number", defaultValue: 12 },
      { key: "borderRadius", label: "Border Radius (px)", type: "number", defaultValue: 12 },
      { key: "desktopHeight", label: "Desktop Height (px)", type: "number", defaultValue: 360 },
      { key: "mobileHeight", label: "Mobile Height (px)", type: "number", defaultValue: 420 },
    ],
    defaultSettings: {
      image1Url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      image1Link: "/",
      image1Alt: "Lamps & Lighting",
      image2Url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80",
      image2Link: "/",
      image2Alt: "Showpieces & Vases",
      image3Url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      image3Link: "/",
      image3Alt: "Accent Furniture",
      gap: 12,
      borderRadius: 12,
      desktopHeight: 360,
      mobileHeight: 420,
    },
  },
  {
    type: "ImageBanner",
    label: "Image Banner",
    icon: "ImageIcon",
    category: "media",
    description: "Full-width promotional banner image with optional link",
    fields: [
      { key: "desktopImageUrl", label: "Desktop Banner Image", type: "image", defaultValue: "" },
      { key: "mobileImageUrl", label: "Mobile Banner Image (optional)", type: "image", defaultValue: "" },
      { key: "link", label: "Banner Link", type: "text", defaultValue: "/" },
      { key: "altText", label: "Alt Text", type: "text", defaultValue: "Promotional banner" },
      { key: "desktopHeight", label: "Desktop Height (px)", type: "number", defaultValue: 280 },
      { key: "mobileHeight", label: "Mobile Height (px)", type: "number", defaultValue: 180 },
      { key: "borderRadius", label: "Border Radius (px)", type: "number", defaultValue: 12 },
      { key: "fullWidth", label: "Full Width (edge-to-edge)", type: "toggle", defaultValue: false },
    ],
    defaultSettings: {
      desktopImageUrl: "",
      mobileImageUrl: "",
      link: "/",
      altText: "Promotional banner",
      desktopHeight: 280,
      mobileHeight: 180,
      borderRadius: 12,
      fullWidth: false,
    },
  },

  /* ─── CONTENT ──────────────────────────────────────────────── */
  {
    type: "SearchBand", label: "Search Band", icon: "Search", category: "content",
    description: "Quick search chips bar for popular categories",
    fields: [
      { key: "label", label: "Label", type: "text", defaultValue: "Search for" },
      { key: "chips", label: "Chips (comma separated)", type: "text", defaultValue: "Bedsheets, Wall Art, Lamps, Planters" },
    ],
    defaultSettings: { label: "Search for", chips: "Bedsheets, Wall Art, Lamps, Planters" },
  },
  {
    type: "RichText", label: "Rich Text", icon: "Type", category: "content",
    description: "Custom text content with HTML formatting",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "" },
      { key: "content", label: "Content (HTML)", type: "richtext", defaultValue: "<p>Share your brand story, mission, or anything that connects with your customers.</p>" },
      { key: "textAlign", label: "Alignment", type: "select", defaultValue: "center", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] },
    ],
    defaultSettings: { heading: "", content: "<p>Share your brand story, mission, or anything that connects with your customers.</p>", textAlign: "center" },
  },
  {
    type: "ImageWithText", label: "Image with Text", icon: "Columns2", category: "content",
    description: "Side-by-side image and text block",
    fields: [
      { key: "imageUrl", label: "Image", type: "image", defaultValue: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "Our Story" },
      { key: "text", label: "Text", type: "textarea", defaultValue: "We believe every home deserves beautiful, affordable decor that brings warmth and personality to every corner." },
      { key: "buttonText", label: "Button Text", type: "text", defaultValue: "Learn More" },
      { key: "buttonLink", label: "Button Link", type: "url", defaultValue: "/about" },
      { key: "imagePosition", label: "Image Position", type: "select", defaultValue: "left", options: [{ label: "Left", value: "left" }, { label: "Right", value: "right" }] },
    ],
    defaultSettings: { imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80", heading: "Our Story", text: "We believe every home deserves beautiful, affordable decor that brings warmth and personality to every corner.", buttonText: "Learn More", buttonLink: "/about", imagePosition: "left" },
  },
  {
    type: "Multicolumn", label: "Multicolumn", icon: "LayoutGrid", category: "content",
    description: "Multiple columns with icons, images, and text",
    fields: [
      { key: "heading", label: "Section Heading", type: "text", defaultValue: "Why Choose Us" },
      { key: "columns", label: "Number of Columns", type: "select", defaultValue: "3", options: [{ label: "2 Columns", value: "2" }, { label: "3 Columns", value: "3" }, { label: "4 Columns", value: "4" }] },
      { key: "col1Title", label: "Column 1 Title", type: "text", defaultValue: "Premium Quality" },
      { key: "col1Text", label: "Column 1 Text", type: "textarea", defaultValue: "Every product is handpicked for quality and durability." },
      { key: "col1Image", label: "Column 1 Image", type: "image", defaultValue: "" },
      { key: "col2Title", label: "Column 2 Title", type: "text", defaultValue: "Free Shipping" },
      { key: "col2Text", label: "Column 2 Text", type: "textarea", defaultValue: "Free delivery on all orders above ₹999." },
      { key: "col2Image", label: "Column 2 Image", type: "image", defaultValue: "" },
      { key: "col3Title", label: "Column 3 Title", type: "text", defaultValue: "Easy Returns" },
      { key: "col3Text", label: "Column 3 Text", type: "textarea", defaultValue: "Hassle-free returns within 7 days of delivery." },
      { key: "col3Image", label: "Column 3 Image", type: "image", defaultValue: "" },
      { key: "col4Title", label: "Column 4 Title", type: "text", defaultValue: "" },
      { key: "col4Text", label: "Column 4 Text", type: "textarea", defaultValue: "" },
      { key: "col4Image", label: "Column 4 Image", type: "image", defaultValue: "" },
    ],
    defaultSettings: { heading: "Why Choose Us", columns: "3", col1Title: "Premium Quality", col1Text: "Every product is handpicked for quality and durability.", col1Image: "", col2Title: "Free Shipping", col2Text: "Free delivery on all orders above ₹999.", col2Image: "", col3Title: "Easy Returns", col3Text: "Hassle-free returns within 7 days of delivery.", col3Image: "", col4Title: "", col4Text: "", col4Image: "" },
  },
  {
    type: "CollapsibleContent", label: "Collapsible Content", icon: "ChevronDown", category: "content",
    description: "Expandable FAQ or content sections",
    fields: [
      { key: "heading", label: "Section Heading", type: "text", defaultValue: "Frequently Asked Questions" },
      { key: "q1", label: "Question 1", type: "text", defaultValue: "What is your return policy?" },
      { key: "a1", label: "Answer 1", type: "textarea", defaultValue: "We offer hassle-free returns within 7 days of delivery. Products must be in original condition." },
      { key: "q2", label: "Question 2", type: "text", defaultValue: "Do you offer free shipping?" },
      { key: "a2", label: "Answer 2", type: "textarea", defaultValue: "Yes! Free shipping on all orders above ₹999 across India." },
      { key: "q3", label: "Question 3", type: "text", defaultValue: "How long does delivery take?" },
      { key: "a3", label: "Answer 3", type: "textarea", defaultValue: "Most orders are delivered within 5-7 business days." },
      { key: "q4", label: "Question 4", type: "text", defaultValue: "" },
      { key: "a4", label: "Answer 4", type: "textarea", defaultValue: "" },
      { key: "q5", label: "Question 5", type: "text", defaultValue: "" },
      { key: "a5", label: "Answer 5", type: "textarea", defaultValue: "" },
    ],
    defaultSettings: { heading: "Frequently Asked Questions", q1: "What is your return policy?", a1: "We offer hassle-free returns within 7 days of delivery. Products must be in original condition.", q2: "Do you offer free shipping?", a2: "Yes! Free shipping on all orders above ₹999 across India.", q3: "How long does delivery take?", a3: "Most orders are delivered within 5-7 business days.", q4: "", a4: "", q5: "", a5: "" },
  },

  /* ─── PRODUCT ──────────────────────────────────────────────── */
  {
    type: "CategoryGrid", label: "Category Grid", icon: "Grid3x3", category: "product",
    description: "Circular category cards for shop-by-category",
    fields: [
      { key: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Shop by category" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "Home decor, furnishing and essentials" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Find bedding, wall decor, lighting, kitchen, dining, bath, garden, gifts, storage and showpieces in one place." },
      { key: "categoryCount", label: "Number of Categories", type: "number", defaultValue: 5 },
      { key: "cat1Text", label: "Category 1 Text", type: "text", defaultValue: "Bedding" },
      { key: "cat1Image", label: "Category 1 Image", type: "image", defaultValue: "" },
      { key: "cat1Link", label: "Category 1 Link", type: "url", defaultValue: "/bedding" },
      { key: "cat2Text", label: "Category 2 Text", type: "text", defaultValue: "Furnishing" },
      { key: "cat2Image", label: "Category 2 Image", type: "image", defaultValue: "" },
      { key: "cat2Link", label: "Category 2 Link", type: "url", defaultValue: "/furnishing" },
      { key: "cat3Text", label: "Category 3 Text", type: "text", defaultValue: "Organiser" },
      { key: "cat3Image", label: "Category 3 Image", type: "image", defaultValue: "" },
      { key: "cat3Link", label: "Category 3 Link", type: "url", defaultValue: "/organiser" },
      { key: "cat4Text", label: "Category 4 Text", type: "text", defaultValue: "Bath" },
      { key: "cat4Image", label: "Category 4 Image", type: "image", defaultValue: "" },
      { key: "cat4Link", label: "Category 4 Link", type: "url", defaultValue: "/bath" },
      { key: "cat5Text", label: "Category 5 Text", type: "text", defaultValue: "Gifts" },
      { key: "cat5Image", label: "Category 5 Image", type: "image", defaultValue: "" },
      { key: "cat5Link", label: "Category 5 Link", type: "url", defaultValue: "/gifts" },
      { key: "cat6Text", label: "Category 6 Text", type: "text", defaultValue: "New Arrival" },
      { key: "cat6Image", label: "Category 6 Image", type: "image", defaultValue: "" },
      { key: "cat6Link", label: "Category 6 Link", type: "url", defaultValue: "/new-arrival" },
      { key: "cat7Text", label: "Category 7 Text", type: "text", defaultValue: "Comforters" },
      { key: "cat7Image", label: "Category 7 Image", type: "image", defaultValue: "" },
      { key: "cat7Link", label: "Category 7 Link", type: "url", defaultValue: "/comforters" },
      { key: "cat8Text", label: "Category 8 Text", type: "text", defaultValue: "Carpet" },
      { key: "cat8Image", label: "Category 8 Image", type: "image", defaultValue: "" },
      { key: "cat8Link", label: "Category 8 Link", type: "url", defaultValue: "/carpet" },
      { key: "cat9Text", label: "Category 9 Text", type: "text", defaultValue: "Return and Exchange" },
      { key: "cat9Image", label: "Category 9 Image", type: "image", defaultValue: "" },
      { key: "cat9Link", label: "Category 9 Link", type: "url", defaultValue: "/return-and-exchange" },
      { key: "cat10Text", label: "Category 10 Text", type: "text", defaultValue: "Category 10" },
      { key: "cat10Image", label: "Category 10 Image", type: "image", defaultValue: "" },
      { key: "cat10Link", label: "Category 10 Link", type: "url", defaultValue: "/category-10" },
      { key: "cat11Text", label: "Category 11 Text", type: "text", defaultValue: "Category 11" },
      { key: "cat11Image", label: "Category 11 Image", type: "image", defaultValue: "" },
      { key: "cat11Link", label: "Category 11 Link", type: "url", defaultValue: "/category-11" },
      { key: "cat12Text", label: "Category 12 Text", type: "text", defaultValue: "Category 12" },
      { key: "cat12Image", label: "Category 12 Image", type: "image", defaultValue: "" },
      { key: "cat12Link", label: "Category 12 Link", type: "url", defaultValue: "/category-12" },
    ],
    defaultSettings: {
      eyebrow: "Shop by category",
      heading: "Home decor, furnishing and essentials",
      subheading: "Find bedding, wall decor, lighting, kitchen, dining, bath, garden, gifts, storage and showpieces in one place.",
      categoryCount: 5,
      cat1Text: "Bedding", cat1Image: "", cat1Link: "/bedding",
      cat2Text: "Furnishing", cat2Image: "", cat2Link: "/furnishing",
      cat3Text: "Organiser", cat3Image: "", cat3Link: "/organiser",
      cat4Text: "Bath", cat4Image: "", cat4Link: "/bath",
      cat5Text: "Gifts", cat5Image: "", cat5Link: "/gifts",
      cat6Text: "New Arrival", cat6Image: "", cat6Link: "/new-arrival",
      cat7Text: "Comforters", cat7Image: "", cat7Link: "/comforters",
      cat8Text: "Carpet", cat8Image: "", cat8Link: "/carpet",
      cat9Text: "Return and Exchange", cat9Image: "", cat9Link: "/return-and-exchange",
      cat10Text: "Category 10", cat10Image: "", cat10Link: "/category-10",
      cat11Text: "Category 11", cat11Image: "", cat11Link: "/category-11",
      cat12Text: "Category 12", cat12Image: "", cat12Link: "/category-12",
    },
  },
  {
    type: "CollectionsSection", label: "Collections", icon: "FolderOpen", category: "product",
    description: "Curated product collections with image previews",
    fields: [
      { key: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Collections" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "Shop by collection" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Curated product sets to help you discover your style." },
      { key: "collectionSlug", label: "Select Collection", type: "collection-select", defaultValue: "" },
    ],
    defaultSettings: { eyebrow: "Collections", heading: "Shop by collection", subheading: "Curated product sets to help you discover your style.", collectionSlug: "" },
  },
  {
    type: "ProductGrid", label: "Product Grid", icon: "ShoppingBag", category: "product",
    description: "Dynamic grid of products with row/column control",
    fields: [
      { key: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Sale picks", group: "content" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "Premium finds, friendly prices", group: "content" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Shop bestselling home decor products.", group: "content" },
      { key: "headingAlign", label: "Heading Alignment", type: "alignment", defaultValue: "center", group: "content" },
      { key: "columns", label: "Columns (Desktop)", type: "select", defaultValue: "4", options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
        { label: "5 Columns", value: "5" },
        { label: "6 Columns", value: "6" }
      ], group: "layout" },
      { key: "mobileColumns", label: "Columns (Mobile)", type: "select", defaultValue: "2", options: [
        { label: "1 Column", value: "1" },
        { label: "2 Columns", value: "2" }
      ], group: "layout" },
      { key: "rows", label: "Number of Rows", type: "number", defaultValue: 2, min: 1, max: 10, group: "layout" },
      { key: "gap", label: "Card Gap (px)", type: "range", defaultValue: 24, min: 8, max: 48, step: 4, group: "layout" },
      { key: "productSource", label: "Product Source", type: "select", defaultValue: "manual", options: [
        { label: "Manual Selection", value: "manual" },
        { label: "All Products", value: "all" },
        { label: "Latest Products", value: "latest" }
      ], group: "products", helpText: "Choose how to populate the grid" },
      { key: "productIds", label: "Select Products", type: "product-list", defaultValue: [], group: "products", helpText: "Used when Source = Manual" },
    ],
    defaultSettings: { eyebrow: "Sale picks", heading: "Premium finds, friendly prices", subheading: "Shop bestselling home decor products.", headingAlign: "center", columns: "4", mobileColumns: "2", rows: 2, gap: 24, productSource: "manual", productIds: [] },
  },
  {
    type: "FeaturedCollection", label: "Featured Collection", icon: "Star", category: "product",
    description: "Highlight a specific collection with its products",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "Featured Collection" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Hand-picked favourites for your home" },
      { key: "collectionId", label: "Collection Slug", type: "text", defaultValue: "" },
    ],
    defaultSettings: { heading: "Featured Collection", subheading: "Hand-picked favourites for your home", collectionId: "" },
  },
  {
    type: "FeaturedProduct", label: "Featured Product", icon: "Package", category: "product",
    description: "Showcase a single product with large image and details",
    fields: [
      { key: "heading", label: "Section Heading", type: "text", defaultValue: "Featured Product" },
      { key: "productSlug", label: "Product Slug", type: "text", defaultValue: "" },
      { key: "showDescription", label: "Show Description", type: "toggle", defaultValue: true },
    ],
    defaultSettings: { heading: "Featured Product", productSlug: "", showDescription: true },
  },

  /* ─── MEDIA ────────────────────────────────────────────────── */
  {
    type: "Video", label: "Video", icon: "Play", category: "media",
    description: "Embed YouTube or custom video",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "Watch Our Story" },
      { key: "videoUrl", label: "Video URL (YouTube/Vimeo)", type: "url", defaultValue: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { key: "coverImage", label: "Cover Image", type: "image", defaultValue: "" },
      { key: "description", label: "Description", type: "textarea", defaultValue: "" },
    ],
    defaultSettings: { heading: "Watch Our Story", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", coverImage: "", description: "" },
  },
  {
    type: "LogoList", label: "Logo List", icon: "Award", category: "media",
    description: "Brand logos or trust badges in a row",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "As featured in" },
      { key: "logo1", label: "Logo 1 URL", type: "image", defaultValue: "" },
      { key: "logo2", label: "Logo 2 URL", type: "image", defaultValue: "" },
      { key: "logo3", label: "Logo 3 URL", type: "image", defaultValue: "" },
      { key: "logo4", label: "Logo 4 URL", type: "image", defaultValue: "" },
      { key: "logo5", label: "Logo 5 URL", type: "image", defaultValue: "" },
    ],
    defaultSettings: { heading: "As featured in", logo1: "", logo2: "", logo3: "", logo4: "", logo5: "" },
  },

  /* ─── TRUST ────────────────────────────────────────────────── */
  {
    type: "PromisesSection", label: "Trust Badges", icon: "ShieldCheck", category: "trust",
    description: "Key value propositions with icons",
    fields: [
      { key: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Why choose us" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "A calmer, warmer way to shop for home" },
    ],
    defaultSettings: { eyebrow: "Why choose us", heading: "A calmer, warmer way to shop for home" },
  },
  {
    type: "Testimonials", label: "Testimonials", icon: "MessageSquareQuote", category: "trust",
    description: "Customer reviews and testimonials",
    fields: [
      { key: "heading", label: "Section Heading", type: "text", defaultValue: "What Our Customers Say" },
      { key: "testimonial1Name", label: "Name 1", type: "text", defaultValue: "Priya S." },
      { key: "testimonial1Text", label: "Review 1", type: "textarea", defaultValue: "Beautiful products and fast delivery. The quality exceeded my expectations!" },
      { key: "testimonial2Name", label: "Name 2", type: "text", defaultValue: "Rahul M." },
      { key: "testimonial2Text", label: "Review 2", type: "textarea", defaultValue: "Love the curated collection. Every piece I bought looks amazing in my living room." },
      { key: "testimonial3Name", label: "Name 3", type: "text", defaultValue: "Sneha K." },
      { key: "testimonial3Text", label: "Review 3", type: "textarea", defaultValue: "The best home decor shopping experience online. Will definitely order again!" },
    ],
    defaultSettings: { heading: "What Our Customers Say", testimonial1Name: "Priya S.", testimonial1Text: "Beautiful products and fast delivery. The quality exceeded my expectations!", testimonial2Name: "Rahul M.", testimonial2Text: "Love the curated collection. Every piece I bought looks amazing in my living room.", testimonial3Name: "Sneha K.", testimonial3Text: "The best home decor shopping experience online. Will definitely order again!" },
  },

  /* ─── FORM ─────────────────────────────────────────────────── */
  {
    type: "Newsletter", label: "Email Signup", icon: "Mail", category: "form",
    description: "Newsletter subscription form with heading",
    fields: [
      { key: "eyebrow", label: "Eyebrow Text", type: "text", defaultValue: "Decor notes" },
      { key: "heading", label: "Heading", type: "text", defaultValue: "Ideas, offers and new drops" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Get room styling inspiration, festive sale alerts and new home essentials in your inbox." },
      { key: "buttonText", label: "Button Text", type: "text", defaultValue: "Join Newsletter" },
    ],
    defaultSettings: { eyebrow: "Decor notes", heading: "Ideas, offers and new drops", subheading: "Get room styling inspiration, festive sale alerts and new home essentials in your inbox.", buttonText: "Join Newsletter" },
  },
  {
    type: "ContactForm", label: "Contact Form", icon: "Send", category: "form",
    description: "Customer contact form with fields",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "Get in Touch" },
      { key: "subheading", label: "Subheading", type: "text", defaultValue: "Have a question? We'd love to hear from you." },
      { key: "buttonText", label: "Submit Button Text", type: "text", defaultValue: "Send Message" },
      { key: "showPhone", label: "Show Phone Field", type: "toggle", defaultValue: true },
    ],
    defaultSettings: { heading: "Get in Touch", subheading: "Have a question? We'd love to hear from you.", buttonText: "Send Message", showPhone: true },
  },

  /* ─── UTILITY ──────────────────────────────────────────────── */
  {
    type: "SeoArticle", label: "SEO Text", icon: "FileText", category: "utility",
    description: "SEO-friendly content block with heading and paragraph fields",
    fields: [
      { key: "headingTag", label: "Heading Level", type: "select", defaultValue: "h2", options: [
        { label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" },
        { label: "H4", value: "h4" }, { label: "H5", value: "h5" }, { label: "H6", value: "h6" }
      ] },
      { key: "headingText", label: "Main Heading", type: "text", defaultValue: "QuirkyHome - Buy Home Decor Items Online in India" },
      { key: "content", label: "Content Paragraph 1", type: "textarea", defaultValue: "QuirkyHome is built for people who want beautiful home decor without making shopping feel complicated. Explore bedding, home furnishing, wall decor, table lamps, dining essentials, kitchen products, bath accessories, planters, storage baskets, showpieces and thoughtful gifts for Indian homes." },
      { key: "subheadingTag", label: "Second Heading Level", type: "select", defaultValue: "h2", options: [
        { label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" },
        { label: "H4", value: "h4" }, { label: "H5", value: "h5" }, { label: "H6", value: "h6" }
      ] },
      { key: "subheadingText", label: "Second Heading", type: "text", defaultValue: "Shop Home Decor by Category" },
      { key: "content2", label: "Content Paragraph 2", type: "textarea", defaultValue: "Whether you are refreshing a bedroom, setting up a living room, styling a dining table or choosing a housewarming gift, our category-led shopping experience helps you find the right product quickly. Every product card keeps price, discount, rating, wishlist and add-to-cart actions easy to scan on mobile and desktop." },
    ],
    defaultSettings: {
      headingTag: "h2",
      headingText: "QuirkyHome - Buy Home Decor Items Online in India",
      content: "QuirkyHome is built for people who want beautiful home decor without making shopping feel complicated. Explore bedding, home furnishing, wall decor, table lamps, dining essentials, kitchen products, bath accessories, planters, storage baskets, showpieces and thoughtful gifts for Indian homes.",
      subheadingTag: "h2",
      subheadingText: "Shop Home Decor by Category",
      content2: "Whether you are refreshing a bedroom, setting up a living room, styling a dining table or choosing a housewarming gift, our category-led shopping experience helps you find the right product quickly. Every product card keeps price, discount, rating, wishlist and add-to-cart actions easy to scan on mobile and desktop.",
    },
  },
  {
    type: "MapSection", label: "Map", icon: "MapPin", category: "utility",
    description: "Google Maps embed for store location",
    fields: [
      { key: "heading", label: "Heading", type: "text", defaultValue: "Visit Our Store" },
      { key: "address", label: "Address", type: "textarea", defaultValue: "123 Decor Street, Mumbai, Maharashtra 400001" },
      { key: "mapEmbed", label: "Google Maps Embed URL", type: "url", defaultValue: "" },
    ],
    defaultSettings: { heading: "Visit Our Store", address: "123 Decor Street, Mumbai, Maharashtra 400001", mapEmbed: "" },
  },
  {
    type: "CustomHTML", label: "Custom HTML", icon: "Code", category: "utility",
    description: "Raw HTML/CSS for custom content",
    fields: [
      { key: "content", label: "HTML Code", type: "richtext", defaultValue: "<div style=\"padding: 2rem; text-align: center;\"><p>Custom HTML content</p></div>" },
    ],
    defaultSettings: { content: "<div style=\"padding: 2rem; text-align: center;\"><p>Custom HTML content</p></div>" },
  },
  {
    type: "Divider", label: "Divider", icon: "Minus", category: "utility",
    description: "Visual separator between sections",
    fields: [
      { key: "style", label: "Style", type: "select", defaultValue: "line", options: [{ label: "Line", value: "line" }, { label: "Dotted", value: "dotted" }, { label: "Space Only", value: "space" }] },
      { key: "paddingTop", label: "Top Spacing (px)", type: "number", defaultValue: 32 },
      { key: "paddingBottom", label: "Bottom Spacing (px)", type: "number", defaultValue: 32 },
    ],
    defaultSettings: { style: "line", paddingTop: 32, paddingBottom: 32 },
  },
  {
    type: "ReelImage",
    label: "Reel Image",
    icon: "Film",
    category: "media",
    description: "Horizontal scrolling portrait image reel with text overlays and links",
    fields: [
      { key: "reel1Image", label: "Reel 1 Image", type: "image", defaultValue: "" },
      { key: "reel1Link", label: "Reel 1 Link", type: "text", defaultValue: "/" },
      { key: "reel1Text", label: "Reel 1 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel2Image", label: "Reel 2 Image", type: "image", defaultValue: "" },
      { key: "reel2Link", label: "Reel 2 Link", type: "text", defaultValue: "/" },
      { key: "reel2Text", label: "Reel 2 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel3Image", label: "Reel 3 Image", type: "image", defaultValue: "" },
      { key: "reel3Link", label: "Reel 3 Link", type: "text", defaultValue: "/" },
      { key: "reel3Text", label: "Reel 3 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel4Image", label: "Reel 4 Image", type: "image", defaultValue: "" },
      { key: "reel4Link", label: "Reel 4 Link", type: "text", defaultValue: "/" },
      { key: "reel4Text", label: "Reel 4 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel5Image", label: "Reel 5 Image", type: "image", defaultValue: "" },
      { key: "reel5Link", label: "Reel 5 Link", type: "text", defaultValue: "/" },
      { key: "reel5Text", label: "Reel 5 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel6Image", label: "Reel 6 Image", type: "image", defaultValue: "" },
      { key: "reel6Link", label: "Reel 6 Link", type: "text", defaultValue: "/" },
      { key: "reel6Text", label: "Reel 6 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel7Image", label: "Reel 7 Image", type: "image", defaultValue: "" },
      { key: "reel7Link", label: "Reel 7 Link", type: "text", defaultValue: "/" },
      { key: "reel7Text", label: "Reel 7 Text (optional)", type: "text", defaultValue: "" },
      { key: "reel8Image", label: "Reel 8 Image", type: "image", defaultValue: "" },
      { key: "reel8Link", label: "Reel 8 Link", type: "text", defaultValue: "/" },
      { key: "reel8Text", label: "Reel 8 Text (optional)", type: "text", defaultValue: "" },
      { key: "heading", label: "Section Heading", type: "text", defaultValue: "" },
      { key: "cardHeight", label: "Card Height (px)", type: "number", defaultValue: 380, min: 250, max: 600 },
      { key: "cardWidth", label: "Card Width (px)", type: "number", defaultValue: 220, min: 150, max: 350 },
      { key: "gap", label: "Gap Between Cards (px)", type: "number", defaultValue: 16, min: 4, max: 32 },
      { key: "borderRadius", label: "Border Radius (px)", type: "number", defaultValue: 16, min: 0, max: 32 },
    ],
    defaultSettings: {
      reel1Image: "", reel1Link: "/", reel1Text: "",
      reel2Image: "", reel2Link: "/", reel2Text: "",
      reel3Image: "", reel3Link: "/", reel3Text: "",
      reel4Image: "", reel4Link: "/", reel4Text: "",
      reel5Image: "", reel5Link: "/", reel5Text: "",
      reel6Image: "", reel6Link: "/", reel6Text: "",
      reel7Image: "", reel7Link: "/", reel7Text: "",
      reel8Image: "", reel8Link: "/", reel8Text: "",
      heading: "",
      cardHeight: 380,
      cardWidth: 220,
      gap: 16,
      borderRadius: 16,
    },
  },
];

/* ─── Global spacing & style fields auto-injected into every section ─ */
const globalFields = [
  { key: "sectionPaddingTop", label: "Padding Top (px)", type: "range" as const, defaultValue: 24, min: 0, max: 120, step: 4, group: "spacing" },
  { key: "sectionPaddingBottom", label: "Padding Bottom (px)", type: "range" as const, defaultValue: 24, min: 0, max: 120, step: 4, group: "spacing" },
  { key: "sectionBgColor", label: "Background Color", type: "color" as const, defaultValue: "", group: "style", helpText: "Leave empty for default" },
  { key: "sectionFullWidth", label: "Full Width", type: "toggle" as const, defaultValue: false, group: "layout" },
];

const globalDefaults: Record<string, any> = {
  sectionPaddingTop: 24, sectionPaddingBottom: 24, sectionBgColor: "", sectionFullWidth: false,
};

// Inject global fields into every section
for (const section of _rawSections) {
  section.fields = [...section.fields, ...globalFields];
  section.defaultSettings = { ...section.defaultSettings, ...globalDefaults };
}

export const sectionRegistry = _rawSections;

export function getSectionDef(type: string): SectionDefinition | undefined {
  return sectionRegistry.find((s) => s.type === type);
}
