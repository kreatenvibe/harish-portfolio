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
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Leads
      </h1>
      <p className="mt-2 font-sans text-sm text-muted">
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
              className={`rounded-xl border p-6 ${
                lead.read ? "border-foreground/10" : "border-accent/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-lg font-semibold text-foreground">
                    {lead.name}
                    {lead.business && (
                      <span className="ml-2 font-sans text-sm font-normal text-muted">
                        · {lead.business}
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-sans text-sm text-accent"
                  >
                    {lead.email}
                  </a>
                  <p className="mt-1 font-sans text-xs text-muted">
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

              <div className="mt-5 space-y-4 border-t border-foreground/10 pt-5">
                {FIELDS.map(
                  ({ key, label }) =>
                    lead[key] && (
                      <div key={key}>
                        <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                          {label}
                        </p>
                        <p className="mt-1 font-sans text-sm text-foreground">
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
