export function HeroMotionPath() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Curving swoosh path passing behind the Social Media card */}
        <path
          d="M 320 420 C 180 410 40 430 40 480 C 40 540 180 570 540 545"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Terminal red dot */}
        <circle
          cx="540"
          cy="545"
          r="4.5"
          fill="var(--accent)"
        />
      </svg>
    </div>
  );
}
