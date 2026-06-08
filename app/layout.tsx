import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "InsulinIQ — Metabolic Health Education",
    template: "%s | InsulinIQ",
  },
  description:
    "Science-backed education on insulin resistance, PCOS, prediabetes, NAFLD, and metabolic syndrome.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://insuliniq.com"
  ),
  openGraph: {
    type: "website",
    siteName: "InsulinIQ",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Plausible Analytics — privacy-friendly, no cookies */}
        {process.env.NEXT_PUBLIC_APP_URL?.includes("localhost") ? null : (
          <Script
            defer
            data-domain="insuliniq.com"
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
