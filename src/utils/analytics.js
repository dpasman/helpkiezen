// English code as requested
export function trackOutbound(label) {
  try {
    if (window.gtag) {
      window.gtag('event', 'click', { event_category: 'outbound', event_label: label });
    }
  } catch {}
}
