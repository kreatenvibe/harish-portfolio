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

const SITE_TITLE = "HK Designs — Harish Kumar G, Graphic Designer";
const SITE_DESCRIPTION =
  "Portfolio of Harish Kumar G — Graphic Designer specializing in brand identity, packaging, print collateral, and digital visual systems.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | HK Designs",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
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
