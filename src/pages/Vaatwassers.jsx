import React from 'react'
// ...imports bovenaan blijven gelijk
import HelpKiezenWizard from '../components/HelpKiezenWizard.jsx';

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

  // categorie (vrijstaand / inbouw-varianten)
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

  if (mode === 'standard') {
    return [
      ...base,
      categoryStep,
      {
        key: 'niche_width',
        title: 'Breedte / nis',
        subtitle: 'Kies 45 of 60 cm (optioneel).',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: '45-cm', label: '45 cm', caption: 'Smal model' },
          { id: '60-cm', label: '60 cm', caption: 'Normaal model' },
        ],
      },
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
        title: 'Prijs (indicatie)',
        subtitle: 'Wordt niet in de URL gefilterd.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: 'budget', label: 'Budget', caption: 'Tot ± €400' },
          { id: 'mid', label: 'Midden', caption: '€400–€800' },
          { id: 'premium', label: 'Premium', caption: '€800+' },
        ],
      },
    ];
  }

  if (mode === 'advanced') {
    return [
      ...base,
      categoryStep,
      {
        key: 'hinge',
        title: 'Scharniersysteem',
        subtitle: 'Optioneel.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: 'deur-op-deur', label: 'Deur-op-deur' },
          { id: 'sleepdeur', label: 'Sleepdeur' },
        ],
      },
      {
        key: 'niche_width',
        title: 'Breedte / nis',
        subtitle: 'Optioneel.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: '45-cm', label: '45 cm' },
          { id: '60-cm', label: '60 cm' },
        ],
      },
      {
        key: 'niche_depth',
        title: 'Nisdiepte',
        subtitle: 'Optioneel.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: '58-cm', label: '58 cm' },
          { id: '55-cm', label: '55 cm' },
        ],
      },
      {
        key: 'drying',
        title: 'Droogtechniek',
        subtitle: 'Optioneel.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: 'ventilatiedroogtechniek', label: 'Ventilatiedroogtechniek' },
          { id: 'condensdroogtechniek', label: 'Condensdroogtechniek' },
        ],
      },
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
        title: 'Prijs (indicatie)',
        subtitle: 'Indicatief; niet gefilterd.',
        options: [
          { id: 'none', label: 'Geen voorkeur', caption: 'Overslaan' },
          { id: 'budget', label: 'Budget', caption: 'Tot ± €400' },
          { id: 'mid', label: 'Midden', caption: '€400–€800' },
          { id: 'premium', label: 'Premium', caption: '€800+' },
        ],
      },
    ];
  }

  return base;
}

// ---- New: Coolblue slug mapping per category ----
function buildCoolblueUrl(selections) {
  const cat = selections.category;

  const basePath = {
    integrated: 'vaatwassers/inbouw/geintegreerde-vaatwassers',
    'semi-integrated': 'vaatwassers/inbouw/half-geintegreerde-vaatwassers',
    undercounter: 'vaatwassers/inbouw/onderbouw',
    freestanding: 'vaatwassers/vrijstaand',
  }[cat] || 'vaatwassers';

  const segs = [];

  // 1) Breedte / model
  if (selections.niche_width && selections.niche_width !== 'none') {
    if (cat === 'freestanding') {
      if (selections.niche_width === '45-cm') {
        segs.push('model-vaatwasser:smal-45-cm-breed'); // vrijstaand 45 cm
      }
      // 60 cm vrijstaand is "normaal" → geen segment nodig
    } else {
      // inbouw: echte nis-breedte
      segs.push(`geschikt-voor-nisbreedte:${selections.niche_width}`);
    }
  }

  // 2) Nisdiepte (alleen inbouw)
  if (selections.niche_depth && selections.niche_depth !== 'none' && cat !== 'freestanding') {
    segs.push(`geschikt-voor-nisdiepte:${selections.niche_depth}`);
  }

  // 3) Scharniersysteem (alleen inbouw)
  if (selections.hinge && selections.hinge !== 'none' && cat !== 'freestanding') {
    segs.push(`scharniersysteem:${selections.hinge}`);
  }

  // 4) Droogtechniek
  if (selections.drying && selections.drying !== 'none') {
    segs.push(`droogtechniek:${selections.drying}`);
  }

  // 5) Geluidsniveau
  if (selections.noise && selections.noise !== 'none') {
    segs.push(`maximaal-geluidsniveau:${selections.noise}`);
  }

  // Prijs: indicatief → NIET mappen

  let url = `https://www.coolblue.nl/${basePath}`;
  if (segs.length) url += '/' + segs.join('/');
  return url;
}

export default function Vaatwassers() {
  return (
    <HelpKiezenWizard
      topic="vaatwasser"
      marketplace="coolblue"
      steps={getDishwasherSteps}
      buildUrl={buildCoolblueUrl}
      interactive={true}
    />
  );
}
