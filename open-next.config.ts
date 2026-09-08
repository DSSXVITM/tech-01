import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Use the KV incremental cache so prerendered (SSG) pages are stored in a
// Workers KV namespace and served by the Worker without on-demand rendering.
// The default ("dummy") cache stores nothing, forcing every SSG page to render
// on-demand, which exceeded the Cloudflare Worker CPU/memory limit (error 1102
// -> 503). KV is available on the free plan (R2 was not enabled on this account).
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
