import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Google Sign-In (Google Identity Services).
 *
 * The browser shows the "Sign in with Google" button (needs only the public
 * client ID, no secret). On success Google hands us an ID token (JWT). We
 * verify its signature against Google's public JWKS, then create/link the
 * local user by email and start a normal AI Tech session.
 *
 * The button only renders when GOOGLE_CLIENT_ID is set (see the login and
 * register pages), so the site works fine without it.
 */

/* --------------------------- env access --------------------------- */

export async function getGoogleClientId(): Promise<string | null> {
  if (typeof process !== "undefined" && process.env?.GOOGLE_CLIENT_ID) {
    return process.env.GOOGLE_CLIENT_ID;
  }
  try {
    const env = getCloudflareContext().env as unknown as Record<string, unknown>;
    const v = env.GOOGLE_CLIENT_ID;
    if (typeof v === "string" && v) return v;
  } catch {
    /* not on Cloudflare */
  }
  return null;
}

/* --------------------------- JWT helpers --------------------------- */

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

interface JwkEntry {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg: string;
  use: string;
}

let jwksCache: { fetchedAt: number; keys: JwkEntry[] } | null = null;

async function getGoogleKeys(): Promise<JwkEntry[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < 15 * 60 * 1000) {
    return jwksCache.keys;
  }
  const res = await fetch(GOOGLE_JWKS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch Google JWKS");
  const data = (await res.json()) as { keys?: JwkEntry[] };
  jwksCache = { fetchedAt: Date.now(), keys: data.keys ?? [] };
  return jwksCache.keys;
}

const encoder = new TextEncoder();

function base64UrlToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const pad = b64.length % 4;
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/") + (pad ? "=".repeat(4 - pad) : "");
  const bin = atob(normalized);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Verifies a Google ID token (JWT, RS256) against Google's public keys and
 * returns the profile, or null when the token is invalid/expired/for a
 * different client.
 */
export async function verifyGoogleToken(token: string, clientId: string): Promise<GoogleProfile | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  if (!headerB64 || !payloadB64 || !sigB64) return null;

  let header: { kid?: string; alg?: string };
  let payload: {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    aud?: string;
    iss?: string;
    exp?: number;
    email_verified?: boolean;
  };
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(headerB64)));
    payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
  } catch {
    return null;
  }

  // Structural + claim checks before touching crypto.
  if (!header.kid || header.alg !== "RS256") return null;
  if (payload.aud !== clientId) return null;
  if (!payload.iss || !GOOGLE_ISSUERS.has(payload.iss)) return null;
  if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
  if (payload.email_verified !== true || typeof payload.email !== "string" || !payload.email) return null;

  // Signature check against Google's public key.
  const keys = await getGoogleKeys();
  const key = keys.find((k) => k.kid === header.kid && k.use === "sig" && k.kty === "RSA");
  if (!key) return null;

  const publicKey = await (crypto.subtle.importKey as (
    format: string,
    keyData: unknown,
    algorithm: RsaHashedImportParams | AlgorithmIdentifier,
    extractable: boolean,
    keyUsages: KeyUsage[],
  ) => Promise<CryptoKey>)(
    "jwk",
    { kty: "RSA", n: key.n, e: key.e, alg: "RS256", kid: key.kid, use: "sig" },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const valid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    publicKey,
    base64UrlToBytes(sigB64),
    encoder.encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) return null;

  return {
    sub: payload.sub ?? "",
    email: payload.email,
    name: payload.name ?? "",
    picture: payload.picture,
  };
}
