import { NextResponse } from "next/server";
import { getFarcasterDomainManifest } from "~/lib/utils";

// Build the manifest with absolute URLs based on the request's origin
export async function GET(req: Request) {
  try {
    const { origin } = new URL(req.url); // <-- https://awokecrypto-token-tracker.vercel.app
    const config = getFarcasterDomainManifest(origin);
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Error generating Farcaster manifest:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}




