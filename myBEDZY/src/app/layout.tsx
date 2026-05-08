import type { Metadata } from "next";
import "@/styles/globals.css";
import { ShopProvider } from "@/components/shop/ShopProvider";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://myBEDZY.in"),
  title: {
    default: "myBEDZY | Buy Home Decor Items & Essentials Online",
    template: "%s | myBEDZY",
  },
  description: "Shop home decor items, bedding, furnishing, organizers, bath gifts, comforters and new arrivals online at myBEDZY.",
  keywords: [
    "home decor online",
    "home decor items",
    "home essentials",
    "bedsheets online",
    "furnishing decor",
    "organizers",
    "bath gifts",
    "comforters",
    "home furnishing",
    "myBEDZY",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "myBEDZY | Buy Home Decor Items & Essentials Online",
    description: "Curated home decor, furnishing, organizers, bath gifts and comforters for Indian homes.",
    url: "https://myBEDZY.in",
    siteName: "myBEDZY",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "myBEDZY curated home decor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "myBEDZY | Buy Home Decor Items & Essentials Online",
    description: "Shop curated home decor, furnishing and essentials online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "myBEDZY",
    url: "https://myBEDZY.in",
    logo: "https://myBEDZY.in/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7678099909",
      contactType: "customer support",
      areaServed: "IN",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "myBEDZY",
    url: "https://myBEDZY.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://myBEDZY.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className="qh-bottom-nav-safe md:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <ShopProvider>
          <AppChrome>{children}</AppChrome>
        </ShopProvider>
      </body>
    </html>
  );
}

