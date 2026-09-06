import Image from "next/image";
import type { IProject, IProjectSection, IMedia } from "@/database";

type SectionWithMedia = IProjectSection & { media: IMedia[] };

function MediaBlock({ item }: { item: IMedia }) {
  if (item.type === "video") {
    return (
      <div className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover">
        <video
          src={item.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-auto"
        />
      </div>
    );
  }

  if (item.type === "pdf" || item.type === "other") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between rounded-[var(--radius-card)] bg-surface p-8 shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <span className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
              {item.title || (item.type === "pdf" ? "Document PDF" : "Project Asset")}
            </span>
            <span className="block font-mono text-[10px] tracking-wider text-muted uppercase mt-0.5">
              Click to view asset
            </span>
          </div>
        </div>
        <span className="font-sans text-xs font-bold uppercase text-accent transition-transform duration-300 group-hover:translate-x-1">
          Open →
        </span>
      </a>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover">
      <Image
        src={item.url}
        alt={item.altText || item.title || ""}
        width={1400}
        height={900}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  );
}

export default function ProjectDetail({
  project,
  sections,
}: {
  project: IProject;
  sections: SectionWithMedia[];
}) {
  return (
    <div className="space-y-24 lg:space-y-32">
      {/* Editorial Sections with Media */}
      {sections.map((section, sIndex) => (
        <section
          key={String(section._id)}
          className="relative scroll-mt-24 space-y-10"
        >
          {/* Section Header */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold tracking-widest text-accent">
                {String(sIndex + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-6 bg-accent" />
            </div>

            <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {section.title}
            </h2>

            {section.description && (
              <p className="font-sans text-base leading-relaxed text-muted sm:text-lg">
                {section.description}
              </p>
            )}
          </div>

          {/* Section Media Grid with 12px Card Elevation */}
          {section.media.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
              {section.media.map((item) => (
                <div key={String(item._id)} className="space-y-3">
                  <MediaBlock item={item} />
                  {item.caption && (
                    <p className="px-2 font-sans text-xs text-muted leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
