import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bebas = localFont({
  src: "./fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas",
});

const manrope = localFont({
  src: "./fonts/Manrope.ttf",
  variable: "--font-manrope",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const SITE_TITLE = "HK Designs — Harish Kumar G, Paint & Roto Artist / Graphic Designer";
const SITE_DESCRIPTION =
  "Portfolio of Harish Kumar G — Paint & Roto artist and graphic designer working across VFX cleanup, brand identity, packaging, and print design.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | HK Designs",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "HK Designs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
      className={`${bebas.variable} ${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
