const PALETTES = [
  { from: "#3B5BFF", to: "#7C5CFF" },
  { from: "#2FBF8F", to: "#3BB4FF" },
  { from: "#FF7A59", to: "#FFB020" },
];

function paletteFor(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

/** Deterministic initials avatar (no external images). Pass `src` (a base64
 *  data URI) to render the user's uploaded profile picture instead. */
export function Avatar({
  seed,
  name,
  size = 40,
  src,
}: {
  seed: string;
  name: string;
  size?: number;
  src?: string | null;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${name} avatar`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{ objectFit: "cover", width: size, height: size, borderRadius: "50%" }}
        className="flex-none"
      />
    );
  }

  const { from, to } = paletteFor(seed);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label={`${name} avatar`} className="flex-none">
      <defs>
        <linearGradient id={`av-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#av-${seed})`} />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontFamily="'Big Shoulders Display', sans-serif"
        fontSize="17"
        fontWeight="700"
        fill="#fff"
      >
        {initials}
      </text>
    </svg>
  );
}
