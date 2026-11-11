import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import LenisProvider from "./LenisProvider";
import SiteChrome from "./SiteChrome";
import Cursor from "./fx/Cursor";
import Intro from "./fx/Intro";
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

// Display face: a variable grotesque with optical-size and width axes, so the
// oversized headlines can run tight and slightly condensed.
const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
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

export const viewport: Viewport = {
  themeColor: "#05070c",
  colorScheme: "dark",
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Runs before first paint: a visitor who has already seen the intro this
// session never gets the curtain again (CSS hides it off this attribute).
const INTRO_FLAG = `try{if(sessionStorage.getItem("tp-intro")){document.documentElement.dataset.intro="seen";document.documentElement.dataset.ready="1"}}catch(e){}`;

// Without scripts nothing would ever be revealed, so show it all up front.
const NOSCRIPT_CSS = `.intro{display:none!important}.rv,.mask-in,.g-fade,.mr-a,.mr-b{opacity:1!important;transform:none!important}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: INTRO_FLAG }} />
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <LenisProvider>
          <Intro />
          <SiteChrome />
          {children}
        </LenisProvider>
        <Cursor />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
