"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const backgrounds = {
  crm: {
    stage: "bg-neutral-50",
    app: "bg-white",
    topbar: "bg-white",
    sidebar: "bg-white",
  },
  inventory: {
    stage: "bg-stone-100",
    app: "bg-white",
    topbar: "bg-white",
    sidebar: "bg-white",
  },
  portal: {
    stage: "bg-zinc-100",
    app: "bg-white",
    topbar: "bg-white",
    sidebar: "bg-white",
  },
  billing: {
    stage: "bg-red-50",
    app: "bg-white",
    topbar: "bg-white",
    sidebar: "bg-white",
  },
  internal: {
    stage: "bg-neutral-100",
    app: "bg-white",
    topbar: "bg-white",
    sidebar: "bg-white",
  },
  automation: {
    stage: "bg-neutral-950",
    app: "bg-white",
    topbar: "bg-neutral-950",
    sidebar: "bg-neutral-900",
  },
};

const transition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const,
};

const screens = [
  {
    id: "crm",
    title: "CRM Dashboard",
    content: (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">Active Deals</div>
            <div className="mt-1 text-xl font-semibold text-black">124</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">New Leads</div>
            <div className="mt-1 text-xl font-semibold text-black">38</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">Win Rate</div>
            <div className="mt-1 text-xl font-semibold text-black">62%</div>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-4 text-sm font-semibold text-black">Recent Pipeline</div>
          <div className="p-0">
            {[
              { name: "Acme Corp Expansion", stage: "Proposal", amount: "$45,000" },
              { name: "Globex Initial Consult", stage: "Discovery", amount: "$12,000" },
              { name: "Initech Enterprise", stage: "Negotiation", amount: "$89,000" },
            ].map((deal, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-50 px-6 py-4 last:border-0">
                <div>
                  <div className="text-sm font-medium text-black">{deal.name}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">{deal.stage}</div>
                </div>
                <div className="text-sm font-medium text-black">{deal.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "inventory",
    title: "Inventory Management",
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-black">Stock Levels</div>
          <button className="rounded bg-accent hover:bg-accent/90 transition-colors px-3 py-1.5 text-xs font-semibold text-white">Reorder Stock</button>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50">
              <tr>
                <th className="px-6 py-4 font-medium text-neutral-500">SKU</th>
                <th className="px-6 py-4 font-medium text-neutral-500">Product</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">Stock</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {[
                { sku: "PRD-001", name: "Industrial Widget A", stock: 1240, status: "Healthy" },
                { sku: "PRD-045", name: "Assembly Component", stock: 12, status: "Low Stock" },
                { sku: "PRD-102", name: "Replacement Part C", stock: 0, status: "Out" },
              ].map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{item.sku}</td>
                  <td className="px-6 py-4 font-medium text-black">{item.name}</td>
                  <td className="px-6 py-4 text-right font-medium text-black">{item.stock}</td>
                  <td className="px-6 py-4 text-right text-xs">
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-medium ${item.status === 'Healthy' ? 'bg-neutral-100 text-black' : item.status === 'Low Stock' ? 'bg-red-50 text-accent' : 'bg-accent hover:bg-accent/90 transition-colors/10 text-accent'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "portal",
    title: "Customer Portal",
    content: (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl bg-white p-5 shadow-sm border-l-2 border-accent">
          <div className="text-sm font-medium text-black">Welcome back, Sarah.</div>
          <div className="mt-1 text-xs text-neutral-500">You have 2 pending actions required for your account.</div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Active Subscriptions</div>
            <div className="mt-3 text-xl font-semibold text-black">Pro Tier</div>
            <div className="mt-1 text-xs text-neutral-500">Renews Oct 12, 2026</div>
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Support Tickets</div>
              <div className="mt-3 text-xl font-semibold text-black">1 Open</div>
            </div>
            <div className="mt-4 text-xs font-semibold text-accent">View ticket →</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "billing",
    title: "Billing System",
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
          <div>
            <div className="text-xs font-medium text-neutral-500">Monthly Revenue (MRR)</div>
            <div className="mt-1 text-2xl font-bold text-black">$142,500</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-neutral-500">Overdue Invoices</div>
            <div className="mt-1 text-lg font-semibold text-accent">$8,400</div>
          </div>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase text-neutral-500">Recent Invoices</div>
          <div className="rounded-xl bg-white shadow-sm">
            {[
              { id: "INV-2026-081", client: "Acme Corp", amount: "$4,500.00", status: "Paid" },
              { id: "INV-2026-082", client: "Globex Ltd", amount: "$1,200.00", status: "Pending" },
              { id: "INV-2026-083", client: "Initech", amount: "$8,400.00", status: "Overdue" },
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between border-b border-neutral-50 px-6 py-4 last:border-0">
                <div>
                  <div className="text-sm font-medium text-black">{inv.client}</div>
                  <div className="mt-0.5 font-mono text-xs text-neutral-500">{inv.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-black">{inv.amount}</div>
                  <div className={`mt-0.5 text-xs font-medium ${inv.status === 'Paid' ? 'text-neutral-400' : inv.status === 'Overdue' ? 'text-accent' : 'text-neutral-500'}`}>
                    {inv.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "internal",
    title: "Internal Dashboard",
    content: (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">System Uptime</div>
            <div className="mt-1 text-xl font-bold text-black">99.99%</div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-xs font-medium text-neutral-500">Active Users</div>
            <div className="mt-1 text-xl font-bold text-black">1,492</div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 text-sm font-semibold text-black">Weekly Processing Volume</div>
          <div className="flex h-24 items-end gap-3">
            {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
              <div key={i} className="relative w-full rounded-t bg-neutral-100">
                <div
                  className="absolute bottom-0 w-full rounded-t bg-linear-to-t from-accent to-black"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-neutral-400">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "automation",
    title: "AI Automation",
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5 rounded-xl bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent hover:bg-accent/90 transition-colors/10 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div>
            <div className="text-sm font-medium text-black">Invoice Processing</div>
            <div className="mt-0.5 text-xs text-neutral-500">Running smoothly. 342 processed today.</div>
          </div>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase text-neutral-500">Recent Executions</div>
          <div className="space-y-3">
            {[
              { task: "Extract data from vendor PDF", time: "2m ago" },
              { task: "Categorize inbound support ticket", time: "15m ago" },
              { task: "Sync CRM contacts to Mailchimp", time: "1h ago" },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-t from-accent to-black" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-black">{task.task}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">{task.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export function SoftwareShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startTimer = () => {
      timeoutId = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % screens.length);
      }, 2500);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
      } else {
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startTimer();

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentIndex]);

  const activeScreen = screens[currentIndex];
  const theme = backgrounds[activeScreen.id as keyof typeof backgrounds];


  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        backgroundColor:
          activeScreen.id === "automation"
            ? "#ECECEC" // softer than pure black
            : activeScreen.id === "billing"
              ? "#FFF6F4" // warm red tint
              : activeScreen.id === "inventory"
                ? "#F6F5F2" // warm stone
                : activeScreen.id === "portal"
                  ? "#F5F6FA" // cool neutral
                  : activeScreen.id === "internal"
                    ? "#F4F4F4" // soft gray
                    : "#F7F7F7" // CRM
      }}
      initial={{
        opacity: 0,
        scale: 0.97,
        y: 12
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full rounded-[40px] p-5 sm:p-8 lg:p-10 overflow-hidden"
    >
      <motion.div
        layout
        className="overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.12)]"
      >
        {/* Top Bar */}

        <div
          className={`flex h-14 items-center justify-between border-b border-neutral-100 px-6 transition-colors duration-600 ${theme.topbar}`}
        >
          <div className="flex items-center gap-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              K
            </div>
            <div
              className={`h-4 w-28 rounded ${activeScreen.id === "automation"
                ? "bg-neutral-700"
                : "bg-neutral-100"
                }`}
            />
          </div>

          <div className="flex items-center gap-5">
            <div
              className={`hidden h-7 w-40 rounded sm:block ${activeScreen.id === "automation"
                ? "bg-neutral-800"
                : "bg-neutral-100"
                }`}
            />
            <div
              className={`h-8 w-8 rounded-full ${activeScreen.id === "automation"
                ? "bg-neutral-700"
                : "bg-neutral-100"
                }`}
            />
          </div>
        </div>

        {/* Body */}

        <div className="flex min-h-140">
          {/* Sidebar */}

          <div
            className={`hidden w-56 shrink-0 border-r border-neutral-100 p-5 transition-colors duration-600 lg:block ${theme.sidebar}`}
          >
            <div
              className={`mb-8 h-4 w-20 rounded ${activeScreen.id === "automation"
                ? "bg-neutral-700"
                : "bg-neutral-100"
                }`}
            />

            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-10 rounded ${i === 0
                    ? "bg-accent"
                    : activeScreen.id === "automation"
                      ? "bg-neutral-800"
                      : "bg-neutral-100"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Main */}

          <div className="relative flex-1 overflow-hidden bg-neutral-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen.id}
                initial={{
                  opacity: prefersReducedMotion ? 1 : 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: prefersReducedMotion ? 0 : 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                }}
                className="absolute inset-0 p-8 lg:p-10"
              >
                <h2 className="mb-7 text-2xl font-bold text-black">
                  {activeScreen.title}
                </h2>

                <div className="h-full overflow-hidden">
                  {activeScreen.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
