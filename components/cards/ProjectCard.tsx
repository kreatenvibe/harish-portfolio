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
      className="group block relative w-full overflow-hidden rounded-xl bg-muted/20 border border-foreground/10"
    >
      <div className="aspect-[4/3] w-full md:aspect-[16/9]">
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
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300" />

      {/* Title block */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
        <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent mb-2 opacity-90 translate-y-2 transition-all duration-300 group-hover:translate-y-0">
          {project.label}
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-none tracking-tight translate-y-4 transition-all duration-300 group-hover:translate-y-0">
          {project.title}
        </h2>
      </div>
      
      {/* Number Badge */}
      <div className="absolute top-6 right-6">
        <span className="font-heading text-2xl font-black text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}
