import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Manifest } from "@farcaster/miniapp-core/src/manifest";
import {
  APP_BUTTON_TEXT,
  APP_DESCRIPTION,
  APP_ICON_URL,
  APP_NAME,
  APP_OG_IMAGE_URL,
  APP_PRIMARY_CATEGORY,
  APP_SPLASH_BACKGROUND_COLOR,
  APP_SPLASH_URL,
  APP_TAGS,
  APP_URL,
  APP_WEBHOOK_URL,
  APP_ACCOUNT_ASSOCIATION,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMiniAppEmbedMetadata(ogImageUrl?: string) {
  return {
    version: "next",
    imageUrl: ogImageUrl ?? APP_OG_IMAGE_URL,
    ogTitle: APP_NAME,
    ogDescription: APP_DESCRIPTION,
    ogImageUrl: ogImageUrl ?? APP_OG_IMAGE_URL,
    button: {
      title: APP_BUTTON_TEXT,
      action: {
        type: "launch_frame",
        name: APP_NAME,
        url: APP_URL,
        splashImageUrl: APP_SPLASH_URL,
        iconUrl: APP_ICON_URL,
        splashBackgroundColor: APP_SPLASH_BACKGROUND_COLOR,
        description: APP_DESCRIPTION,
        primaryCategory: APP_PRIMARY_CATEGORY,
        tags: APP_TAGS,
      },
    },
  };
}

/**
 * Resolve a URL:
 * - absolute (http/https) => keep as-is
 * - relative (/file.png) => prefix with baseUrl
 * - undefined => use fallbackPath with baseUrl
 */
function resolveUrl(baseUrl: string, value?: string, fallbackPath?: string) {
  if (value && /^https?:\/\//i.test(value)) return value;
  if (value && value.startsWith("/")) return `${baseUrl}${value}`;
  if (fallbackPath) return `${baseUrl}${fallbackPath}`;
  return baseUrl;
}

/**
 * Build the Farcaster Domain Manifest
 */
export async function getFarcasterDomainManifest(baseUrl: string): Promise<Manifest> {
  const homeUrl = APP_URL || baseUrl;

  return {
    accountAssociation: APP_ACCOUNT_ASSOCIATION!,
    miniapp: {
      version: "1",
      name: APP_NAME ?? "AwokeCrypto Token Tracker",
      homeUrl,
      iconUrl: resolveUrl(baseUrl, APP_ICON_URL, "/icon.png"),
      imageUrl: resolveUrl(baseUrl, APP_OG_IMAGE_URL, "/AwokeCryptoLogo.png"),
      buttonTitle: APP_BUTTON_TEXT ?? "Open Token Tracker",
      splashImageUrl: resolveUrl(baseUrl, APP_SPLASH_URL, "/splash.png"),
      splashBackgroundColor: APP_SPLASH_BACKGROUND_COLOR ?? "#0a0f16",
      webhookUrl: APP_WEBHOOK_URL || "https://api.neynar.com/v2/farcaster/mini-apps/hooks",
    },
  };
}

