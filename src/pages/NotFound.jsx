import React from "react";
import { SeoHead } from "../seo/SeoHead";

export default function NotFound() {
  return (
    <div className="container mx-auto p-6">
      <SeoHead title="Pagina niet gevonden | HelpKiezen" description="Deze pagina bestaat niet." noindex />
      <h1 className="text-2xl font-bold mb-2">Pagina niet gevonden</h1>
      <p>De link die je volgde lijkt niet te werken.</p>
    </div>
  );
}
