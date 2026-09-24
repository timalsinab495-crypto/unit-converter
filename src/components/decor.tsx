// Decorative SVGs: the Dhaka textile band, the Himalayan skyline and prayer flags.
// All purely visual, so they're hidden from screen readers.

const FLAG_COLORS = ["#2a55c2", "#ffffff", "#d0103a", "#2e7d4f", "#f4b400"];

const DHAKA_TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" viewBox="0 0 32 16">` +
    `<rect width="32" height="16" fill="#14245e"/>` +
    `<path d="M0 16 8 6l8 10Z" fill="#d0103a"/>` +
    `<path d="M16 16l8-10 8 10Z" fill="#f4a417"/>` +
    `<path d="M8 0l8 7 8-7Z" fill="#2e7d4f"/>` +
    `<path d="M-8 0 0 7l8-7ZM24 0l8 7 8-7Z" fill="#f4f6fb"/>` +
    `<path d="M8 9.5l1.6 2-1.6 2-1.6-2ZM24 9.5l1.6 2-1.6 2-1.6-2Z" fill="#f4f6fb"/>` +
    `</svg>`,
);

/** A strip of the triangle pattern woven into Dhaka cloth (and the Dhaka topi). */
export function DhakaBand({ className = "h-3" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`w-full ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${DHAKA_TILE}")`,
        backgroundSize: "auto 100%",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

/** Layered ridges with snowy peaks. The two close peaks near the middle nod to Machhapuchhre. */
export function Mountains({ className = "", id = "snow" }: { className?: string; id?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" className={`block w-full ${className}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.08" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#d4dff0" />
          <stop offset="1" stopColor="#b3c3e2" />
        </linearGradient>
      </defs>
      <path
        d="M0 205 90 150l60 22 90-80 58 46 62-24 70-64 40 32 48-22 44-60 22 26 22-40 46 82 70-24 82 54 78-64 62 42 70-66 70 70 70-30 80 52 70-44 80 54 60-24v130H0Z"
        fill={`url(#${id})`}
      />
      <path
        d="M0 222c80-40 150-52 240-24s150 6 240-20 170-8 250 18 160 10 250-18 160-22 250 10 140 14 210-6v78H0Z"
        fill="#7d93c6"
        opacity="0.75"
      />
      <path d="M0 246c120-36 240-40 380-14s250 10 380-8 260-4 380 16 200 8 300-10v30H0Z" fill="#14245e" />
    </svg>
  );
}

/** A string of lungta prayer flags sagging across the top of a section. */
export function PrayerFlags({ count = 26, className = "" }: { count?: number; className?: string }) {
  const width = 1440;
  const sag = 46;
  const point = (t: number) => ({
    x: t * width,
    y: 8 + 4 * sag * t * (1 - t), // simple parabola
  });

  return (
    <svg aria-hidden viewBox={`0 0 ${width} 110`} preserveAspectRatio="xMidYMin slice" className={`block w-full ${className}`}>
      <path d={`M0 8 Q ${width / 2} ${8 + 2 * sag} ${width} 8`} fill="none" stroke="#14245e" strokeOpacity="0.35" strokeWidth="1.5" />
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        const { x, y } = point(t);
        const color = FLAG_COLORS[i % FLAG_COLORS.length];
        return (
          <rect
            key={i}
            className="prayer-flag animate-flag"
            style={{ animationDelay: `${(i % 7) * -0.7}s` }}
            x={x - 15}
            y={y}
            width="30"
            height="38"
            rx="1.5"
            fill={color}
            stroke={color === "#ffffff" ? "#c9d3e6" : "none"}
          />
        );
      })}
    </svg>
  );
}

/** The double pennant of the Nepali flag, used as the logo mark and section markers. */
export function Pennant({ className = "h-8 w-7", color = "#d0103a" }: { className?: string; color?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 48" className={className}>
      <path d="M3 2 37 24H17l20 22H3Z" fill={color} stroke="#14245e" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="11" cy="16" r="3" fill="#fff" />
      <circle cx="11" cy="35" r="4" fill="#fff" />
    </svg>
  );
}
