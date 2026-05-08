import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Login | myBEDZY",
  robots: { index: false, follow: false },
};

export default function TeamLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

