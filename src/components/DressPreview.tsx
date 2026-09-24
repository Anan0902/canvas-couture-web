interface PreviewProps {
  silhouette: string;
  color: string;
  secondary?: string;
  patternKey: string;
  addons: string[];
  scale: number;
  view: "front" | "back";
}

const patternDefs: Record<string, (id: string, color: string) => React.ReactNode> = {
  stripes: (id, color) => (
    <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill={color} />
      <rect width="3" height="8" fill="rgba(255,255,255,0.35)" />
    </pattern>
  ),
  dots: (id, color) => (
    <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill={color} />
      <circle cx="6" cy="6" r="2.2" fill="rgba(255,255,255,0.45)" />
    </pattern>
  ),
  checks: (id, color) => (
    <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill={color} />
      <rect width="7" height="7" fill="rgba(255,255,255,0.28)" />
      <rect x="7" y="7" width="7" height="7" fill="rgba(255,255,255,0.28)" />
    </pattern>
  ),
  floral: (id, color) => (
    <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
      <rect width="18" height="18" fill={color} />
      <g fill="rgba(255,255,255,0.5)">
        <circle cx="9" cy="5" r="1.7" />
        <circle cx="5" cy="9" r="1.7" />
        <circle cx="13" cy="9" r="1.7" />
        <circle cx="9" cy="13" r="1.7" />
      </g>
      <circle cx="9" cy="9" r="1.5" fill="rgba(0,0,0,0.12)" />
    </pattern>
  ),
};

function bodyPath(silhouette: string) {
  switch (silhouette) {
    case "anarkali":
      return "M100 70 L128 82 L134 140 Q160 230 168 286 L32 286 Q40 230 66 140 L72 82 Z";
    case "gown":
      return "M100 70 L126 82 L130 150 Q150 240 156 290 L44 290 Q50 240 70 150 L74 82 Z";
    case "kurti":
      return "M100 70 L128 82 L132 150 L130 250 L70 250 L68 150 L72 82 Z";
    case "lehenga":
      return "M100 70 L126 82 L128 140 L72 140 L74 82 Z M72 150 Q40 240 30 292 L170 292 Q160 240 128 150 Z";
    default:
      return "M100 70 L128 82 L132 142 Q152 220 160 278 L40 278 Q48 220 68 142 L72 82 Z";
  }
}

export function DressPreview({
  silhouette,
  color,
  secondary,
  patternKey,
  addons,
  scale,
  view,
}: PreviewProps) {
  const patternId = `pat-${patternKey}-${view}`;
  const usePattern = patternKey !== "plain" && patternDefs[patternKey];
  const fill = usePattern ? `url(#${patternId})` : color;
  const has = (name: string) => addons.some((a) => a.toLowerCase().includes(name));

  return (
    <svg
      viewBox="0 0 200 320"
      className="h-full w-full transition-transform duration-300"
      style={{ transform: `scale(${scale})` }}
      role="img"
      aria-label={`${view} view preview`}
    >
      <defs>
        {usePattern ? patternDefs[patternKey]!(patternId, color) : null}
        <linearGradient id="mann" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efe9e1" />
          <stop offset="100%" stopColor="#ded5c9" />
        </linearGradient>
      </defs>

      {/* mannequin */}
      <circle cx="100" cy="40" r="20" fill="url(#mann)" />
      <rect x="92" y="58" width="16" height="16" fill="url(#mann)" />
      <rect x="86" y="278" width="10" height="34" rx="5" fill="url(#mann)" />
      <rect x="104" y="278" width="10" height="34" rx="5" fill="url(#mann)" />
      <path d="M72 84 L52 170 L62 174 L82 96 Z" fill="url(#mann)" />
      <path d="M128 84 L148 170 L138 174 L118 96 Z" fill="url(#mann)" />

      {/* garment */}
      <path d={bodyPath(silhouette)} fill={fill} stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />

      {/* colour combination panel */}
      {secondary ? (
        <path
          d={
            silhouette === "kurti"
              ? "M100 82 L112 86 L112 250 L100 250 Z"
              : "M100 82 L114 88 L124 200 L100 200 Z"
          }
          fill={secondary}
          opacity="0.85"
        />
      ) : null}

      {view === "front" ? (
        <>
          <path d="M88 82 Q100 96 112 82" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          {has("lace") ? (
            <g stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none">
              <path d="M44 272 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0" />
            </g>
          ) : null}
          {has("flower") ? (
            <g fill="rgba(255,255,255,0.92)">
              {[
                [82, 120],
                [100, 108],
                [118, 122],
                [92, 142],
                [110, 146],
              ].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y! - 4} r="3" />
                  <circle cx={x! - 4} cy={y!} r="3" />
                  <circle cx={x! + 4} cy={y!} r="3" />
                  <circle cx={x} cy={y! + 4} r="3" />
                  <circle cx={x} cy={y} r="2" fill="#d8b24a" />
                </g>
              ))}
            </g>
          ) : null}
          {has("bead") ? (
            <g fill="#e8dcc0">
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx={74 + (i % 7) * 9} cy={i < 7 ? 100 : 112} r="1.9" />
              ))}
            </g>
          ) : null}
          {has("embroidery") ? (
            <path
              d="M76 170 q24 14 48 0"
              fill="none"
              stroke="#d8b24a"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
          ) : null}
        </>
      ) : (
        <>
          <path
            d="M86 82 Q100 130 114 82"
            fill="var(--color-background)"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.2"
          />
          {has("rope") ? (
            <g stroke="#d8b24a" strokeWidth="2.4" fill="none">
              <path d="M88 96 L112 112 M112 96 L88 112 M88 118 L112 134 M112 118 L88 134" />
              <path d="M88 140 q-12 18 -4 30" />
              <path d="M112 140 q12 18 4 30" />
            </g>
          ) : null}
          {has("lace") ? (
            <path
              d="M44 272 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
            />
          ) : null}
          {has("bead") ? (
            <g fill="#e8dcc0">
              {Array.from({ length: 7 }).map((_, i) => (
                <circle key={i} cx={76 + i * 8} cy={150} r="1.9" />
              ))}
            </g>
          ) : null}
        </>
      )}
    </svg>
  );
}
