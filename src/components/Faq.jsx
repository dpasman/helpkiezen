import React, { useMemo } from "react"
import { JsonLd } from "../seo/JsonLd"

export function Faq({ items = [] }) {
  const faqLd = useMemo(() => {
    if (!items.length) return null
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      }))
    }
  }, [items])

  if (!items.length) return null

  // Belangrijk:
  // - `-mt-6 md:-mt-8` trekt de FAQ omhoog, ook als de parent `space-y-*` gebruikt.
  // - `mt-4` zorgt dat er toch een kleine, nette ruimte blijft (netto blijft het strak).
  return (
    <section id="faq" className="-mt-10 md:-mt-10 mt-4">
      {faqLd && <JsonLd data={faqLd} />}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Veelgestelde vragen</h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <details key={idx} className="group border border-black/10 rounded-xl bg-white p-4">
            <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
              <span>{item.q}</span>
              <span className="ml-4 rounded-full border border-black/20 p-1 text-xs transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3 text-black/80 leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
