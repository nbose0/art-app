import { NextResponse } from "next/server";
import { fetchArtworksForMuseum } from "@/lib/museumApi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ museumId: string }> }
) {
  const { museumId } = await params;

  try {
    const artworks = await fetchArtworksForMuseum(museumId);
    return NextResponse.json(artworks);
  } catch (error) {
    console.error(`Failed to fetch artworks for ${museumId}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch artworks: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
