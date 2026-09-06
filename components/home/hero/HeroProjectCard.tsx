import Image from "next/image";

type HeroProjectCardProps = {
  number: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  variant: "branding" | "packaging" | "social" | "print";
  className?: string;
};

export function HeroProjectCard({
  number,
  title,
  imageSrc,
  imageAlt,
  variant,
  className = "",
}: HeroProjectCardProps) {
  if (variant === "social") {
    return (
      <div className={`relative ${className}`}>
        {/* Label on top-left of Social Media card */}
        <div className="absolute -top-3 -left-4 z-20 font-heading tracking-tight leading-none text-foreground">
          <span className="block font-mono text-[10px] font-semibold tracking-widest text-muted/80 mb-1">
            {number}
          </span>
          <span className="block text-2xl sm:text-3xl font-bold uppercase leading-[0.88]">
            SOCIAL<br />MEDIA
          </span>
        </div>

        {/* Card Frame */}
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2px] bg-transparent">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
            className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]"
            priority
          />
        </div>
      </div>
    );
  }

  if (variant === "branding") {
    return (
      <div className={`relative overflow-hidden rounded-[2px] border border-line/40 bg-surface shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] ${className}`}>
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 55vw, 42vw"
            className="object-cover"
            priority
          />

          {/* Bottom Left Overlay */}
          <div className="absolute bottom-5 left-5 z-20 text-white">
            <span className="block font-mono text-[11px] font-medium tracking-widest text-white/80">
              {number}
            </span>
            <span className="block my-1.5 h-px w-6 bg-white/60" />
            <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none text-white drop-shadow-sm">
              {title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "packaging") {
    return (
      <div className={`relative overflow-hidden rounded-[2px] border border-line/40 bg-surface shadow-[0_18px_40px_-12px_rgba(0,0,0,0.15)] ${className}`}>
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
            className="object-cover"
            priority
          />

          {/* Bottom Left Title */}
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {title}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Print Design
  return (
    <div className={`relative overflow-hidden rounded-[2px] border border-line/40 bg-surface shadow-[0_22px_45px_-12px_rgba(0,0,0,0.2)] ${className}`}>
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
          className="object-cover"
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
      </div>
    </div>
  );
}
