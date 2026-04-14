import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppProviders from "@/components/providers/AppProviders";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { inter, leagueGothic } from "@/app/fonts";

const SITE_URL = "https://tedxateneodemanilau.com";
const SITE_NAME = "TEDxAteneodeManilaU";
const DEFAULT_TITLE = "TEDxAteneodeManilaU 2026 | Momentum";
const DEFAULT_DESCRIPTION =
  "TEDxAteneodeManilaU 2026: Momentum is an ideas conference for students and young builders at Ateneo de Manila University. Explore talks on AI, growth, purpose, and change.";
const DEFAULT_OG_IMAGE = "/tedx-logo.png";
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "TEDxAteneodeManilaU",
    "TEDx Ateneo",
    "TEDx ADMU",
    "Ateneo de Manila University",
    "TEDx Philippines",
    "Momentum",
    "TED talks Manila",
    "student conference Philippines",
    "ideas worth spreading",
  ],
  authors: [{ name: "TEDxAteneodeManilaU Team" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TEDxAteneodeManilaU 2026 Momentum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: GOOGLE_SITE_VERIFICATION
    ? {
        google: GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
  category: "event",
  classification: "public",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueGothic.variable} ${inter.variable}`}>
      <body
        className={`font-sans antialiased ${leagueGothic.variable}`}
      >
        <ConvexAuthNextjsServerProvider>
          <AppProviders>
            <Navbar />
            {children}
            <Footer />
          </AppProviders>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
