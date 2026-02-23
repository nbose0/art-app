import type { Artwork, Museum } from "./types";
import { museums } from "./museums";

async function fetchMetArtworks(
  museum: Museum
): Promise<Artwork[]> {
  const deptId = museum.apiParams?.departmentId ?? 11;
  const query = (museum.apiParams?.q as string) ?? "sculpture";
  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(query)}&departmentId=${deptId}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error("Met search failed");
  const { objectIDs } = (await searchRes.json()) as {
    objectIDs: number[] | null;
  };
  if (!objectIDs || objectIDs.length === 0) return [];

  // Pick 30 random IDs to account for failures
  const shuffled = [...objectIDs].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 30);

  const results = await Promise.allSettled(
    sample.map(async (id) => {
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      );
      if (!res.ok) throw new Error(`Object ${id} failed`);
      return res.json();
    })
  );

  const artworks: Artwork[] = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const obj = result.value as Record<string, unknown>;
    const imageUrl = obj.primaryImage as string;
    const thumbUrl = obj.primaryImageSmall as string;
    if (!thumbUrl) continue;

    artworks.push({
      id: String(obj.objectID),
      title: (obj.title as string) || "Untitled",
      artist: (obj.artistDisplayName as string) || "Unknown Artist",
      date: (obj.objectDate as string) || "",
      imageUrl: imageUrl || thumbUrl,
      thumbnailUrl: thumbUrl,
      medium: (obj.medium as string) || "",
      sourceMuseum: museum.name,
      sourceUrl: (obj.objectURL as string) || museum.websiteUrl,
    });

    if (artworks.length >= 20) break;
  }

  return artworks;
}

async function fetchArticArtworks(
  museum: Museum
): Promise<Artwork[]> {
  const query = (museum.apiParams?.q as string) ?? "sculpture";
  const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&fields=id,title,artist_title,date_display,image_id,medium_display&limit=100`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("AIC search failed");
  const data = (await res.json()) as {
    data: Array<{
      id: number;
      title: string;
      artist_title: string | null;
      date_display: string | null;
      image_id: string | null;
      medium_display: string | null;
    }>;
  };

  const withImages = data.data.filter((item) => item.image_id);
  const shuffled = [...withImages].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 20);

  return sample.map((item) => ({
    id: String(item.id),
    title: item.title || "Untitled",
    artist: item.artist_title || "Unknown Artist",
    date: item.date_display || "",
    imageUrl: `https://lakeimagesweb.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg`,
    thumbnailUrl: `https://lakeimagesweb.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`,
    medium: item.medium_display || "",
    sourceMuseum: museum.name,
    sourceUrl: `https://www.artic.edu/artworks/${item.id}`,
  }));
}

async function fetchClevelandArtworks(
  museum: Museum
): Promise<Artwork[]> {
  let url = `https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=100`;
  if (museum.apiParams?.type) {
    url += `&type=${encodeURIComponent(String(museum.apiParams.type))}`;
  }
  if (museum.apiParams?.created_after) {
    url += `&created_after=${museum.apiParams.created_after}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Cleveland search failed");
  const data = (await res.json()) as {
    data: Array<{
      id: number;
      title: string;
      creators: Array<{ description: string }>;
      creation_date: string | null;
      images: { web?: { url: string } };
      technique: string | null;
      url: string;
    }>;
  };

  const withImages = data.data.filter((item) => item.images?.web?.url);
  const shuffled = [...withImages].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 20);

  return sample.map((item) => ({
    id: String(item.id),
    title: item.title || "Untitled",
    artist: item.creators?.[0]?.description || "Unknown Artist",
    date: item.creation_date || "",
    imageUrl: item.images.web!.url,
    thumbnailUrl: item.images.web!.url,
    medium: item.technique || "",
    sourceMuseum: museum.name,
    sourceUrl: item.url || museum.websiteUrl,
  }));
}

const RIJKS_HEADERS = { Accept: "application/ld+json" };
const EN_LANG = "http://vocab.getty.edu/aat/300388277";

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractRijksFields(obj: any): {
  title: string;
  artist: string;
  date: string;
  sourceUrl: string;
  visualItemId: string | null;
} {
  const isEn = (item: any) =>
    (item.language || []).some((l: any) => l.id === EN_LANG);

  // Title: first English Name
  const names = (obj.identified_by || []).filter(
    (x: any) => x.type === "Name" && isEn(x)
  );
  const title = names[0]?.content || "Untitled";

  // Artist: English production statement (aat:300435416)
  let artist = "Unknown Artist";
  for (const part of (obj.produced_by?.part || [])) {
    for (const ref of (part.referred_to_by || [])) {
      if (!isEn(ref)) continue;
      const ids = (ref.classified_as || []).map((c: any) =>
        typeof c === "string" ? c : c.id
      );
      if (ids.includes("http://vocab.getty.edu/aat/300435416")) {
        artist = ref.content;
        break;
      }
    }
    if (artist !== "Unknown Artist") break;
  }

  // Date
  let date = "";
  for (const ident of (obj.produced_by?.timespan?.identified_by || [])) {
    if (isEn(ident)) {
      date = ident.content;
      break;
    }
  }

  // Website URL
  let sourceUrl = "";
  for (const subj of (obj.subject_of || [])) {
    for (const dig of (subj.digitally_carried_by || [])) {
      for (const ap of (dig.access_point || [])) {
        if (ap.id?.includes("rijksmuseum.nl")) {
          sourceUrl = ap.id;
        }
      }
    }
  }

  const visualItemId = obj.shows?.[0]?.id || null;

  return { title, artist, date, sourceUrl, visualItemId };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function resolveRijksArtwork(
  objectUrl: string,
  museum: Museum
): Promise<Artwork | null> {
  // Step 1: Fetch object → title, artist, date, visual item ID
  const objRes = await fetch(objectUrl, { headers: RIJKS_HEADERS });
  if (!objRes.ok) return null;
  const obj = await objRes.json();
  const { title, artist, date, sourceUrl, visualItemId } =
    extractRijksFields(obj);
  if (!visualItemId) return null;

  // Step 2: Fetch visual item → digital object ID
  const visRes = await fetch(visualItemId, { headers: RIJKS_HEADERS });
  if (!visRes.ok) return null;
  const vis = (await visRes.json()) as {
    digitally_shown_by?: Array<{ id: string }>;
  };
  const digitalObjectId = vis.digitally_shown_by?.[0]?.id;
  if (!digitalObjectId) return null;

  // Step 3: Fetch digital object → actual image URL
  const digRes = await fetch(digitalObjectId, { headers: RIJKS_HEADERS });
  if (!digRes.ok) return null;
  const dig = (await digRes.json()) as {
    access_point?: Array<{ id: string }>;
  };
  const imageUrl = dig.access_point?.[0]?.id;
  if (!imageUrl) return null;

  const thumbnailUrl = imageUrl.replace("/full/max/", "/full/400,/");

  return {
    id: objectUrl.split("/").pop() || objectUrl,
    title,
    artist,
    date,
    imageUrl,
    thumbnailUrl,
    medium: "",
    sourceMuseum: museum.name,
    sourceUrl: sourceUrl || museum.websiteUrl,
  };
}

async function fetchRijksArtworks(
  museum: Museum
): Promise<Artwork[]> {
  const params = new URLSearchParams({ imageAvailable: "true" });
  if (museum.apiParams?.rijksType) {
    params.set("type", String(museum.apiParams.rijksType));
  }
  if (museum.apiParams?.description) {
    params.set("description", String(museum.apiParams.description));
  }

  const searchUrl = `https://data.rijksmuseum.nl/search/collection?${params}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error("Rijksmuseum search failed");

  const searchData = (await searchRes.json()) as {
    orderedItems: Array<{ id: string; type: string }>;
  };
  const items = searchData.orderedItems || [];
  if (items.length === 0) return [];

  // Pick 30 random IDs to account for resolution failures
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 30);

  // Resolve each object in parallel (3 API calls per object, all objects concurrent)
  const results = await Promise.allSettled(
    sample.map((item) => resolveRijksArtwork(item.id, museum))
  );

  const artworks: Artwork[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      artworks.push(result.value);
      if (artworks.length >= 20) break;
    }
  }

  return artworks;
}

export async function fetchArtworksForMuseum(
  museumId: string
): Promise<Artwork[]> {
  const museum = museums.find((m) => m.id === museumId);
  if (!museum) throw new Error(`Museum not found: ${museumId}`);

  switch (museum.apiSource) {
    case "met":
      return fetchMetArtworks(museum);
    case "artic":
      return fetchArticArtworks(museum);
    case "cleveland":
      return fetchClevelandArtworks(museum);
    case "rijks":
      return fetchRijksArtworks(museum);
    default:
      throw new Error(`Unknown API source: ${museum.apiSource}`);
  }
}
