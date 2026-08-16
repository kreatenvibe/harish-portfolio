import Link from "next/link";
import Image from "next/image";
import type { IProject } from "@/database";

export default function ProjectCard({
  project,
  index,
}: {
  project: IProject;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;

  return (
    <article className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
      {/* Project visual */}
      <div
        className={`relative flex min-h-[400px] items-center justify-center overflow-hidden bg-[#f4f4f2] ${
          reversed ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {project.coverImage?.url ? (
          <Image
            src={project.coverImage.url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-center">
            <span className="font-heading text-7xl font-bold text-accent/20">
              {number}
            </span>
            <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-muted">
              {project.label}
            </p>
          </div>
        )}
      </div>

      {/* Project information */}
      <div className={reversed ? "lg:order-1" : "lg:order-2"}>
        <span className="font-heading text-5xl font-bold text-accent">
          {number}
        </span>

        <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-accent">
          {project.label}
        </p>

        <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
          {project.title}
        </h2>

        <div className="mt-10 space-y-8">
          <div>
            <h3 className="font-heading text-xl font-semibold">
              The challenge
            </h3>
            <p className="mt-2 font-sans leading-7 text-muted">
              {project.challenge}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold">
              What we built
            </h3>
            <p className="mt-2 font-sans leading-7 text-muted">
              {project.whatWeBuilt}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold">
              How it works
            </h3>
            <p className="mt-2 font-sans leading-7 text-muted">
              {project.howItWorks}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold">
              The outcome
            </h3>
            <p className="mt-2 font-sans leading-7 text-muted">
              {project.outcome}
            </p>
          </div>
        </div>

        <Link
          href={project.liveUrl || "/#contact"}
          className="mt-10 inline-flex rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white"
          {...(project.liveUrl
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {project.liveUrl ? "Visit Live Site" : "Discuss Your Business Needs"}
        </Link>
      </div>
    </article>
  );
}
