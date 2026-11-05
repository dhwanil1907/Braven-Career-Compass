interface CompassDialProps {
  /** Match percent, 0 to 100. The needle swings toward north as the match gets stronger. */
  percent: number;
  size?: number;
  className?: string;
}

/** Needle sits at north (0 degrees) for a 100% match and leans up to 90 degrees off at 0%. */
function needleAngle(percent: number): number {
  const clamped = Math.min(100, Math.max(0, percent));
  return (100 - clamped) * 0.9;
}

export function CompassDial({ percent, size = 16, className = '' }: CompassDialProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <g transform={`rotate(${needleAngle(percent)} 12 12)`}>
        <path d="M12 5.5 14.6 12h-5.2z" fill="currentColor" />
        <path d="M12 18.5 14.6 12h-5.2z" fill="currentColor" opacity="0.3" />
      </g>
      <circle cx="12" cy="12" r="1.2" fill="var(--color-surface)" />
    </svg>
  );
}
