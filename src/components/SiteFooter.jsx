import React from "react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-black/60">
        © {new Date().getFullYear()} HelpKiezen
      </div>
    </footer>
  );
}
