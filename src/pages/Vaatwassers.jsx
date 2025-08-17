import React from 'react'
import HelpKiezenWizard from '../components/HelpKiezenWizard.jsx'

// --- Mapping helpers for Bol.com ---
const BOL_CATEGORY_PATH = {
  integrated: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  'semi-integrated': 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  undercounter: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  freestanding: 'https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/18293/',
};

// Price buckets → tweak ranges if you prefer
const PRICE_BUCKETS = {
  none: null,
  budget: [0, 400],
  mid: [400, 800],
  premium: [800, 9999],
};

// Build Bol.com URL with filters
function buildBolUrl(selections, { affiliateTag } = {}) {
  const category = selections.category;
  const base = BOL_CATEGORY_PATH[category] || BOL_CATEGORY_PATH.freestanding;

  const params = new URLSearchParams();

  // Noise (e.g., "43-45")
  if (selections.noise && selections.noise !== 'none') {
    params.set('filter_Geluidsniveau', selections.noise);
  }

  // Price bucket → "min-max"
  const bucket = PRICE_BUCKETS[selections.price || 'none'];
  if (bucket) {
    params.set('filter_Prijs', `${bucket[0]}-${bucket[1]}`);
  }

  // Optional: energy / brand in the future
  // if (selections.energy) params.set('filter_Energieklasse', selections.energy);
  // if (selections.brand)  params.set('filter_Merk', selections.brand);

  // Affiliate tag (optional)
  if (affiliateTag) {
    // If your program requires a specific param name, change here
    params.set('aff', affiliateTag);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function getDishwasherSteps(selections) {
  const mode = selections.mode || null;

  const base = [{
    key: 'mode',
    title: 'Hoe wil je kiezen?',
    subtitle: 'Kies standaard of geavanceerd.',
    options: [
      { id: 'standard', label: 'Standaard', caption: 'Snel en simpel', tint: 'from-emerald-200 to-teal-300' },
      { id: 'advanced', label: 'Geavanceerd', caption: 'Meer filters', tint: 'from-sky-200 to-indigo-300' },
    ],
  }];

  const categoryStep = {
    key: 'category',
    title: 'Type vaatwasser',
    subtitle: 'Kies je opstelling.',
    options: [
      { id: 'integrated', label: 'Inbouw – volledig geïntegreerd', caption: 'Verborgen bediening' },
      { id: 'semi-integrated', label: 'Inbouw – half geïntegreerd', caption: 'Zichtbaar paneel' },
      { id: 'undercounter', label: 'Inbouw – onderbouw', caption: 'Zonder front, onder blad' },
      { id: 'freestanding', label: 'Vrijstaand', caption: 'Los te plaatsen' },
    ],
  };

  const commonNoisePrice = [
    {
      key: 'noise',
      title: 'Geluidsniveau',
      subtitle: 'Optioneel.',
      options: [
        { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
        { id: '41-42', label: '41–42 dB' },
        { id: '43-45', label: '43–45 dB' },
        { id: '46-plus', label: '46+ dB' },
      ],
    },
    {
      key: 'price',
      title: 'Prijs',
      subtitle: 'Wordt gefilterd in Bol.com resultaat.',
      options: [
        { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
        { id: 'budget', label: 'Budget', caption: 'Tot ± €400' },
        { id: 'mid', label: 'Midden', caption: '€400–€800' },
        { id: 'premium', label: 'Premium', caption: '€800+' },
      ],
    },
  ];
// --- Mapping helpers for Bol.com ---
const BOL_CATEGORY_PATH = {
  integrated: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  'semi-integrated': 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  undercounter: 'https://www.bol.com/nl/nl/l/inbouw-vaatwassers/18294/',
  freestanding: 'https://www.bol.com/nl/nl/l/vrijstaande-vaatwassers/18293/',
};

// Price buckets → tweak ranges if you prefer
const PRICE_BUCKETS = {
  none: null,
  budget: [0, 400],
  mid: [400, 800],
  premium: [800, 9999],
};

// Build Bol.com URL with filters (+ rating=all by default)
function buildBolUrl(selections, { affiliateTag } = {}) {
  const category = selections.category;
  const base = BOL_CATEGORY_PATH[category] || BOL_CATEGORY_PATH.freestanding;

  const params = new URLSearchParams();

  // Default: show all ratings (matches your example)
  params.set('rating', 'all');

  // Noise (e.g., "43-45")
  if (selections.noise && selections.noise !== 'none') {
    params.set('filter_Geluidsniveau', selections.noise);
  }

  // Price bucket → "min-max"
  const bucket = PRICE_BUCKETS[selections.price || 'none'];
  if (bucket) {
    params.set('filter_Prijs', `${bucket[0]}-${bucket[1]}`);
  }

  // Optional: future filters
  // if (selections.energy) params.set('filter_Energieklasse', selections.energy);
  // if (selections.brand)  params.set('filter_Merk', selections.brand);

  if (affiliateTag) {
    // Pas de naam aan als jouw partnerprogramma een andere param verwacht
    params.set('aff', affiliateTag);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}


  if (mode === 'standard') {
    return [
      ...base,
      categoryStep,
      ...commonNoisePrice,
    ];
  }

  if (mode === 'advanced') {
    return [
      ...base,
      categoryStep,
      // We intentionally keep only filters we can map reliably to Bol.com:
      // hinge/drying often aren't stable query keys on bol.com, so we omit them for now.
      ...commonNoisePrice,
    ];
  }

  return base;
}

export default function Vaatwassers() {
  // If you have an affiliate tag, pass it here
  const AFFILIATE_TAG = ''; // e.g. 'partner123'

  return (
    <HelpKiezenWizard
      topic="vaatwasser"
      steps={getDishwasherSteps}
      buildUrl={(selections) => buildBolUrl(selections, { affiliateTag: AFFILIATE_TAG })}
      interactive={true}
    />
  );
}
