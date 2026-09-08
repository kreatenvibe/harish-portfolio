import { getLeads, deleteLead } from "@/lib/actions/lead.action";
import { formatDate } from "@/lib/utils";
import LeadReadToggle from "@/components/admin/LeadReadToggle";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const metadata = {
  title: "Leads",
};

const FIELDS: { key: "businessDescription" | "improvement" | "currentTools" | "whatToBuild" | "anythingElse"; label: string }[] = [
  { key: "businessDescription", label: "What their business does" },
  { key: "improvement", label: "What they're trying to improve" },
  { key: "currentTools", label: "Current tools / processes" },
  { key: "whatToBuild", label: "What they want to build" },
  { key: "anythingElse", label: "Anything else" },
];

export default async function AdminLeadsPage() {
  const result = await getLeads();
  const leads = result.data ?? [];
  const unreadCount = leads.filter((lead) => !lead.read).length;

  return (
    <div>
      <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
        Leads
      </h1>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
        {leads.length} submission{leads.length === 1 ? "" : "s"} ·{" "}
        {unreadCount} unread
      </p>

      <div className="mt-8 space-y-4">
        {leads.length === 0 ? (
          <p className="py-12 text-center font-sans text-sm text-muted">
            No leads yet.
          </p>
        ) : (
          leads.map((lead) => (
            <div
              key={String(lead._id)}
              className={`rounded-lg border p-6 transition-colors ${
                lead.read
                  ? "border-line bg-surface/40"
                  : "border-white/30 bg-surface"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-base font-semibold text-foreground">
                    {lead.name}
                    {lead.business && (
                      <span className="ml-2 font-sans text-xs font-normal text-muted">
                        · {lead.business}
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-mono text-xs text-foreground/80 hover:text-white hover:underline"
                  >
                    {lead.email}
                  </a>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    {formatDate(lead.createdAt!)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <LeadReadToggle id={String(lead._id)} read={lead.read} />
                  <AdminDeleteButton
                    action={async () => {
                      "use server";
                      return deleteLead({ id: String(lead._id) });
                    }}
                    confirmMessage={`Delete the lead from "${lead.name}"? This cannot be undone.`}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-4 border-t border-line pt-5">
                {FIELDS.map(
                  ({ key, label }) =>
                    lead[key] && (
                      <div key={key}>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                          {label}
                        </p>
                        <p className="mt-1 font-sans text-sm leading-relaxed text-foreground">
                          {lead[key]}
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
