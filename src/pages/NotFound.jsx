import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-center">
      <p className="text-sm font-medium text-black/50">404</p>
      <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">Pagina niet gevonden</h1>
      <p className="mt-3 text-black/70">
        De pagina die je zoekt bestaat niet (meer) of de URL is onjuist.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
        >
          Terug naar home
        </Link>
      </div>
    </main>
  );
}
