import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import LenisProvider from "./LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = IBM_Plex_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const displayFont = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Three Plug — Automation · Marketing · 3D · Software",
  description:
    "Full-service digital studio specialising in intelligent automation, performance marketing, 3D animation & visualization, ERP/CRM, and custom software development.",
  keywords: [
    "software development", "ERP CRM", "automation", "digital marketing",
    "3D animation", "Three.js", "WebGL", "web development",
  ],
  openGraph: {
    title: "Three Plug Software Solutions",
    description: "Automate. Market. Animate. All under one roof.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} h-full antialiased`}
      style={{ colorScheme: "light" }}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
