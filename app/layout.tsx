import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppProviders from "@/components/providers/AppProviders";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";


export const metadata: Metadata = {
  metadataBase: new URL('https://tedxateneodemanilau.com'),
  title: "TEDxAteneodeManilaU: Momentum",
  description: "Join TEDxAteneodeManilaU for Momentum, where we explore...",
  keywords:
    'TEDx, TEDxAteneodeManilaU, TEDxAteneo, TEDxADMU, ADMU, Ateneo, Ateneo de Manila University, Momentum, Labyrinthine, April 25 2026, TED Talks, Innovation, Ideas Worth Spreading, Manila, Philippines, Conference, Event, Leong Hall, Ateneo, Katipunan, Loyola Heights, TEDxManila, TEDxPhilippines, Student Conference, University Event, Ateneo Event, TEDx Conference, Public Speaking, Knowledge Sharing, Intellectual Discourse, Academic Conference, University Talks, Student Organization, Ateneo Organizations, TEDx Community, Philippine TEDx',
  authors: [{ name: 'TEDxAteneodeManilaU Team' }],
  creator: 'TEDxAteneodeManilaU',
  publisher: 'TEDxAteneodeManilaU',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tedxateneodemanilau.com',
    siteName: 'TEDxAteneodeManilaU',
    title:
      'TEDxAteneodeManilaU: Momentum',
    description:
      'Join TEDxAteneodeManilaU for Momentum, where we explore...',
    images: [
      {
        url: '/tedx-logo.png',
        width: 1200,
        height: 630,
        alt: 'TEDxAteneodeManilaU Momentum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'TEDxAteneodeManilaU: Momentum',
    description:
      'Join TEDxAteneodeManilaU for Momentum, where we explore...',
    images: ['/tedx-logo.png'],
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
    canonical: 'https://tedxateneodemanilau.com',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'event',
  classification: 'public',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
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
