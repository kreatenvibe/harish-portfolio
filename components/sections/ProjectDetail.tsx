import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { getImageKitUrl } from "@/lib/imagekit";
import type { IProject, IProjectSection, IMedia } from "@/database";

type SectionWithMedia = IProjectSection & { media: IMedia[] };

function MediaBlock({ item }: { item: IMedia }) {
  if (item.type === "video") {
    return (
      <div className="relative overflow-hidden rounded-lg border border-line bg-black shadow-2xl">
        <span className="frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner-tr" aria-hidden="true" />
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
        className="group relative flex items-center justify-between rounded border border-line bg-surface p-6 transition-all duration-300 hover:border-white/40"
      >
        <span className="frame-corner-tl" aria-hidden="true" />
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-line bg-[#161619] text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <span className="font-heading text-xl font-bold uppercase tracking-wide text-foreground">
              {item.title || (item.type === "pdf" ? "Document Specification PDF" : "Project Asset")}
            </span>
            <span className="block font-mono text-[9px] tracking-wider text-muted uppercase mt-0.5">
              OPEN ASSET ATTACHMENT
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs font-bold uppercase text-foreground transition-transform duration-300 group-hover:translate-x-1">
          <span>VIEW</span>
          <ArrowUpRight size={13} weight="bold" />
        </div>
      </a>
    );
  }

  return (
    <div className="relative overflow-hidden rounded border border-line bg-surface shadow-2xl">
      <span className="frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner-tr" aria-hidden="true" />
      <span className="frame-corner-bl" aria-hidden="true" />
      <span className="frame-corner-br" aria-hidden="true" />

      <Image
        src={getImageKitUrl(item.url)}
        alt={item.altText || item.title || ""}
        width={1400}
        height={900}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  );
}

export default function ProjectDetail({
  sections,
}: {
  project: IProject;
  sections: SectionWithMedia[];
}) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-20 lg:space-y-28">
      {sections.map((section, sIndex) => {
        const chapterNum = String(sIndex + 1).padStart(2, "0");

        return (
          <section
            key={String(section._id)}
            className="relative scroll-mt-28 space-y-8"
          >
            {/* Chapter Heading Frame */}
            <div className="relative rounded border border-line bg-surface p-6 sm:p-8 space-y-3">
              <span className="frame-corner-tl" aria-hidden="true" />
              <span className="frame-corner-tr" aria-hidden="true" />
              <TrackingPoint className="top-4 right-4" variant="cross" />

              <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-muted">
                <span className="text-foreground font-semibold">CHAPTER {chapterNum}</span>
                <span className="text-line">•</span>
                <span>DELIVERABLE SEQUENCE</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                {section.title}
              </h2>

              {section.description && (
                <p className="font-sans text-base sm:text-lg leading-relaxed text-muted max-w-3xl pt-1">
                  {section.description}
                </p>
              )}
            </div>

            {/* Section Media Grid */}
            {section.media.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                {section.media.map((item) => (
                  <div key={String(item._id)} className="space-y-3">
                    <MediaBlock item={item} />
                    {(item.caption || item.title) && (
                      <p className="px-2 font-mono text-[11px] text-muted leading-relaxed uppercase tracking-wider">
                        {`// ${item.caption || item.title}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
