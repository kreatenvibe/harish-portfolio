"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { getImageKitUrl } from "@/lib/imagekit";

interface MediaItem {
  url: string;
  fileId: string;
  type: "image" | "video";
}

export default function ProjectMediaCarousel({
  media,
  alt,
}: {
  media: MediaItem[];
  alt: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (media.length === 0) return null;

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setActive(index);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index !== active) setActive(index);
  };

  if (media.length === 1) {
    return (
      <div className="absolute inset-0">
        <MediaItem item={media[0]} alt={alt} />
      </div>
    );
  }

  return (
    <div className="group/carousel absolute inset-0">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
      >
        {media.map((item, i) => (
          <div key={item.fileId} className="relative h-full w-full shrink-0 snap-center">
            <MediaItem item={item} alt={`${alt} — ${i + 1} of ${media.length}`} />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => scrollToIndex(Math.max(active - 1, 0))}
        disabled={active === 0}
        aria-label="Previous media"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover/carousel:opacity-100 disabled:hidden"
      >
        <CaretLeft size={16} weight="bold" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex(Math.min(active + 1, media.length - 1))}
        disabled={active === media.length - 1}
        aria-label="Next media"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover/carousel:opacity-100 disabled:hidden"
      >
        <CaretRight size={16} weight="bold" />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
        {media.map((item, i) => (
          <button
            key={item.fileId}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to media ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-200 ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

function MediaItem({ item, alt }: { item: MediaItem; alt: string }) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={getImageKitUrl(item.url)}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover"
      unoptimized
    />
  );
}
