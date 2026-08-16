import Link from "next/link";
import { getProjects } from "@/lib/actions/project.action";
import ProjectCard from "@/components/cards/ProjectCard";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const result = await getProjects({ pageSize: 100 });
  const projects = result.data?.projects ?? [];

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Work
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Practical software for real business workflows.
          </h1>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            Every project starts with a business problem. We turn complex
            processes into reliable digital systems that are easier to manage,
            easier to use, and ready to grow.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        {projects.length === 0 ? (
          <p className="font-sans text-lg text-muted">
            Projects are coming soon.
          </p>
        ) : (
          <div className="space-y-24 lg:space-y-40">
            {projects.map((project, index) => (
              <ProjectCard
                key={String(project._id)}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Start a Project
            </p>

            <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Have a business problem worth solving?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
              Tell us what is taking too much time, creating friction, or
              holding your team back. We can help you work out the right
              digital solution.
            </p>

            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white"
            >
              Discuss Your Business Needs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
