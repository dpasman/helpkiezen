// src/pages/Vaatwassers.jsx
import React, { useState } from "react"
import HelpKiezenWizard from "../components/HelpKiezenWizard.jsx"
import { SeoHead } from "../seo/SeoHead"
import { JsonLd } from "../seo/JsonLd"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { Faq } from "../components/Faq"
import { Disclosure } from "../components/Disclosure"

// --- (alleen nog nodig voor je interne URL als je ooit wil switchen) ---
const CATEGORY_PATH = {
  integrated: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  'semi-integrated': 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  undercounter: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  freestanding: 'https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/18293/',
};

const PRICE_BUCKETS = {
  none: null,
  budget: [0, 400],
  mid: [400, 800],
  premium: [800, 9999],
}

function buildInternalUrl(selections) {
  const category = selections.category
  const base = CATEGORY_PATH[category] || CATEGORY_PATH.freestanding
  const params = new URLSearchParams()
  if (selections.noise && selections.noise !== "none") params.set("noise", selections.noise)
  const bucket = PRICE_BUCKETS[selections.price || "none"]
  if (bucket) params.set("price", `${bucket[0]}-${bucket[1]}`)
  const q = params.toString()
  return q ? `${base}?${q}` : base
}

/* ---------------- bol.com deeplink builder ----------------
   Bewezen IDs:
   - Categorie inbouw: 18294
   - Geluidsniveau (groep 42814):
       quiet(41–42)=10847, normal(43–45)=10848, loud(46+)=10849  → segment "42814+<id>"
   - Energielabels (voor groepjes in één segment):
       A=61293, B=58910, C=58369, D=58370, E=58372, F=58373
     Groepen:
       efficient (A–B)      → [61293,58910]
       average (C–D)        → [58369,58370]
       less_efficient (E–F) → [58372,58373]
   - Nisbreedte 45 cm (inbouw): 22706 (optioneel)
-----------------------------------------------------------*/

const BOL_CATEGORY_ID = {
  integrated: "18294",
  "semi-integrated": "18294",
  undercounter: "18294",
  freestanding: "18293",
}

const BOL_WIDTH_INBOUW = { "45": "22706", "60": "22707" } // optioneel

const ENERGY_GROUPS = {
  efficient: ["61293", "58910"],       // A + B
  average: ["58369", "58370"],         // C + D
  less_efficient: ["58372", "58373"],  // E + F
}

// facetgroep-id voor Geluidsniveau
const NOISE_GROUP_ID = "42814"
const NOISE_VALUES = {
  "41-42": "10847",  // Stil
  "43-45": "10848",  // Normaal
  "46-plus": "10849" // Luid
}

function encodePlusJoined(ids) {
  // Eén segment met ‘+’ ertussen, URL-encoded als %2B
  return encodeURIComponent(ids.join("+"))
}

function buildBolUrl(selections) {
  const category = selections.category || "integrated"
  const isFreestanding = category === "freestanding"

  const base = isFreestanding
    ? `https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/${BOL_CATEGORY_ID.freestanding}/`
    : `https://www.bol.com/nl/nl/l/inbouw-vaatwassers/${BOL_CATEGORY_ID.integrated}/`

  const segments = []

  // 1) Energielabels ALTIJD gegroepeerd
  const energyGroup = selections.energyGroup || "efficient" // default kun je aanpassen
  if (ENERGY_GROUPS[energyGroup]) {
    segments.push(encodePlusJoined(ENERGY_GROUPS[energyGroup]))
  }

  // 2) Geluidsniveau: altijd als groep+waarde
  if (selections.noise && selections.noise !== "none") {
    const val = NOISE_VALUES[selections.noise]
    if (val) segments.push(`${NOISE_GROUP_ID}%2B${val}`) // already encoded '+'
  }

  // 3) (optioneel) Nisbreedte voor inbouw
  if (!isFreestanding && selections.width && BOL_WIDTH_INBOUW[selections.width]) {
    segments.push(BOL_WIDTH_INBOUW[selections.width]) // deze werkt zonder groep-id
  }

  const path = segments.length ? `${segments.join("/")}/` : ""

  // sortering: prijs als je een prijsbucket koos
  const params = new URLSearchParams()
  if (selections.price && selections.price !== "none") params.set("sort", "price0")
  params.set("view", "grid")

  return `${base}${path}${params.toString() ? `?${params.toString()}` : ""}`
}

// ---------------- Steps (mode → category → noise/price) ----------------
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

  const noisePrice = [
    {
      key: "noise",
      title: "Geluidsniveau",
      subtitle: "Optioneel.",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "41-42", label: "41–42 dB (stil)" },
        { id: "43-45", label: "43–45 dB (normaal)" },
        { id: "46-plus", label: "46+ dB (luid)" },
      ],
    },
    {
      key: "price",
      title: "Prijs",
      subtitle: "Bepaalt sortering (laag → hoog).",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "budget", label: "Budget", caption: "Tot ± €400" },
        { id: "mid", label: "Midden", caption: "€400–€800" },
        { id: "premium", label: "Premium", caption: "€800+" },
      ],
    },
  ]

  // Vaste energie-groep (altijd gegroepeerd, geen extra vraag)
  const energyPreset = {
    key: "energyGroup",
    title: "Energiezuinigheid",
    subtitle: "Gegroepeerd (A–B / C–D / E–F).",
    options: [
      { id: "efficient", label: "Zuinig (A–B)" },
      { id: "average", label: "Gemiddeld (C–D)" },
      { id: "less_efficient", label: "Minder zuinig (E–F)" },
    ],
  }

  if (mode === "standard") return [...base, categoryStep, ...noisePrice, energyPreset]
  if (mode === "advanced") return [...base, categoryStep, ...noisePrice, energyPreset]
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
  { q: "Hoeveel water verbruikt een moderne vaatwasser gemiddeld?",
    a: "Gemiddeld 6–12 liter per wasbeurt, vaak zuiniger dan handafwas over het jaar." },
  { q: "Is een stille vaatwasser de moeite waard?",
    a: "Ja, vooral bij een open keuken. Stil betekent grofweg 42–45 dB; dat stoort nauwelijks tijdens tv-kijken of gesprekken." },
  { q: "Welke extra functies zijn handig in een vaatwasser?",
    a: "Besteklade, automatische deuropening voor beter drogen, intensieve zone voor pannen en een halflaad-programma zijn populaire opties." },
  { q: "Hoe HelpKiezen werkt",
    a: "We helpen je snel kiezen en sturen je vervolgens door naar partners met jouw filters toegepast. Soms ontvangen we een commissie als je iets koopt via onze links; dit verandert jouw prijs niet. We zijn o.a. affiliate van ... We tonen altijd keuzes op basis van jouw selectie."
  }
]

// --- Overlay (ongewijzigd) ---
const OVERLAY_COPY = {
  inbouw: { title: "Inbouw", body: "Volledig of half geïntegreerd of onderbouw: kies wat bij je keuken past. Let extra op nismaat en front." },
  vrijstaand: { title: "Vrijstaand", body: "Flexibel te plaatsen, geen front nodig en eenvoudig te vervangen." },
  "45cm": { title: "Smal (45 cm)", body: "Ideaal voor kleine keukens of 1–2 persoons huishoudens." },
  "60cm": { title: "Standaard (60 cm)", body: "Meest gangbare maat met de meeste keuze in modellen en functies." },
  stil: { title: "Stil", body: "Voor open keukens raden we ≤45 dB aan; dat is nauwelijks hoorbaar." }
}

function Hero({ onOpen }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 to-zinc-200" />
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Vaatwasser kiezen</h1>
        <p className="mt-3 text-lg text-black/70 max-w-3xl">
          Snel de juiste vaatwasser vinden? Volg de stappen hieronder!
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
          <button onClick={onClose} className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium shadow hover:shadow" aria-label="Sluiten">
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
          buildUrl={(selections) => buildBolUrl(selections)}   // ← bol deeplink (ids in pad)
          // buildUrl={(selections) => buildInternalUrl(selections)} // ← je interne variant (optioneel)
          interactive={true}
          applyDelayMs={2000}
          showFooter={false}
        />

        <div className="mt-12 space-y-4">
          <Disclosure title="Waar let je op bij geluidsniveau?">
            Onder ~45 dB ervaar je het als stil. 46+ dB kan storend zijn in open woonruimtes.
          </Disclosure>
          <Disclosure title="Prijs vs. levensduur">
            Duurdere modellen hebben vaak stillere motoren, betere droogresultaten en langere garantie/levensduur.
          </Disclosure>
        </div>

        <Faq items={faqItems} />
      </main>
    </div>
  )
}
