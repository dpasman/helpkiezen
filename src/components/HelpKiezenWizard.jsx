import React, { useEffect, useMemo, useState } from "react"

// Simple inline icons (no external deps)
const CircleIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><circle cx="12" cy="12" r="9" /></svg>
)
const SquareIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
)
const TriangleIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><path d="M12 4l9 16H3z"/></svg>
)
const StarIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><path d="M12 3l3.09 6.26L22 10l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.87 2 10l6.91-0.74z"/></svg>
)

// Default example steps (used on /)
const exampleSteps = [
  {
    key: "goal",
    title: "Wat wil je bereiken?",
    subtitle: "Kies het doel dat het beste past.",
    options: [
      { id: "start", label: "Starten", caption: "Eenvoudig beginnen", tint: "from-sky-200 to-indigo-300", icon: CircleIcon },
      { id: "optimize", label: "Optimaliseren", caption: "Meer controle", tint: "from-emerald-200 to-teal-300", icon: SquareIcon },
      { id: "expert", label: "Expertmodus", caption: "Volledige set", tint: "from-amber-200 to-orange-300", icon: TriangleIcon }
    ]
  },
  {
    key: "scale",
    title: "Schaal",
    subtitle: "Hoe groot is je behoefte?",
    options: [
      { id: "small", label: "Klein", caption: "Persoonlijk/klein team", tint: "from-fuchsia-200 to-pink-300", icon: StarIcon },
      { id: "medium", label: "Middel", caption: "Scale-up/afdeling", tint: "from-lime-200 to-green-300", icon: CircleIcon },
      { id: "large", label: "Groot", caption: "Organisatiebreed", tint: "from-slate-200 to-zinc-300", icon: SquareIcon }
    ]
  },
  {
    key: "budget",
    title: "Budget",
    subtitle: "Welke prijsklasse past?",
    options: [
      { id: "budget", label: "Budget", caption: "Instap", tint: "from-rose-200 to-red-300", icon: TriangleIcon },
      { id: "mid", label: "Midden", caption: "Goede balans", tint: "from-violet-200 to-purple-300", icon: CircleIcon },
      { id: "premium", label: "Premium", caption: "Topsegment", tint: "from-indigo-200 to-indigo-300", icon: StarIcon }
    ]
  }
]

// Marketplaces (fallback search)
const MARKETPLACES = {
  coolblue: { name: "Coolblue", search: (q) => `https://www.coolblue.nl/zoeken?query=${encodeURIComponent(q)}` },
  bol: { name: "Bol", search: (q) => `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(q)}` }
}

function labelForKey(steps, key) {
  const s = steps.find((st) => st.key === key)
  return s?.title || key
}
function labelForOption(steps, stepKey, optionId) {
  const step = steps.find((s) => s.key === stepKey)
  const opt = step?.options.find((o) => o.id === optionId)
  return opt?.label ?? optionId
}
function selectionKeywords(selections, steps, topic) {
  const labels = Object.entries(selections).map(([k, v]) => labelForOption(steps, k, v)).filter(Boolean)
  return [topic, ...labels].filter(Boolean).join(" ")
}
function defaultBuildUrl(selections, { marketplace, steps, topic }) {
  const mp = MARKETPLACES[marketplace] || MARKETPLACES.coolblue
  const q = selectionKeywords(selections, steps, topic || "")
  return mp.search(q)
}

// Progress bar (header)
function ProgressBar({ stepIndex, totalSteps, showSummary }) {
  const current = showSummary ? totalSteps : Math.min(stepIndex + 1, totalSteps)
  const pct = Math.max(0, Math.min(100, (current / totalSteps) * 100))
  return (
    <div aria-label="Voortgang" className="mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full bg-black/10 shadow-inner">
      <div className="h-full w-0 rounded-full bg-black transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Badge({ children }) {
  return <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-xs font-medium text-white shadow">{children}</span>
}

function Thumbnail({ Icon, tint }) {
  const hasIcon = typeof Icon === "function"
  const safeTint = tint || "from-slate-200 to-zinc-300"
  return (
    <div className={"relative h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br " + safeTint + " shadow-sm"}>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />
      {hasIcon ? (<Icon className="absolute right-6 top-6 h-12 w-12 opacity-60" />) : (<div className="absolute right-6 top-6 h-12 w-12 rounded-lg bg-white/40" />)}
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/30" />
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20" />
    </div>
  )
}

function OptionCard({ option, selected, onSelect }) {
  const Icon = typeof option?.icon === "function" ? option.icon : null
  const baseScale = selected ? "scale-[1.02]" : "scale-100"
  const hoverScaleSelected = "group-hover:scale-[1.05]"
  const hoverScaleUnselected = "group-hover:scale-[1.02]"
  const hoverScale = selected ? hoverScaleSelected : hoverScaleUnselected

  return (
    <button onClick={() => onSelect(option.id)} className={["group text-left", "focus:outline-none"].join(" ")}>
      <div className={["relative rounded-2xl border border-black/5 bg-white shadow-sm transition-transform duration-200 ease-out transform", "group-hover:shadow-md", baseScale, hoverScale].join(" ")}>
        {option.badge && <Badge>{option.badge}</Badge>}
        <Thumbnail Icon={Icon} tint={option.tint} />
        <div className="flex items-center justify-between p-4">
          <div>
            <div className="text-lg font-semibold tracking-tight">{option.label}</div>
            <div className="text-sm text-black/60">{option.caption}</div>
          </div>
          <div className={["ml-4 h-5 w-5 rounded-full border", selected ? "border-black bg-black" : "border-black/20 bg-white"].join(" ")} />
        </div>
      </div>
    </button>
  )
}

function SummaryChips({ selections, steps }) {
  const items = Object.entries(selections).filter(([, v]) => !!v)
  if (!items.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([k, v]) => (
        <span key={k} className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm shadow">
          <span className="font-medium mr-1">{labelForKey(steps, k)}:</span>{labelForOption(steps, k, v)}
        </span>
      ))}
    </div>
  )
}

function SummaryCard({ selections, steps }) {
  const items = steps.map((s) => ({ key: s.key, title: s.title, option: s.options.find((o) => o.id === selections[s.key]) }))
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="h-32 rounded-t-2xl bg-gradient-to-br from-slate-100 to-zinc-200" />
        <div className="-mt-16 px-6 pb-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
            <h3 className="text-xl font-semibold tracking-tight">Jouw selectie</h3>
            <p className="mt-1 text-sm text-black/60">Controleer je keuzes. Je kunt altijd terug om iets aan te passen.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {items.map(({ key, title, option }) => (
                <div key={key} className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {typeof option?.icon === "function" ? (
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${option.tint || 'from-slate-200 to-zinc-300'} grid place-items-center`}>
                        {React.createElement(option.icon, { className: "h-6 w-6 opacity-75" })}
                      </div>
                    ) : (<div className="h-12 w-12 rounded-lg bg-slate-200" />)}
                    <div>
                      <div className="text-sm text-black/60">{title}</div>
                      <div className="text-base font-medium">{option ? option.label : "—"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loader with progress bar filling up over applyDelayMs
const Loader = ({ applyDelayMs = 2000 }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / applyDelayMs) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [applyDelayMs])

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-black/10 border-t-black" aria-hidden />
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Filters toepassen…</h2>
        <p className="mt-2 text-black/70">Even geduld, we maken alles klaar.</p>
      </div>
      <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-black transition-[width] duration-50 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-black/60">{Math.round(progress)}%</p>
    </div>
  )
}

export default function HelpKiezenWizard(props) {
  const {
    topic = "",
    marketplace = "coolblue",
    steps: customSteps,
    buildUrl,
    onShowRecommendations,
    interactive = true,
    initialSelections = {},
    autoNavigate = false,
    navigateDelayMs = 0,
    applyDelayMs = 2000 // how long the pre-summary loader shows
  } = props

  const [selections, setSelections] = useState(interactive ? {} : { ...initialSelections })
  const [stepIndex, setStepIndex] = useState(0)
  const [showSummary, setShowSummary] = useState(!interactive)
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)
  const [mp] = useState(marketplace)

  const steps = useMemo(() => {
    if (typeof customSteps === "function") {
      try { return customSteps(selections) || [] } catch { return [] }
    }
    return customSteps || exampleSteps
  }, [customSteps, selections])

  useEffect(() => {
    if (interactive) {
      setStepIndex(0)
      setShowSummary(false)
    } else {
      setStepIndex(Math.max(0, steps.length - 1))
      setShowSummary(true)
    }
  }, [interactive])

  useEffect(() => {
    if (stepIndex > steps.length - 1) {
      setStepIndex(Math.max(0, steps.length - 1))
    }
  }, [steps, stepIndex])

  const current = steps[stepIndex] || { key: "", options: [] }
  const allDone = steps.every((s) => selections[s.key])

  function handleSelect(optionId) {
    setSelections((prev) => ({ ...prev, [current.key]: optionId }))
  }

  // NEXT: on last step, show loader first, then summary
  function next() {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      // Show pre-summary loader with progress
      setIsApplyingFilters(true)
      setTimeout(() => {
        setIsApplyingFilters(false)
        setShowSummary(true)
      }, Math.max(0, applyDelayMs))
    }
  }

  function prev() {
    if (isApplyingFilters) return // block navigating back during loader
    if (showSummary) setShowSummary(false)
    else if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  function reset() {
    if (interactive) { setSelections({}); setStepIndex(0); setShowSummary(false) }
    else { setSelections({ ...initialSelections }); setShowSummary(true) }
  }

  function showRecs() {
    const builder = typeof buildUrl === "function" ? buildUrl : (sel, ctx) => {
      const labels = Object.entries(sel).map(([k, v]) => labelForOption(steps, k, v)).filter(Boolean).join(" ")
      const base = MARKETPLACES[ctx.marketplace] || MARKETPLACES.coolblue
      return base.search((ctx.topic ? ctx.topic + " " : "") + labels)
    }
    const url = builder(selections, { marketplace: mp, steps, topic })
    if (typeof onShowRecommendations === "function") onShowRecommendations({ selections, marketplace: mp, topic, url })
    else if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    if (!interactive && autoNavigate) {
      const t = setTimeout(() => showRecs(), Math.max(0, navigateDelayMs))
      return () => clearTimeout(t)
    }
  }, [interactive, autoNavigate, navigateDelayMs, selections, mp, steps, topic])

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      <header className="mx-auto max-w-6xl px-6 pt-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">helpkiezen</h1>
        <p className="mt-3 text-lg text-black/70">
          {isApplyingFilters
            ? "Even geduld… we passen je filters toe."
            : (showSummary ? "Overzicht van je keuzes." : "Maak een paar keuzes en ga door.")}
        </p>
        <div className="mt-8">
          <ProgressBar stepIndex={stepIndex} totalSteps={steps.length} showSummary={showSummary} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isApplyingFilters ? (
          <Loader applyDelayMs={applyDelayMs} />
        ) : !showSummary && interactive ? (
          <>
            <section className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{current.title || "Maak een keuze"}</h2>
              <p className="mt-2 text-black/70">{current.subtitle || ""}</p>
            </section>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(current.options || []).map((opt) => (
                <OptionCard key={opt.id} option={opt} selected={selections[current.key] === opt.id} onSelect={handleSelect} />
              ))}
            </div>
          </>
        ) : (
          <>
            <section className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Samenvatting</h2>
              <p className="mt-2 text-black/70">Dit is je selectie. Klopt alles? Dan kun je hiermee verder.</p>
            </section>
            <SummaryCard selections={selections} steps={steps} />
            <div className="mt-8 flex justify-center">
              <button
                onClick={showRecs}
                className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow hover:bg-blue-700 transition"
              >
                Laat mij {topic || "producten"}(s) zien
              </button>
            </div>
          </>
        )}

        {/* Bottom controls (hide while loading) */}
        {!isApplyingFilters && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            {interactive ? <SummaryChips selections={selections} steps={steps} /> : <div />}
            <div className="flex items-center gap-3">
              <button onClick={reset} className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium shadow-sm hover:shadow">Reset</button>
              <button onClick={prev} disabled={!showSummary && stepIndex === 0} className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium shadow-sm disabled:opacity-50 hover:shadow">Terug</button>
              {!showSummary && (
                <button onClick={next} disabled={!selections[current.key]} className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-50">
                  {stepIndex < steps.length - 1 ? "Volgende" : "Naar samenvatting"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
