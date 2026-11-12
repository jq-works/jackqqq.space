import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jackqqq — Frontend Developer from Malang",
  description: "Website cepat, rapi, dan siap mendatangkan pelanggan. Frontend developer building fast, beautiful, and high-converting websites.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  keywords: [
    "frontend developer",
    "malang",
    "next.js",
    "website design",
    "landing page",
    "portfolio",
  ],
  authors: [{ name: "Jackqqq", url: "https://jackqqq.space" }],
  creator: "Jackqqq",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jackqqq.space",
    title: "Jackqqq — Frontend Developer",
    description: "Building fast, beautiful, and high-converting websites",
    siteName: "Jackqqq Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jackqqq — Frontend Developer",
    description: "Building fast, beautiful, and high-converting websites",
    creator: "@jackqqqq_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
