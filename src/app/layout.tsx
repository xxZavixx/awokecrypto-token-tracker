import type { Metadata } from "next";
import Script from "next/script"; // ✅ Fix for Bootstrap JS
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME || "AwokeCrypto Token Tracker",
  description:
    APP_DESCRIPTION || "Track your crypto portfolio inside Farcaster.",

  // ✅ Icons for browser tab + Apple devices
  icons: {
    icon: "/favicon.ico", // favicon in public/
    shortcut: "/favicon.ico",
    apple: "/AwokeCryptoLogo.png", // iOS homescreen icon
  },

  // ✅ Open Graph (Farcaster, Discord, Facebook)
  openGraph: {
    title: "AwokeCrypto Token Tracker",
    description: "Track your crypto portfolio inside Farcaster.",
    url: "https://awokecrypto.vercel.app",
    siteName: "AwokeCrypto",
    images: [
      {
        url: "/AwokeCryptoLogo.png", // stored in public/
        width: 1200,
        height: 630,
        alt: "AwokeCrypto Token Tracker",
      },
    ],
    type: "website",
  },

  // ✅ Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "AwokeCrypto Token Tracker",
    description: "Track your crypto portfolio inside Farcaster.",
    images: ["/AwokeCryptoLogo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap CSS for tables/forms */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
        />
      </head>
      {/* 👇 Dark neon theme applied via globals.css */}
      <body className="miniapp miniapp-dark">
        <Providers>{children}</Providers>

        {/* ✅ Correct way to load Bootstrap JS in Next.js */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}


