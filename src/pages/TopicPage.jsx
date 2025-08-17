// Example page showing how to use the SEO helpers
import React from "react";
import { SeoHead } from "../seo/SeoHead";
import { JsonLd } from "../seo/JsonLd";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { OutLink } from "../components/OutLink";
import { Faq } from "../components/Faq";
import { Disclosure } from "../components/Disclosure";
import { trackOutbound } from "../utils/analytics";

export default function TopicPage({ topic = "tv", query = "55 inch" }) {
  const title = `Beste ${topic}: kieshulp (${query}) | HelpKiezen`;
  const desc = `Snel vergelijken en door naar bol.com met de juiste filters voor ${topic}.`;
  const url = `https://helpkiezen.nl/${topic}/${encodeURIComponent(query)}`;

  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Budget", "url": url + "#budget"},
      {"@type": "ListItem", "position": 2, "name": "Middenklasse", "url": url + "#mid"},
      {"@type": "ListItem", "position": 3, "name": "Premium", "url": url + "#premium"}
    ]
  };

  const faq = [
    { q: "Past 55 inch in mijn woonkamer?", a: "Meet kijkafstand en breedte van je meubel. Richtlijn: 2.1× schermdiagonaal." },
    { q: "Wat is het verschil tussen 50 en 55 inch?", a: "55 inch biedt ~10% meer schermoppervlak; vaak iets hogere prijs." }
  ];

  const bolHref = `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(topic + ' ' + query)}`;

  return (
    <div className="container mx-auto p-4">
      <SeoHead title={title} description={desc} url={url} canonical={url} />
      <JsonLd data={itemListData} />
      <Breadcrumbs items={[
        { name: "Home", to: "/" },
        { name: topic, to: `/${topic}` },
        { name: query }
      ]} />
      <header className="prose max-w-none mb-6">
        <h1>{title}</h1>
        <p>{desc}</p>
      </header>
      <section className="prose max-w-none">
        <h2>Snelle keuzehulp</h2>
        <ul>
          <li id="budget">Budget: prima instap voor kleine kamers.</li>
          <li id="mid">Middenklasse: betere panelen en HDR.</li>
          <li id="premium">Premium: top contrast en helderheid.</li>
        </ul>
        <p className="mt-4">
          <OutLink href={bolHref} onClick={() => trackOutbound(`${topic}:${query}`)}>
            Bekijk gefilterde resultaten bij bol.com
          </OutLink>
        </p>
      </section>
      <Disclosure />
      <Faq items={faq} />
    </div>
  );
}
