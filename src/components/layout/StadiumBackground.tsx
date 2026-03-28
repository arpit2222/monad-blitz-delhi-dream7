"use client";

export default function StadiumBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden dot-grid">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glowBlue" cx="80%" cy="20%" r="40%">
            <stop offset="0%" stopColor="rgba(25,56,138,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="glowCyan" cx="20%" cy="80%" r="35%">
            <stop offset="0%" stopColor="rgba(0,180,216,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Glow blobs */}
        <rect width="100%" height="100%" fill="url(#glowBlue)" />
        <rect width="100%" height="100%" fill="url(#glowCyan)" />

        {/* Stadium floodlight beams from top-left */}
        <rect
          x="-100"
          y="-100"
          width="800"
          height="40"
          fill="url(#beam)"
          transform="rotate(25, 0, 0)"
        />
        <rect
          x="-100"
          y="-100"
          width="800"
          height="25"
          fill="url(#beam)"
          transform="rotate(35, 0, 0)"
        />
        <rect
          x="-100"
          y="-100"
          width="600"
          height="20"
          fill="url(#beam)"
          transform="rotate(45, 0, 0)"
        />
        <rect
          x="-100"
          y="-100"
          width="500"
          height="15"
          fill="url(#beam)"
          transform="rotate(55, 0, 0)"
        />
        <rect
          x="-100"
          y="-100"
          width="900"
          height="12"
          fill="url(#beam)"
          transform="rotate(20, 0, 0)"
        />
        <rect
          x="-100"
          y="-100"
          width="700"
          height="18"
          fill="url(#beam)"
          transform="rotate(42, 0, 0)"
        />

        {/* Stadium arc at bottom */}
        <ellipse
          cx="50%"
          cy="110%"
          rx="60%"
          ry="40%"
          fill="none"
          stroke="rgba(25,56,138,0.2)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
