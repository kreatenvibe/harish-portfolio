import Image from "next/image";
import type { IProject, IProjectSection, IMedia } from "@/database";

type SectionWithMedia = IProjectSection & { media: IMedia[] };

function MediaBlock({ item }: { item: IMedia }) {
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

  if (item.type === "pdf" || item.type === "other") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-sm border border-foreground/5 bg-surface py-16 font-sans text-sm font-semibold text-accent hover:underline"
      >
        {item.title || (item.type === "pdf" ? "View PDF" : "View file")}
      </a>
    );
  }

  return (
    <Image
      src={item.url}
      alt={item.altText || item.title || ""}
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
  sections,
}: {
  project: IProject;
  sections: SectionWithMedia[];
}) {
  const eyebrow = project.client || project.tags?.[0];

  return (
    <article className="py-16 lg:py-24 border-b border-foreground/20 last:border-b-0">
      {/* Newspaper Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 border-b-8 border-foreground pb-8">
          <div className="flex-1">
            {eyebrow && (
              <p className="font-sans text-sm md:text-base font-bold uppercase tracking-[0.2em] text-accent mb-3">
                {eyebrow}
              </p>
            )}
            <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase">
              {project.title}
            </h2>
          </div>
        </div>
      </header>

      {/* Hero cover image */}
      {project.coverImage?.url && (
        <div className="mb-16 mx-auto max-w-5xl">
          <div className="rounded-lg overflow-hidden border-2 border-foreground/5 bg-surface">
            <Image
              src={project.coverImage.url}
              alt={project.title}
              width={1600}
              height={1000}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="max-w-3xl mx-auto mb-20 bg-surface p-8 md:p-10 rounded-sm border-t-4 border-foreground">
          <div className="font-sans text-lg leading-relaxed text-muted space-y-4">
            {project.description.split("\n").map((para, idx) =>
              para.trim() ? <p key={idx}>{para}</p> : null
            )}
          </div>
        </div>
      )}

      {/* Dynamic sections, each with its own media */}
      {sections.map((section) => (
        <div key={String(section._id)} className="mb-20 max-w-7xl mx-auto">
          <h3 className="font-heading text-2xl font-bold uppercase tracking-wide mb-2">
            {section.title}
          </h3>
          {section.description && (
            <p className="font-sans text-base text-muted mb-6 max-w-2xl">
              {section.description}
            </p>
          )}
          {section.media.length > 0 && (
            <div className="columns-1 lg:columns-2 gap-8 space-y-8">
              {section.media.map((item) => (
                <div
                  key={String(item._id)}
                  className="break-inside-avoid rounded-lg overflow-hidden border border-foreground/5 bg-surface"
                >
                  <MediaBlock item={item} />
                  {item.caption && (
                    <p className="p-3 font-sans text-sm text-muted">{item.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </article>
  );
}
