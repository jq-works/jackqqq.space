import type { Metadata, Viewport } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-outfit" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-label" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

export const metadata: Metadata = {
  title: "JACKQQQ — Fullstack Developer & Multimedia Specialist",
  description: "Website cepat, rapi, dan siap mendatangkan pelanggan, plus produksi multimedia: live streaming, broadcasting, fotografi, dan videografi. Fullstack developer & multimedia specialist dari Malang.",
  keywords: [
    "fullstack developer",
    "multimedia specialist",
    "live streaming",
    "broadcasting",
    "fotografi",
    "videografi",
    "malang",
    "next.js",
    "website design",
    "landing page",
    "portfolio",
  ],
  authors: [{ name: "JACKQQQ", url: "https://jackqqq.space" }],
  creator: "JACKQQQ",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jackqqq.space",
    title: "JACKQQQ — Fullstack Developer & Multimedia Specialist",
    description: "Fullstack development, live streaming, photography, and videography",
    siteName: "JACKQQQ Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "JACKQQQ — Fullstack Developer & Multimedia Specialist",
    description: "Fullstack development, live streaming, photography, and videography",
    creator: "@jackqqqq_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-[#000] font-sans text-[#f5f5f7] antialiased">
        {children}
      </body>
    </html>
  );
}
