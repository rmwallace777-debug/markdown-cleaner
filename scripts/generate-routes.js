/**
 * Post-build: generate static HTML variants for each SEO route.
 */
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(indexPath, 'utf8');

const baseUrl = 'https://utilitylab.dev/markdown-cleaner';

const routes = {
  default: {
    title: 'Free Markdown Cleaner - Fix & Format Markdown Instantly',
    description: 'Clean messy Markdown, fix heading hierarchy, remove empty links, and normalize formatting. Paste from Notion, Obsidian, or Word and get clean MD.',
    h1: 'Free Markdown Cleaner - Fix & Format Markdown Instantly',
    lead: 'Clean messy Markdown, fix heading hierarchy, remove empty links, and normalize formatting. Paste from Notion, Obsidian, or Word and get clean MD.',
    schemaName: 'Markdown Cleaner',
    schemaDesc: 'Clean messy Markdown, fix heading hierarchy, remove empty links, and normalize formatting. Paste from Notion, Obsidian, or Word and get clean MD.',
    schemaUrl: baseUrl
  }
};

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeText(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildVariantHtml(route) {
  const r = routes[route];
  if (!r) return;

  let out = baseHtml;

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(r.title)}</title>`);
  out = out.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${escapeAttr(r.title)}"`);
  out = out.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeAttr(r.description)}"`);
  out = out.replace(/<link rel="canonical" id="canonical" href="[^"]*"/, `<link rel="canonical" id="canonical" href="${escapeAttr(r.schemaUrl)}"`);
  out = out.replace(/<h1 id="page-title">[\s\S]*?<\/h1>/, `<h1 id="page-title">${escapeText(r.h1)}</h1>`);
  out = out.replace(/<p class="lead" id="page-lead">[\s\S]*?<\/p>/, `<p class="lead" id="page-lead">${escapeText(r.lead)}</p>`);
  out = out.replace(
    /<script type="application\/ld\+json" id="jsonld-schema">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="jsonld-schema">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${escapeText(r.schemaName)}",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "${escapeText(r.schemaDesc)}",
    "url": "${escapeAttr(r.schemaUrl)}"
  }
  </script>`
  );

  return out;
}

for (const [route] of Object.entries(routes)) {
  const outDir = path.join(distDir, route);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'index.html');
  const variantHtml = buildVariantHtml(route);
  if (!variantHtml) {
    console.error(`Failed to build HTML for route: ${route}`);
    process.exit(1);
  }
  fs.writeFileSync(outPath, variantHtml, 'utf8');
  console.log(`Wrote ${outPath}`);
}

console.log('Static route variants generated into dist/<route>/index.html');
