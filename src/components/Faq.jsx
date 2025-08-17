import React from "react";
import { JsonLd } from "../seo/JsonLd";

export function Faq({ items }) {
  // items: [{q,a}]
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };
  return (
    <>
      <section className="prose max-w-none">
        <h2>Veelgestelde vragen</h2>
        <dl>
          {items.map(({ q, a }, idx) => (
            <div key={idx} className="mb-4">
              <dt className="font-semibold">{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <JsonLd data={data} />
    </>
  );
}
