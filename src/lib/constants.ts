import { type AccountAssociation } from "@farcaster/miniapp-core/src/manifest";

/**
 * Application constants and configuration values.
 */

// --- App Configuration ---
export const APP_URL: string =
  process.env.NEXT_PUBLIC_URL ?? "https://awokecrypto-token-tracker.vercel.app";

export const APP_NAME: string = "AwokeCrypto Token Tracker";
export const APP_DESCRIPTION: string =
  "A simple Farcaster mini app for tracking live crypto token prices from AwokeCrypto.xyz.";
export const APP_PRIMARY_CATEGORY: string = "finance";
export const APP_TAGS: string[] = [
  "crypto",
  "tokens",
  "tracker",
  "prices",
  "portfolio",
  "awokecrypto",
];

// --- Asset URLs ---
export const APP_ICON_URL: string = `${APP_URL}/icon.png`;
export const APP_OG_IMAGE_URL: string = `${APP_URL}/AwokeCryptoLogo.png`;
export const APP_SPLASH_URL: string = `${APP_URL}/splash.png`;
export const APP_SPLASH_BACKGROUND_COLOR: string = "#f7f7f7";

// --- Domain Verification (Required for Farcaster manifest) ---
export const APP_ACCOUNT_ASSOCIATION: AccountAssociation = {
  header:
    "eyJmaWQiOjIyOTc0OCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDI3OTEyNkNDY2EzMjI4MjdmY2U0NjE2NDIyRmQ3QjUyMzI5RDA5OTAifQ",
  payload:
    "eyJkb21haW4iOiJhd29rZWNyeXB0by10b2tlbi10cmFja2VyLnZlcmNlbC5hcHAifQ",
  signature:
    "N8u2tg6MNjzm3Jw/hqAGkYhd4M3n9RlqWcOMBpaQi8NLo63RNeetz1HxpHfS/+UMt3GAaxc42nuyee7gZgRslBs=",
};

// --- UI Configuration ---
export const APP_BUTTON_TEXT: string = "Open Token Tracker";

// --- Integration Configuration ---
export const APP_WEBHOOK_URL: string =
  process.env.NEYNAR_API_KEY && process.env.NEYNAR_CLIENT_ID
    ? `https://api.neynar.com/f/app/${process.env.NEYNAR_CLIENT_ID}/event`
    : `${APP_URL}/api/webhook`;

export const USE_WALLET: boolean = true;
export const ANALYTICS_ENABLED: boolean = false;
export const APP_REQUIRED_CHAINS: string[] = [];
export const RETURN_URL: string | undefined = undefined;

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract:
    "0x00000000fc700472606ed4fa22623acf62c60553" as `0x${string}`,
};

// PLEASE DO NOT UPDATE THIS
export const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];
