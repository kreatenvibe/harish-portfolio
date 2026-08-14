import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque.ttf",
  variable: "--font-bricolage",
});

const manrope = localFont({
  src: "./fonts/Manrope.ttf",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "KreatenVibe — Custom Business Software & Digital Solutions",
    template: "%s | KreatenVibe",
  },
  description:
    "KreatenVibe builds custom business software, CRM systems, websites, web applications, and AI-powered automation for growing businesses.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "KreatenVibe — Custom Business Software & Digital Solutions",
    description:
      "KreatenVibe builds custom business software, CRM systems, websites, web applications, and AI-powered automation for growing businesses.",
    siteName: "KreatenVibe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KreatenVibe — Custom Business Software & Digital Solutions",
    description:
      "KreatenVibe builds custom business software, CRM systems, websites, web applications, and AI-powered automation for growing businesses.",
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
      className={`${bricolage.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
