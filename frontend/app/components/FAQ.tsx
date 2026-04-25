"use client";
import { useState } from "react";
import { FAQ_DATA } from "@/lib/faq-data";
import type { FAQItem } from "@/lib/faq-data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-6xl mx-auto" id="faq">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {FAQ_DATA.map((item, index) => (
          <div
            key={index}
            className="glass-card overflow-hidden transition-all duration-300"
            style={{
              borderColor:
                openIndex === index
                  ? "var(--accent-border)"
                  : undefined,
            }}
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full text-left p-5 flex items-center justify-between gap-4"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
              aria-expanded={openIndex === index}
              id={`faq-question-${index}`}
            >
              <span>{item.question}</span>
              <span
                style={{
                  transform:
                    openIndex === index
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  flexShrink: 0,
                  fontSize: "12px",
                  color: "var(--accent)",
                }}
              >
                ▼
              </span>
            </button>
            <div
              style={{
                maxHeight: openIndex === index ? "500px" : "0px",
                opacity: openIndex === index ? 1 : 0,
                overflow: "hidden",
                transition:
                  "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
              }}
            >
              <p
                style={{
                  padding: "0 20px 20px",
                  margin: 0,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
