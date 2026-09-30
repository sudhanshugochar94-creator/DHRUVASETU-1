import React from 'react';

/**
 * Layered arctic mountain ridgeline. Pure SVG, no external assets.
 * `variant="hero"` is tall with snow caps; `variant="divider"` is a low ridge
 * used to separate sections and to sit on top of the footer.
 */
interface MountainRangeProps {
  variant?: 'hero' | 'divider';
  className?: string;
  /** colour of the ground the ridge sits on, so the bottom edge blends in */
  base?: string;
}

export const MountainRange: React.FC<MountainRangeProps> = ({
  variant = 'hero',
  className = '',
  base = '#f4f9fc',
}) => {
  if (variant === 'divider') {
    return (
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`block w-full h-16 sm:h-24 ${className}`}
      >
        <path
          d="M0 120V70l90-28 70 22 110-46 90 40 100-52 120 58 90-30 120 46 110-56 100 44 90-24 130 52 100-34 120 30V120z"
          fill="#cfe4f2"
        />
        <path
          d="M0 120V92l120-24 90 20 130-38 100 34 110-30 120 40 100-26 130 34 110-40 120 36 100-18 110 28V120z"
          fill={base}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={`block w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="ds-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd8ec" />
          <stop offset="1" stopColor="#dbeaf5" />
        </linearGradient>
        <linearGradient id="ds-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb9d9" />
          <stop offset="1" stopColor="#c3dcee" />
        </linearGradient>
        <linearGradient id="ds-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b93bf" />
          <stop offset="1" stopColor="#9cc2de" />
        </linearGradient>
      </defs>

      {/* far range */}
      <path
        d="M0 420V250l70-40 60 26 90-70 80 54 70-38 100 80 90-96 110 90 80-46 90 62 100-92 90 70 80-44 110 74 90-58 90 40 70-38 100 62V420z"
        fill="url(#ds-far)"
      />

      {/* middle range with snow caps */}
      <path
        d="M0 420V300l100-60 70 36 130-120 90 90 60-40 140 130 110-150 120 140 90-70 100 96 110-130 90 90 80-50 140 110V420z"
        fill="url(#ds-mid)"
      />
      <g fill="#ffffff" opacity="0.9">
        <path d="M300 156L266 190L282 184L292 198L306 186L316 196L334 190z" />
        <path d="M700 186L666 220L682 214L692 228L706 216L716 226L734 220z" />
        <path d="M1120 222L1086 256L1102 250L1112 264L1126 252L1136 262L1154 256z" />
      </g>

      {/* near range */}
      <path
        d="M0 420V340l120-70 90 50 110-100 100 96 80-50 130 110 100-120 110 116 100-70 120 100 90-80 130 80 90-40 70 20V420z"
        fill="url(#ds-near)"
      />
      <g fill="#ffffff" opacity="0.95">
        <path d="M120 270L86 304L102 298L112 312L126 300L136 310L154 304z" />
        <path d="M320 220L286 254L302 248L312 262L326 250L336 260L354 254z" />
        <path d="M730 256L696 290L712 284L722 298L736 286L746 296L764 290z" />
        <path d="M1150 322L1116 356L1132 350L1142 364L1156 352L1166 362L1184 356z" />
      </g>

      {/* snowfield foreground */}
      <path
        d="M0 420V376c120-22 220-14 340 4s240 20 380-6 300-26 420-4 220 8 300-10V420z"
        fill={base}
      />
    </svg>
  );
};
