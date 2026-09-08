import Link from "next/link";
import { Newspaper, Briefcase, Envelope } from "@phosphor-icons/react/dist/ssr";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { getProjects } from "@/lib/actions/project.action";
import { getLeads } from "@/lib/actions/lead.action";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const [blogRes, projectRes, leadsRes] = await Promise.all([
    getBlogPosts({ pageSize: 1 }),
    getProjects({ pageSize: 1 }),
    getLeads(),
  ]);

  const postCount = blogRes.data?.total ?? 0;
  const projectCount = projectRes.data?.total ?? 0;
  const leads = leadsRes.data ?? [];
  const unreadCount = leads.filter((lead) => !lead.read).length;

  const cards = [
    {
      label: "Blog Posts",
      value: postCount,
      href: "/admin/blog",
      icon: Newspaper,
    },
    {
      label: "Projects",
      value: projectCount,
      href: "/admin/work",
      icon: Briefcase,
    },
    {
      label: "Unread Leads",
      value: unreadCount,
      href: "/admin/leads",
      icon: Envelope,
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 font-sans text-sm text-muted">
        Overview of portfolio content and submissions.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-md border border-line bg-surface/50 p-6 transition-colors hover:border-white/40 hover:bg-surface"
            >
              <Icon size={22} className="text-foreground" />
              <p className="mt-4 font-heading text-4xl font-bold text-foreground">
                {card.value}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                {card.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
