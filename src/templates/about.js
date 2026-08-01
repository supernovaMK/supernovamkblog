import { about, hero, socials } from '../config.js';
import { escapeHtml } from '../helpers.js';
import { renderInline } from '../markdown.js';
import { layout } from './layout.js';
import { icons } from './icons.js';

export function renderAbout() {
  const facts = about.facts
    .map((f) => `<div class="fact"><dt>${escapeHtml(f.k)}</dt><dd>${escapeHtml(f.v)}</dd></div>`)
    .join('');

  const links = socials
    .filter((s) => s.url && s.url.trim())
    .map(
      (s) =>
        `<a class="contact-link" href="${escapeHtml(s.url)}"${
          s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${icons[s.icon] ?? icons.mail}<span>${escapeHtml(s.name)}</span></a>`,
    )
    .join('');

  return layout({
    title: '소개',
    description: about.paragraphs[0] ?? '',
    active: '/about',
    bodyClass: 'page-about',
    canonical: '/about',
    body: `<div class="shell">
  <div class="page-head">
    <span class="section-label">${escapeHtml(about.label)}</span>
    <h1 class="page-title">${escapeHtml(about.heading)}</h1>
    <p class="page-desc">${escapeHtml(hero.tagline)}</p>
  </div>

  <div class="card about-card">
    <div class="about-text">${about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
    <dl class="fact-grid">${facts}</dl>
  </div>

  <div class="prose about-longform">${renderInline(about.longform)}</div>

  <section class="section">
    <span class="section-label">CONTACT</span>
    <h2 class="section-title">연락은 이쪽으로</h2>
    <div class="contact-links">${links}</div>
  </section>
</div>`,
  });
}
