"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowsOutSimple,
  Play,
  FilePdf,
} from "@phosphor-icons/react";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { getImageKitUrl } from "@/lib/imagekit";
import ProjectLightbox from "@/components/portfolio/ProjectLightbox";
import type { IProject, IProjectSection, IMedia } from "@/database";

type SectionWithMedia = IProjectSection & { media: IMedia[] };

interface ProjectDetailProps {
  project: IProject;
  sections: SectionWithMedia[];
}

export default function ProjectDetail({
  project,
  sections,
}: ProjectDetailProps) {
  // Collect all image/media items in order across all sections for continuous lightbox navigation
  const allMediaItems = sections.flatMap((s) => s.media || []);
  const imageMediaItems = allMediaItems.filter((item) => item.type === "image" || !item.type);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const isFullscreenEnabled = project.enableFullscreenGallery !== false;

  const handleOpenLightbox = (mediaItem: IMedia) => {
    if (!isFullscreenEnabled) return;
    const idx = imageMediaItems.findIndex((m) => String(m._id) === String(mediaItem._id) || m.url === mediaItem.url);
    if (idx !== -1) {
      setActiveMediaIndex(idx);
      setLightboxOpen(true);
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <>
      <div className="space-y-16 lg:space-y-24">
        {sections.map((section, sIndex) => {
          const chapterNum = String(sIndex + 1).padStart(2, "0");

          return (
            <section
              key={String(section._id)}
              className="relative scroll-mt-28 space-y-8"
            >
              {/* Chapter Heading Frame */}
              <div className="relative rounded border border-line bg-surface p-6 sm:p-8 lg:p-10 space-y-3 shadow-xl">
                <span className="frame-corner-tl" aria-hidden="true" />
                <span className="frame-corner-tr" aria-hidden="true" />
                <TrackingPoint className="top-4 right-4" variant="cross" />

                <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-muted">
                  <span className="text-foreground font-semibold">
                    CHAPTER {chapterNum}
                  </span>
                  <span className="text-line">•</span>
                  <span>DELIVERABLE SEQUENCE</span>
                  {section.media?.length > 0 && (
                    <>
                      <span className="text-line">•</span>
                      <span>
                        {String(section.media.length).padStart(2, "0")} ASSETS
                      </span>
                    </>
                  )}
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="font-sans text-base sm:text-lg leading-relaxed text-muted max-w-4xl pt-1">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Responsive Bento / Masonry Grid preserving natural image ratios */}
              {section.media.length > 0 && (
                <div className="columns-1 sm:columns-2 xl:columns-3 2xl:columns-3 gap-6 lg:gap-8">
                  {section.media.map((item) => {
                    const isImage = !item.type || item.type === "image";

                    // 1. VIDEO DELIVERABLE BLOCK
                    if (item.type === "video") {
                      return (
                        <div
                          key={String(item._id)}
                          className="break-inside-avoid mb-6 lg:mb-8 space-y-2"
                        >
                          <div className="relative overflow-hidden rounded border border-line bg-black shadow-2xl">
                            <span className="frame-corner-tl" aria-hidden="true" />
                            <span className="frame-corner-tr" aria-hidden="true" />
                            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-foreground backdrop-blur-xs">
                              <Play size={10} weight="fill" className="text-emerald-400" />
                              <span>VIDEO ASSET</span>
                            </div>
                            <video
                              src={item.url}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-auto block"
                            />
                          </div>
                          {(item.caption || item.title) && (
                            <p className="px-2 font-mono text-[10px] sm:text-[11px] text-muted leading-relaxed uppercase tracking-wider">
                              {`// ${item.caption || item.title}`}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // 2. DOCUMENT / PDF SPECIFICATION BLOCK
                    if (item.type === "pdf" || item.type === "other") {
                      return (
                        <div
                          key={String(item._id)}
                          className="break-inside-avoid mb-6 lg:mb-8 space-y-2"
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-between rounded border border-line bg-surface p-6 transition-all duration-300 hover:border-white/40 shadow-xl"
                          >
                            <span className="frame-corner-tl" aria-hidden="true" />
                            <div className="flex items-center gap-4 min-w-0 pr-2">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-line bg-[#161619] text-foreground transition-colors group-hover:border-white/40">
                                <FilePdf size={22} weight="duotone" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wide text-foreground block truncate">
                                  {item.title ||
                                    (item.type === "pdf"
                                      ? "Document Specification PDF"
                                      : "Project Asset")}
                                </span>
                                <span className="block font-mono text-[9px] tracking-wider text-muted uppercase mt-0.5">
                                  OPEN ATTACHMENT
                                </span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1 font-mono text-xs font-bold uppercase text-foreground transition-transform duration-300 group-hover:translate-x-1">
                              <span>VIEW</span>
                              <ArrowUpRight size={13} weight="bold" />
                            </div>
                          </a>
                          {(item.caption || item.title) && (
                            <p className="px-2 font-mono text-[10px] sm:text-[11px] text-muted leading-relaxed uppercase tracking-wider">
                              {`// ${item.caption || item.title}`}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // 3. ARTWORK / VISUAL SHOWCASE PLATE (Natural Aspect Ratio)
                    return (
                      <div
                        key={String(item._id)}
                        className="break-inside-avoid mb-6 lg:mb-8 space-y-2"
                      >
                        <div
                          onClick={() => handleOpenLightbox(item)}
                          className={`group relative overflow-hidden rounded border border-line bg-surface shadow-2xl transition-all duration-300 ${
                            isFullscreenEnabled
                              ? "cursor-zoom-in hover:border-white/60 hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)]"
                              : ""
                          }`}
                        >
                          <span className="frame-corner-tl" aria-hidden="true" />
                          <span className="frame-corner-tr" aria-hidden="true" />
                          <span className="frame-corner-bl" aria-hidden="true" />
                          <span className="frame-corner-br" aria-hidden="true" />

                          {/* Full Natural Ratio Image */}
                          <img
                            src={getImageKitUrl(item.url, { width: 1400 })}
                            alt={item.altText || item.title || project.title}
                            loading="lazy"
                            className="w-full h-auto block object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                          />

                          {/* Hover Inspection HUD Overlay */}
                          {isFullscreenEnabled && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                              <div className="flex items-center gap-2 rounded border border-white/40 bg-black/80 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <ArrowsOutSimple size={14} weight="bold" />
                                <span>INSPECT FULLSCREEN</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Deliverable Caption & Identifier */}
                        {(item.caption || item.title) && (
                          <div className="flex items-center justify-between px-2 pt-0.5">
                            <p className="font-mono text-[10px] sm:text-[11px] text-muted leading-relaxed uppercase tracking-wider truncate">
                              {`// ${item.caption || item.title}`}
                            </p>
                            {isFullscreenEnabled && (
                              <span className="hidden sm:inline font-mono text-[9px] text-muted/60 uppercase shrink-0">
                                CLICK TO ZOOM
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreenEnabled && (
        <ProjectLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          items={imageMediaItems}
          currentIndex={activeMediaIndex}
          onSelectIndex={setActiveMediaIndex}
          projectTitle={project.title}
        />
      )}
    </>
  );
}
