"use client";

import { useId, useState } from "react";
import { Plus } from "@phosphor-icons/react";

type Faq = {
  question: string;
  answer: string;
};

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-foreground/8 border-t border-b border-foreground/8">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={faq.question}>
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="grid w-full grid-cols-[2.5rem_1fr_2rem] items-start gap-x-5 py-7 text-left hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2"
              >
                <span className="pt-1 text-sm font-semibold text-muted font-mono">
                  0{index + 1}
                </span>

                <span className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {faq.question}
                </span>

                <span
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  <Plus weight="light" aria-hidden className="h-4 w-4" />
                </span>
              </button>
            </h3>

            {isOpen ? (
              <div id={panelId} role="region" aria-labelledby={buttonId}>
                <p className="max-w-2xl pb-8 pl-13 text-lg leading-8 text-muted">
                  {faq.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
