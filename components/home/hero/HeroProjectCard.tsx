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
        <div className="relative overflow-hidden rounded-none border border-line bg-surface">
          <div className="relative aspect-4/3 w-full">
            {/* Top Left Number */}
            <div className="absolute top-4 left-4 z-20 text-white/90">
              <span className="block font-mono text-[10px] font-medium tracking-widest">
                {number}
              </span>
              <span className="block mt-1 h-px w-4 bg-white/50" />
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
              <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase leading-[0.88] tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                SOCIAL<br />MEDIA
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
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
        <div className="relative overflow-hidden rounded-none border border-line bg-surface">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 55vw, 42vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
              priority
            />

            {/* Bottom Left Overlay */}
            <div className="absolute bottom-5 left-5 z-20 text-white">
              <span className="block font-mono text-[11px] font-medium tracking-widest text-white/80">
                {number}
              </span>
              <span className="block my-1.5 h-px w-6 bg-white/60" />
              <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none text-white">
                {title}
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
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
        <div className="relative overflow-hidden rounded-none border border-line bg-surface">
          <div className="relative aspect-[16/11] w-full">
            {/* Top Left Number Label */}
            <div className="absolute top-4 left-4 z-20 text-foreground/80">
              <span className="block font-mono text-[10px] font-medium tracking-widest">
                {number}
              </span>
              <span className="block mt-1 h-px w-4 bg-foreground/30" />
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
              <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                {title}
              </h3>
            </div>

            {/* 1px red signal line on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
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
      <div className="relative overflow-hidden rounded-none border border-line bg-surface">
        <div className="relative aspect-[16/10] w-full">
          {/* Top Left Number */}
          <div className="absolute top-4 left-5 z-20 text-white/80">
            <span className="block font-mono text-[10px] font-medium tracking-widest">
              {number}
            </span>
            <span className="block mt-1 h-px w-4 bg-white/40" />
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
            <span className="block font-mono text-[9px] font-medium tracking-widest text-white/60 mb-0.5">
              {number}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase leading-[0.88] tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              PRINT<br />DESIGN
            </h3>
          </div>

          {/* 1px red signal line on hover */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 origin-left z-30" />
        </div>
      </div>
    </Link>
  );
}
