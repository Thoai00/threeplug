import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import LenisProvider from "./LenisProvider";
import { COMPANY, PRIMARY_KEYWORDS, SERVICES, SITE_URL, organizationJsonLd } from "./seo";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Three Plug — Software, ERP, CRM, Mobile Apps, Marketing & 3D Web",
    template: "%s · Three Plug",
  },
  description: COMPANY.description,
  keywords: [...PRIMARY_KEYWORDS, ...SERVICES.flatMap((s) => s.keywords)],
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.legalName, url: SITE_URL }],
  creator: COMPANY.legalName,
  publisher: COMPANY.legalName,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: COMPANY.legalName,
    locale: "en_US",
    url: SITE_URL,
    title: "Three Plug — Software, ERP, CRM, Mobile Apps, Marketing & 3D Web",
    description: COMPANY.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${COMPANY.legalName} — ${COMPANY.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Three Plug — Software, ERP, CRM, Mobile Apps, Marketing & 3D Web",
    description: COMPANY.tagline,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

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
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
