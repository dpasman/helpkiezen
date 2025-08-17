import React from "react";
import { Link } from "react-router-dom";

export function Breadcrumbs({ items }) {
  // items: [{name, to}]
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-4">
      <ol className="flex flex-wrap gap-1 text-gray-600">
        {items.map((it, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="px-1">/</span>}
            {it.to ? <Link className="hover:underline" to={it.to}>{it.name}</Link> : <span>{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
