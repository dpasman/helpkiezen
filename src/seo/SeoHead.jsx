import React, { useEffect } from "react"

export function SeoHead({ title, description, url, canonical }) {
  useEffect(() => {
    if (title) document.title = title

    const ensure = (name, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      return el
    }

    if (description) {
      const metaDesc = ensure("description")
      metaDesc.setAttribute("content", description)
    }

    if (url) {
      const ogUrl = ensure("og:url", "property")
      ogUrl.setAttribute("content", url)
      const ogType = ensure("og:type", "property")
      ogType.setAttribute("content", "website")
      const ogTitle = ensure("og:title", "property")
      ogTitle.setAttribute("content", title || "")
      const ogDesc = ensure("og:description", "property")
      ogDesc.setAttribute("content", description || "")
    }

    if (canonical) {
      let link = document.querySelector(`link[rel="canonical"]`)
      if (!link) {
        link = document.createElement("link")
        link.setAttribute("rel", "canonical")
        document.head.appendChild(link)
      }
      link.setAttribute("href", canonical)
    }
  }, [title, description, url, canonical])

  return null
}
