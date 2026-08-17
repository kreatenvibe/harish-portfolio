import Link from "next/link";
import Image from "next/image";
import type { IProject } from "@/database";

type MediaItem = { url: string; fileId: string; type: "image" | "video" };

export default function ProjectCard({
  project,
  index,
}: {
  project: IProject;
  index: number;
}) {
  const media = project.media ?? [];

  // Prioritize first video as hero, otherwise first image
  const videos = media.filter(m => m.type === "video");
  const images = media.filter(m => m.type === "image");
  const heroMedia = videos.length > 0 ? videos[0] : (images.length > 0 ? images[0] : null);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block w-full"
    >
      <div className="relative aspect-4/3 w-full md:aspect-video overflow-hidden rounded-xl bg-muted/10 border border-foreground/10">
        {heroMedia ? (
          heroMedia.type === "video" ? (
            <video
              src={heroMedia.url}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <Image
              src={heroMedia.url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center bg-[#f4f4f2]">
            <span className="font-heading text-2xl font-bold text-accent/50 uppercase tracking-widest">
              {project.label}
            </span>
          </div>
        )}

        {/* Number Badge */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-foreground/10">
          <span className="font-heading text-sm font-bold text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Text block */}
      <div className="mt-6 flex flex-col">
        <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent mb-2">
          {project.label}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {project.title}
          </h2>
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-muted/5 text-foreground transition-all duration-300 group-hover:-rotate-45 group-hover:bg-foreground group-hover:text-background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
