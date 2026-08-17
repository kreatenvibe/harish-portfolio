import Link from "next/link";
import Image from "next/image";
import type { IProject } from "@/database";

type MediaItem = { url: string; fileId: string; type: "image" | "video" };

function MediaBlock({ item, alt }: { item: MediaItem; alt: string }) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto rounded-sm border border-foreground/5"
      />
    );
  }

  return (
    <Image
      src={item.url}
      alt={alt}
      width={1200}
      height={800}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="w-full h-auto rounded-sm border border-foreground/5"
      unoptimized
    />
  );
}

export default function ProjectDetail({
  project,
}: {
  project: IProject;
}) {
  const media = project.media ?? [];

  // Prioritize first video as hero, otherwise first image
  const videos = media.filter(m => m.type === "video");
  const images = media.filter(m => m.type === "image");
  const heroMedia = videos.length > 0 ? videos[0] : (images.length > 0 ? images[0] : null);
  const remainingMedia = media.filter(m => m !== heroMedia);

  const textBlocks = [
    { title: "The challenge", content: project.challenge },
    { title: "What we built", content: project.whatWeBuilt },
    { title: "How it works", content: project.howItWorks },
    { title: "The outcome", content: project.outcome },
  ];

  return (
    <article className="py-16 lg:py-24 border-b border-foreground/20 last:border-b-0">
      {/* Newspaper Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 border-b-8 border-foreground pb-8">
          <div className="flex-1">
            <p className="font-sans text-sm md:text-base font-bold uppercase tracking-[0.2em] text-accent mb-3">
              {project.label}
            </p>
            <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase">
              {project.title}
            </h2>
          </div>
        </div>
        
        {project.liveUrl && (
          <div className="mt-8 flex justify-end">
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b-2 border-accent pb-1 font-sans text-sm font-bold uppercase tracking-widest text-accent transition-colors hover:text-foreground hover:border-foreground"
            >
              See it live &rarr;
            </Link>
          </div>
        )}
      </header>

      {/* Hero Media (Video prominently at the top, contained width, scrollable if tall) */}
      {heroMedia && (
        <div className="mb-16 mx-auto max-w-5xl">
          <div className="rounded-lg overflow-y-auto overflow-x-hidden max-h-[70vh] border-2 border-foreground/5 no-scrollbar bg-[#f4f4f2]">
            <MediaBlock item={heroMedia} alt={`${project.title} featured`} />
          </div>
        </div>
      )}

      {/* Predictable Text Sections Below Cover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-7xl mx-auto">
        {textBlocks.map((textBlock, i) => (
          <div key={i} className="bg-[#f4f4f2] p-8 md:p-10 rounded-sm border-t-4 border-foreground">
            <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-6">
              {textBlock.title}
            </h3>
            <div className="font-sans text-lg leading-relaxed text-muted space-y-4">
              {textBlock.content.split("\n").map((para, idx) => (
                para.trim() ? <p key={idx}>{para}</p> : null
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Remaining Media at the bottom (Large formats) */}
      {remainingMedia.length > 0 && (
        <div className="columns-1 lg:columns-2 gap-8 space-y-8 max-w-7xl mx-auto">
          {remainingMedia.map((item, i) => (
            <div key={item.fileId} className="break-inside-avoid rounded-lg overflow-hidden border border-foreground/5 bg-[#f4f4f2]">
              <MediaBlock item={item} alt={`${project.title} media ${i + 2}`} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
