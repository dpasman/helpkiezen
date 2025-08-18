// src/pages/Vaatwassers.jsx
import React, { useState } from "react"
import HelpKiezenWizard from "../components/HelpKiezenWizard.jsx"
import { SeoHead } from "../seo/SeoHead"
import { JsonLd } from "../seo/JsonLd"
import { Breadcrumbs } from "../components/Breadcrumbs"
import { Faq } from "../components/Faq"
import { Disclosure } from "../components/Disclosure"

// --- Verified bol.com mappings ---
// Category bases (end with /{catId}/)
const CATEGORY_BASE = {
  integrated: "https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/",
  "semi-integrated": "https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/",
  undercounter: "https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/",
  freestanding: "https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/18293/",
}

// Placement facet IDs (only for inbouw varianten)
const PLACEMENT_IDS = {
  integrated: "4797281775",       // Volledig integreerbaar
  "semi-integrated": "4797382560",// Half integreerbaar
  undercounter: "4288488028",     // Onderbouw
}

// Width facet IDs (category-specific)
const WIDTH_IDS = {
  inbouw: { "45": "22706", "60": "22707" },
  vrijstaand: { "45": "22630", "60": "22629" },
}

// Noise facet IDs
const NOISE_IDS = {
  "41-42": "10847",   // Stil (tot 42 dB)
  "43-45": "10848",   // Normaal (42–49 dB)
  "46-plus": "10849", // Luid (49+ dB)
}

// Energy single label IDs
const ENERGY_LABEL_IDS = {
  A: "61293",
  B: "58910",
  C: "58369",
  D: "58370",
  E: "58372",
  F: "58373",
}

// Energy groups → arrays of label letters
const ENERGY_GROUPS = {
  none: [],
  zuinig: ["A", "B"],       // A–B
  gemiddeld: ["C", "D"],    // C–D
  laag: ["E", "F"],         // E–F
}

// Price buckets → we can only sort (no range filter in URL)
const PRICE_BUCKETS = {
  none: null,
  budget: [0, 400],
  mid: [400, 800],
  premium: [800, 9999],
}

// Build bol URL with plus-separated IDs in PATH (not encoded in code)
function buildInternalUrl(selections) {
  const categoryKey = selections.category || "freestanding"
  const base = CATEGORY_BASE[categoryKey] || CATEGORY_BASE.freestanding

  const ids = []

  // Energy group -> expand to concrete label IDs
  const groupKey = selections.energyGroup || "none"
  const labels = ENERGY_GROUPS[groupKey] || []
  for (const lbl of labels) {
    const id = ENERGY_LABEL_IDS[lbl]
    if (id) ids.push(id)
  }

  // Noise
  if (selections.noise && selections.noise !== "none") {
    const nid = NOISE_IDS[selections.noise]
    if (nid) ids.push(nid)
  }

  // Placement (only for inbouw varianten)
  if (categoryKey !== "freestanding") {
    const pid = PLACEMENT_IDS[categoryKey]
    if (pid) ids.push(pid)
  }

  // Optional width (only shown/used in advanced mode)
  if (selections.width && selections.width !== "none") {
    const map = categoryKey === "freestanding" ? WIDTH_IDS.vrijstaand : WIDTH_IDS.inbouw
    const wid = map[selections.width]
    if (wid) ids.push(wid)
  }

  // Compose path with raw '+'
  let url = base
  if (ids.length) url += ids.join("+") + "/"

  // Query: only sorting (and grid view for consistency)
  const params = new URLSearchParams()
  const bucket = PRICE_BUCKETS[selections.price || "none"]
  if (bucket) {
    params.set("sort", "price0") // ascending
    params.set("view", "grid")
  }

  const q = params.toString()
  return q ? `${url}?${q}` : url
}

// --- Wizard steps (mode → category → energyGroup → noise → [width in advanced] → price)
function getDishwasherSteps(selections) {
  const mode = selections.mode || "standard"

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
    {
      key: "category",
      title: "Type vaatwasser",
      subtitle: "Kies je opstelling.",
      options: [
    { id: 'integrated', label: 'Inbouw – volledig geïntegreerd', caption: 'Verborgen bediening', img: '/images/integrated.webp', imgAlt: 'Volledig geïntegreerde vaatwasser' },
    // { id: 'semi-integrated', label: 'Inbouw – half geïntegreerd', caption: 'Zichtbaar paneel', img: '/images/semi.webp', imgAlt: 'Half geïntegreerde vaatwasser' },
    { id: 'undercounter', label: 'Inbouw – onderbouw', caption: 'Zonder front, onder blad', img: '/images/undercounter.webp', imgAlt: 'Onderbouw vaatwasser' },
    { id: 'freestanding', label: 'Vrijstaand', caption: 'Los te plaatsen', img: '/images/freestanding.webp', imgAlt: 'Vrijstaande vaatwasser' },
      ],
    },
    {
      key: "energyGroup",
      title: "Energielabel (gegroepeerd)",
      subtitle: "Kies een groep. Eén keuze, geen herhaling.",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "zuinig", label: "Zuinig (A–B)" },
        { id: "gemiddeld", label: "Gemiddeld (C–D)" },
        { id: "laag", label: "Laag (E–F)" },
      ],
    },
    {
      key: "noise",
      title: "Geluidsniveau",
      subtitle: "Optioneel.",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Overslaan" },
        { id: "41-42", label: "Stil (≤42 dB)" },
        { id: "43-45", label: "Normaal (42–49 dB)" },
        { id: "46-plus", label: "Luid (49+ dB)" },
      ],
    },
  ]

  const advanced = [
    {
      key: "width",
      title: "Breedte",
      subtitle: "Alleen in geavanceerd.",
      options: [
        { id: "none", label: "Geen voorkeur" },
        { id: "45", label: "45 cm (smal)" },
        { id: "60", label: "60 cm (standaard)" },
      ],
    },
  ]

  const price = [
    {
      key: "price",
      title: "Prijs",
      subtitle: "Wordt gebruikt om te sorteren (laag → hoog).",
      options: [
        { id: "none", label: "Geen voorkeur", caption: "Niet sorteren" },
        { id: "budget", label: "Budget", caption: "Tot ± €400" },
        { id: "mid", label: "Midden", caption: "€400–€800" },
        { id: "premium", label: "Premium", caption: "€800+" },
      ],
    },
  ]

  return mode === "advanced" ? [...base, ...advanced, ...price] : [...base, ...price]
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
    a: "HelpKiezen toont doorverwijzingen naar bol.com. Zodra we officieel aangesloten zijn bij het bol.com partnerprogramma, kunnen we daar een commissie voor ontvangen. Dit verandert niets aan jouw prijs."
  }
]

// --- Overlay content mapping (no external refs)
const OVERLAY_COPY = {
  inbouw: { title: "Inbouw", body: "Volledig of half geïntegreerd of onderbouw: kies wat bij je keuken past. Let extra op nismaat en front." },
  vrijstaand: { title: "Vrijstaand", body: "Flexibel te plaatsen, geen front nodig en eenvoudig te vervangen." },
  "45cm": { title: "Smal (45 cm)", body: "Ideaal voor kleine keukens of 1–2 persoons huishoudens." },
  "60cm": { title: "Standaard (60 cm)", body: "Meest gangbare maat met de meeste keuze in modellen en functies." },
  stil: { title: "Stil", body: "Voor open keukens raden we ≤45 dB aan; dat is nauwelijks hoorbaar." }
}

// --- Page header (hero) with overlay triggers ---
function Hero({ onOpen }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fafafa]">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 to-zinc-200" />
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Vaatwasser kiezen</h1>
          <p className="mt-3 text-lg text-black/70">
            Snel de juiste vaatwasser vinden? Hieronder leggen we kort de belangrijkste keuzes uit.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <button onClick={() => onOpen("inbouw")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Inbouw</button>
            <button onClick={() => onOpen("vrijstaand")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Vrijstaand</button>
            <button onClick={() => onOpen("45cm")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">45 cm</button>
            <button onClick={() => onOpen("60cm")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">60 cm</button>
            <button onClick={() => onOpen("stil")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Stil</button>
            <button onClick={() => onOpen("werkwijze")} className="rounded-full border border-black/10 bg-white px-3 py-1 shadow hover:shadow">Hoe HelpKiezen werkt</button>
          </div>
        </div>

        {/* Image */}
        {/* <div className="relative">
          <img
            src="/images/dishwasher-hero.jpg"
            srcSet="/images/dishwasher-hero-640.jpg 640w, /images/dishwasher-hero-1280.jpg 1280w"
            sizes="(max-width: 768px) 100vw, 600px"
            alt="Moderne keuken met geopende geïntegreerde vaatwasser"
            loading="eager"
            className="w-full h-auto rounded-2xl shadow-sm border border-black/5 object-cover"
          />
        </div> */}
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
