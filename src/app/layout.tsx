import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CF Fogars Veterans",
  description: "Web oficial del CF Fogars Veterans · Fogars de la Selva",
  metadataBase: new URL(process.env.SITE_URL ?? "https://cffogars.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
