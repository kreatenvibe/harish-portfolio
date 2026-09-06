import Link from "next/link";
import Image from "next/image";

type HeroProjectCardProps = {
  number: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  variant: "branding" | "packaging" | "social" | "print";
  href?: string;
  className?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

export function HeroProjectCard({
  number,
  title,
  imageSrc,
  imageAlt,
  variant,
  href = "/work",
  className = "",
  onHoverStart,
  onHoverEnd,
}: HeroProjectCardProps) {
  const commonLinkClasses =
    "group block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const cardContainerClasses =
    "relative overflow-hidden rounded-none border border-black/15 dark:border-white/15 bg-surface shadow-[0_16px_40px_-8px_rgba(10,10,10,0.25),0_6px_18px_-4px_rgba(10,10,10,0.14),0_0_0_1px_rgba(10,10,10,0.08)] transition-all duration-500 group-hover:shadow-[0_28px_60px_-12px_rgba(10,10,10,0.35),0_12px_26px_-4px_rgba(10,10,10,0.2),0_0_0_1px_rgba(10,10,10,0.12)]";

  if (variant === "social") {
    return (
      <Link
        href={href}
        className={`${commonLinkClasses} ${className}`}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        aria-label={`${number} ${title}`}
      >
        <div className={cardContainerClasses}>
          <div className="relative aspect-4/3 w-full">
            {/* Dark Scrim for high contrast */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

            {/* Top Left Number */}
            <div className="absolute top-4 left-4 z-20 text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span className="block font-mono text-[10px] font-medium tracking-widest">
                {number}
              </span>
              <span className="block mt-1 h-px w-4 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>

            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
              priority
            />

            {/* Bottom Left Title */}
            <div className="absolute bottom-4 left-4 z-20 text-white">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase leading-[0.88] tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                SOCIAL<br />MEDIA
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "branding") {
    return (
      <Link
        href={href}
        className={`${commonLinkClasses} ${className}`}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        aria-label={`${number} ${title}`}
      >
        <div className={cardContainerClasses}>
          <div className="relative aspect-16/10 w-full">
            {/* Dark Scrim for high contrast across light image background */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />

            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 55vw, 42vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
              priority
            />

            {/* Bottom Left Overlay */}
            <div className="absolute bottom-5 left-5 z-20 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="block font-mono text-[11px] font-semibold tracking-widest text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {number}
              </span>
              <span className="block my-1.5 h-px w-6 bg-white/75 shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
              <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {title}
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "packaging") {
    return (
      <Link
        href={href}
        className={`${commonLinkClasses} ${className}`}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        aria-label={`${number} ${title}`}
      >
        <div className={cardContainerClasses}>
          <div className="relative aspect-16/11 w-full">
            {/* Dark Scrim for high contrast */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

            {/* Top Left Number Label */}
            <div className="absolute top-4 left-4 z-20 text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span className="block font-mono text-[10px] font-semibold tracking-widest">
                {number}
              </span>
              <span className="block mt-1 h-px w-4 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>

            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 34vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
              priority
            />

            {/* Bottom Left Title */}
            <div className="absolute bottom-4 left-4 z-20">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {title}
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
          </div>
        </div>
      </Link>
    );
  }

  // Print Design
  return (
    <Link
      href={href}
      className={`${commonLinkClasses} ${className}`}
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      aria-label={`${number} ${title}`}
    >
      <div className={cardContainerClasses}>
        <div className="relative aspect-16/10 w-full">
          {/* Dark Scrim for high contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent pointer-events-none z-10" />

          {/* Top Left Number */}
          <div className="absolute top-4 left-5 z-20 text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            <span className="block font-mono text-[10px] font-semibold tracking-widest">
              {number}
            </span>
            <span className="block mt-1 h-px w-4 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>

          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 40vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
            priority
          />

          {/* Bottom Left Title */}
          <div className="absolute bottom-4 left-5 z-20 text-white">
            <span className="block font-mono text-[9px] font-semibold tracking-widest text-white/80 mb-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {number}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase leading-[0.88] tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              PRINT<br />DESIGN
            </h3>
          </div>

          {/* 1px red signal line on hover */}
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
        </div>
      </div>
    </Link>
  );
}
