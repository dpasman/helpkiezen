// src/pages/Vaatwassers.jsx
import React, { useState, useMemo } from "react"
import HelpKiezenWizard from "../components/HelpKiezenWizard.jsx"
import { SeoHead } from "../seo/SeoHead"
import { JsonLd } from "../seo/JsonLd"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { Faq } from "../components/Faq"
import { Disclosure } from "../components/Disclosure"

// --- Internal mapping only (no external domains) ---
const CATEGORY_PATH = {
  integrated: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  'semi-integrated': 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  undercounter: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  freestanding: 'https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/18293/',
};

// Price buckets → adjust freely
const PRICE_BUCKETS = {
  none: null,
  budget: [0, 400],
  mid: [400, 800],
  premium: [800, 9999],
}

// Build INTERNAL URL with filters (noise/price)
function buildInternalUrl(selections) {
  const category = selections.category
  const base = CATEGORY_PATH[category] || CATEGORY_PATH.freestanding
  const params = new URLSearchParams()

  if (selections.noise && selections.noise !== "none") {
    params.set("noise", selections.noise)
  }
  const bucket = PRICE_BUCKETS[selections.price || "none"]
  if (bucket) {
    params.set("price", `${bucket[0]}-${bucket[1]}`)
  }

  const q = params.toString()
  return q ? `${base}?${q}` : base
}

// Steps (mode → category → noise/price)
function getDishwasherSteps(selections) {
  const mode = selections.mode || null

  const base = [
    {
      key: "mode",
      title: "Hoe wil je kiezen?",
      subtitle: "Kies standaard of geavanceerd.",
      options: [
        { id: "standard", label: "Standaard", caption: "Snel en simpel", tint: "from-emerald-200 to-teal-300" },
        { id: "advanced", label: "Geavanceerd", caption: "Meer filters", tint: "from-sky-200 to-indigo-300" },
      ],
    },
  ]

  const categoryStep = {
    key: "category",
    title: "Type vaatwasser",
    subtitle: "Kies je opstelling.",
    options: [
      { id: "integrated", label: "Inbouw – volledig geïntegreerd", caption: "Verborgen bediening" },
      { id: "semi-integrated", label: "Inbouw – half geïntegreerd", caption: "Zichtbaar paneel" },
      { id: "undercounter", label: "Inbouw – onderbouw", caption: "Zonder front, onder blad" },
      { id: "freestanding", label: "Vrijstaand", caption: "Los te plaatsen" },
    ],
  }

  const commonNoisePrice = [
    {
      key: "noise",
      title: "Geluidsniveau",
      subtitle: "Optioneel.",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "41-42", label: "41–42 dB" },
        { id: "43-45", label: "43–45 dB" },
        { id: "46-plus", label: "46+ dB" },
      ],
    },
    {
      key: "price",
      title: "Prijs",
      subtitle: "Wordt gebruikt in je resultaat.",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "budget", label: "Budget", caption: "Tot ± €400" },
        { id: "mid", label: "Midden", caption: "€400–€800" },
        { id: "premium", label: "Premium", caption: "€800+" },
      ],
    },
  ]

  if (mode === "standard") return [...base, categoryStep, ...commonNoisePrice]
  if (mode === "advanced") return [...base, categoryStep, ...commonNoisePrice]
  return base
}

// --- SEO copy & JSON-LD ---
const PAGE_URL = "https://helpkiezen.nl/vaatwassers"
const PAGE_TITLE = "Vaatwassers kiezen – snel de juiste keuze maken | HelpKiezen"
const PAGE_DESC =
  "Kies snel de juiste vaatwasser: inbouw of vrijstaand, 45 of 60 cm, stil en zuinig. Lees waar je op moet letten en maak eenvoudig je keuze."

const itemListData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inbouw", url: PAGE_URL + "#inbouw" },
    { "@type": "ListItem", position: 2, name: "Vrijstaand", url: PAGE_URL + "#vrijstaand" },
    { "@type": "ListItem", position: 3, name: "Smal (45 cm)", url: PAGE_URL + "#45cm" },
    { "@type": "ListItem", position: 4, name: "Standaard (60 cm)", url: PAGE_URL + "#60cm" },
    { "@type": "ListItem", position: 5, name: "Stil", url: PAGE_URL + "#stil" },
  ],
}

const faqItems = [
  { q: "Wat is het verschil tussen een inbouw en een vrijstaande vaatwasser?",
    a: "Een inbouwvaatwasser wordt weggewerkt achter een keukenfront en sluit aan op het keukenontwerp. Een vrijstaande vaatwasser heeft een eigen omkasting en plaats je los; handig als je geen inbouwruimte hebt of flexibel wilt blijven." },
  { q: "Wat betekent volledig geïntegreerd bij een vaatwasser?",
    a: "Volledig geïntegreerd betekent dat de bediening aan de binnenkant zit. Aan de buitenkant zie je alleen je eigen keukenfront, zonder knoppen of display." },
  { q: "Hoe breed is een standaard vaatwasser?",
    a: "Standaard is 60 cm breed. Voor smallere keukens bestaan er 45 cm ‘smalle’ modellen." },
  { q: "Kan een vaatwasser bovenop een aanrecht worden geplaatst?",
    a: "Ja, met een compacte vaatwasser. Deze past op aanrecht/tafel en is geschikt voor kleine keukens of studentenkamers." },
  { q: "Hoeveel water verbruikt een moderne vaatwasser gemiddeld?",
    a: "Gemiddeld 6–12 liter per wasbeurt, vaak zuiniger dan handafwas over het jaar." },
  { q: "Is een stille vaatwasser de moeite waard?",
    a: "Ja, vooral bij een open keuken. Stil betekent grofweg 42–45 dB; dat stoort nauwelijks tijdens tv-kijken of gesprekken." },
  { q: "Welke extra functies zijn handig in een vaatwasser?",
    a: "Besteklade, automatische deuropening voor beter drogen, intensieve zone voor pannen en een halflaad-programma zijn populaire opties." },
  { q: "Hoe HelpKiezen werkt",
    a: "We helpen je snel kiezen en sturen je vervolgens door naar partners met jouw filters toegepast. " + "Soms ontvangen we een commissie als je iets koopt via onze links; dit verandert jouw prijs niet. " + "We zijn o.a. affiliate van bol.com. We tonen altijd keuzes op basis van jouw selectie."
  }
]

// --- Overlay content mapping (no external refs)
const OVERLAY_COPY = {
  inbouw: {
    title: "Inbouw",
    body: "Volledig of half geïntegreerd of onderbouw: kies wat bij je keuken past. Let extra op nismaat en front."
  },
  vrijstaand: {
    title: "Vrijstaand",
    body: "Flexibel te plaatsen, geen front nodig en eenvoudig te vervangen."
  },
  "45cm": {
    title: "Smal (45 cm)",
    body: "Ideaal voor kleine keukens of 1–2 persoons huishoudens."
  },
  "60cm": {
    title: "Standaard (60 cm)",
    body: "Meest gangbare maat met de meeste keuze in modellen en functies."
  },
  stil: {
    title: "Stil",
    body: "Voor open keukens raden we ≤45 dB aan; dat is nauwelijks hoorbaar."
  }
}

// --- Page header (hero) with overlay triggers ---
function Hero({ onOpen }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 to-zinc-200" />
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Vaatwasser kiezen</h1>
        <p className="mt-3 text-lg text-black/70 max-w-3xl">
          Snel de juiste vaatwasser vinden? Hieronder leggen we kort de belangrijkste keuzes uit: inbouw vs. vrijstaand,
          45 vs. 60 cm en het belang van geluidsniveau.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <button onClick={() => onOpen("inbouw")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Inbouw</button>
          <button onClick={() => onOpen("vrijstaand")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Vrijstaand</button>
          <button onClick={() => onOpen("45cm")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">45 cm</button>
          <button onClick={() => onOpen("60cm")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">60 cm</button>
          <button onClick={() => onOpen("stil")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Stil</button>
        </div>
      </div>
    </section>
  )
}

// Simple overlay modal
function Overlay({ openKey, onClose }) {
  const data = OVERLAY_COPY[openKey] || null
  if (!openKey || !data) return null
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(92vw,700px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{data.title}</h3>
            <p className="mt-2 text-black/80 leading-relaxed">{data.body}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium shadow hover:shadow"
            aria-label="Sluiten"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Vaatwassers() {
  const [overlayKey, setOverlayKey] = useState(null)

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <SeoHead title={PAGE_TITLE} description={PAGE_DESC} url={PAGE_URL} canonical={PAGE_URL} />
      <JsonLd data={itemListData} />

      <div className="mx-auto max-w-6xl px-6 py-4">
        <Breadcrumbs items={[{ name: "HelpKiezen", to: "/" }, { name: "Vaatwassers" }]} />
      </div>

      <Hero onOpen={setOverlayKey} />
      <Overlay openKey={overlayKey} onClose={() => setOverlayKey(null)} />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <HelpKiezenWizard
          topic="vaatwasser"
          steps={getDishwasherSteps}
          buildUrl={(selections) => buildInternalUrl(selections)}
          interactive={true}
          applyDelayMs={2000}
          showFooter={false} // ⬅️ wizard-footertje uit, zodat pagina-footer als laatste komt
        />

        {/* Extra content blocks (collapsible) */}
        <div className="mt-12 space-y-4">
          <Disclosure title="Waar let je op bij geluidsniveau?">
            Onder ~45 dB ervaar je het als stil. 46+ dB kan storend zijn in open woonruimtes.
          </Disclosure>
          <Disclosure title="Prijs vs. levensduur">
            Duurdere modellen hebben vaak stillere motoren, betere droogresultaten en langere garantie/levensduur.
          </Disclosure>
        </div>

        {/* FAQ vóór de footer */}
        <Faq items={faqItems} />
      </main>

      {/* Échte pagina-footer komt hier in je layout/app-shell.
          Zorg dat je site-footer component ná deze page render staat,
          zodat FAQ nooit onder de footer verdwijnt. */}
    </div>
  )
}
