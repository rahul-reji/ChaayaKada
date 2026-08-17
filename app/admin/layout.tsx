import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin · Chayakada",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CK Admin",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0c0a",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
