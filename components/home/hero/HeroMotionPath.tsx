export function HeroMotionPath() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-5"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Curving swoosh path passing safely behind the Social Media card without clipping */}
        <path
          data-hero-motion-path
          d="M 320 380 C 180 370 40 390 40 440 C 40 490 180 515 540 495"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Terminal red dot */}
        <circle
          data-hero-motion-dot
          cx="540"
          cy="495"
          r="4.5"
          fill="var(--accent)"
        />
      </svg>
    </div>
  );
}
