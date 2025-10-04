import { NextResponse, type NextRequest } from 'next/server';
import { getFarcasterDomainManifest } from '~/lib/utils';

export async function GET(req: NextRequest) {
  try {
    // Use the deployed origin (e.g., https://awokecrypto-token-tracker.vercel.app)
    const baseUrl = req.nextUrl.origin;

    const manifest = await getFarcasterDomainManifest(baseUrl);

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Cache a little to avoid hammering your app
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to generate manifest' },
      { status: 500 },
    );
  }
}





