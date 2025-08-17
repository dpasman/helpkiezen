// English code as requested
import { writeFileSync } from "fs";
import { resolve } from "path";

// TODO: replace with a proper dynamic route list from your data source
const routes = [
  "/",
  "/tv",
  "/laptop",
  "/tv/55-inch",
  "/laptop/i7-32gb"
];

const base = "https://helpkiezen.nl";
const urlset = routes.map(
  (p) => `<url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p==="/" ? "1.0":"0.7"}</priority></url>`
).join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;
writeFileSync(resolve("dist/sitemap.xml"), xml);
console.log("Sitemap generated.");
