const $ = (sel, ctx = document) => ctx.querySelector(sel);

const routes = {
  default: {
    h1: `Free Markdown Cleaner - Fix & Format Markdown Instantly`,
    title: `Free Markdown Cleaner - Fix & Format Markdown Instantly`,
    desc: `Clean messy Markdown, fix heading hierarchy, remove empty links, and normalize formatting. Paste from Notion, Obsidian, or Word and get clean MD.`,
    keywords: 'Markdown cleaner online, fix messy Markdown, format Markdown free, clean Markdown headings, normalize Markdown syntax'
  }
};

function applyRoute(route) {
  const r = routes[route];
  if (!r) return;
  document.title = r.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', r.desc);
  const elTitle = $('#page-title');
  if (elTitle) elTitle.textContent = r.h1;
  const elLead = $('#page-lead');
  if (elLead) elLead.textContent = r.desc;
  const canonical = $('#canonical');
  if (canonical) canonical.setAttribute('href', window.location.origin + window.location.pathname);
}

applyRoute('default');
