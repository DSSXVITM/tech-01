import { buildOgCard } from "@/lib/og";

export const alt = "AI Tech — computer tutorials you can actually follow";
export const size = { width: 1200, height: 630 };

export default function TwitterImage() {
  return buildOgCard({
    eyebrow: "Live from the control room",
    title: "AI · Software · Security · Cloud",
  });
}
