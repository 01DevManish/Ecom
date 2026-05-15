import Link from "next/link";
import { Settings, Store, CreditCard, Truck, Globe, Shield, Bell, Palette } from "lucide-react";

const sections = [
  { icon: Palette, label: "Theme Settings", desc: "Storefront theme and color scheme", href: "/settings/theme", highlight: true },
  { icon: Store, label: "Store details", desc: "Store name, contact, address", href: "#" },
  { icon: CreditCard, label: "Payments", desc: "Payment providers and methods", href: "#" },
  { icon: Truck, label: "Shipping", desc: "Shipping rates and zones", href: "#" },
  { icon: Globe, label: "Domains", desc: "Custom domains and URLs", href: "#" },
  { icon: Shield, label: "Policies", desc: "Return, privacy, terms policies", href: "#" },
  { icon: Bell, label: "Notifications", desc: "Email and SMS notifications", href: "#" },
];

export default function SettingsPage() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group cursor-pointer rounded-lg border bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_1px_3px_rgba(63,63,68,0.12)] ${
              s.highlight
                ? "border-violet-200 ring-1 ring-violet-100 hover:border-violet-400 hover:ring-violet-200"
                : "border-[#e1e3e5] hover:border-[#008060]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  s.highlight
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md"
                    : "bg-[#f4f6f8] text-[#6d7175] group-hover:bg-[#e3f1df] group-hover:text-[#008060]"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-[#202223]">{s.label}</p>
                <p className="text-[12px] text-[#6d7175]">{s.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
