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
    <div className="mt-12 border-t border-foreground/10">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={faq.question} className="border-b border-foreground/10">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="grid w-full grid-cols-[2rem_1fr_1.5rem] items-start gap-x-5 py-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <span className="pt-1 font-sans text-sm font-semibold text-accent">
                  0{index + 1}
                </span>

                <span className="font-heading text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                  {faq.question}
                </span>

                <Plus
                  weight="bold"
                  aria-hidden
                  className={`mt-1.5 h-5 w-5 shrink-0 text-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pl-[3.25rem] font-sans text-lg leading-8 text-muted">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
