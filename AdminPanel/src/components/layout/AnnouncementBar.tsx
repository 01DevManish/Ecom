"use client";

import { useEffect, useMemo, useState } from "react";

type BannerSettings = {
  text?: string;
  bgColor?: string;
  textColor?: string;
  link?: string;
};

export function AnnouncementBar() {
  const [settings, setSettings] = useState<BannerSettings>({
    text: "Festive Home Refresh Sale - Up to 60% Off | Free shipping above Rs. 999",
    bgColor: "#f4df78",
    textColor: "#202223",
    link: "",
  });

  useEffect(() => {
    fetch("/api/admin/builder", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const sections = data?.schema?.pages?.home?.sections;
        if (!Array.isArray(sections)) return;
        const banner = sections.find((s: any) => s?.visible && s?.type === "BannerStrip");
        if (!banner?.settings) return;
        setSettings((prev) => ({ ...prev, ...banner.settings }));
      })
      .catch(() => {});
  }, []);

  const content = useMemo(
    () => (
      <div
        className="w-full px-3 py-2 text-center text-sm font-bold leading-none md:text-[13px]"
        style={{ backgroundColor: settings.bgColor || "#f4df78", color: settings.textColor || "#202223" }}
      >
        {settings.text}
      </div>
    ),
    [settings],
  );

  if (settings.link) {
    return (
      <a href={settings.link} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

