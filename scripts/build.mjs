import { execSync } from "node:child_process";

// OpenNext internally runs `npm run build` (via @opennextjs/aws buildNextApp)
// to produce the Next.js output it then wraps. If our npm "build" script were
// `opennextjs-cloudflare build`, that inner call would re-invoke OpenNext and
// recurse forever. OpenNext sets NEXT_PRIVATE_STANDALONE before running the
// inner build, so we detect that and run `next build` directly in that case.
// When Cloudflare (or a developer) runs `npm run build` from the outside, the
// flag is unset, so we run the full OpenNext Cloudflare build.
const isOpenNextInnerBuild = process.env.NEXT_PRIVATE_STANDALONE === "true";
const command = isOpenNextInnerBuild ? "next build" : "opennextjs-cloudflare build";

execSync(command, { stdio: "inherit" });
