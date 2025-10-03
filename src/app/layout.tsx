import type { Metadata } from "next";
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

export const metadata: Metadata = {
  title: APP_NAME || "AwokeCrypto Token Tracker",
  description:
    APP_DESCRIPTION || "Track your crypto portfolio inside Farcaster.",

  // ✅ Browser tab + Apple devices
  icons: {
    icon: "/favicon.ico", // standard favicon
    shortcut: "/favicon.ico",
    apple: "/AwokeCryptoLogo.png", // iOS homescreen icon
  },

  // ✅ Social preview (Farcaster, Twitter, Discord, etc.)
  openGraph: {
    title: "AwokeCrypto Token Tracker",
    description: "Track your crypto portfolio inside Farcaster.",
    url: "https://awokecrypto.vercel.app", // change if different domain
    siteName: "AwokeCrypto",
    images: [
      {
        url: "/AwokeCryptoLogo.png", // 👈 use your public logo
        width: 1200,
        height: 630,
        alt: "AwokeCrypto Token Tracker",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AwokeCrypto Token Tracker",
    description: "Track your crypto portfolio inside Farcaster.",
    images: ["/AwokeCryptoLogo.png"], // 👈 social preview image
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
      {/* 👇 Apply dark neon theme via globals.css */}
      <body className="miniapp miniapp-dark">
        <Providers>{children}</Providers>

        {/* Bootstrap JS (optional, for dropdowns etc.) */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}

