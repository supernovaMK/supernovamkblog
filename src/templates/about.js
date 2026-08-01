import { about, hero, socials } from '../config.js';
import { escapeHtml } from '../helpers.js';
import { renderInline } from '../markdown.js';
import { layout } from './layout.js';
import { icons } from './icons.js';

/** 이름만 굵게 — '개발자 김민기입니다.' 에서 이름 부분에 표시를 넣습니다 */
function headline() {
  const text = about.headline;
  const name = hero.name;
  if (!name || !text.includes(name)) return escapeHtml(text);

  const [before, ...rest] = text.split(name);
  return `${escapeHtml(before)}<strong>${escapeHtml(name)}</strong>${escapeHtml(rest.join(name))}`;
}

function socialRow() {
  return socials
    .filter((s) => s.url && s.url.trim())
    .map(
      (s) =>
        `<a class="icon-btn" href="${escapeHtml(s.url)}" title="${escapeHtml(s.name)}" aria-label="${escapeHtml(s.name)}"${
          s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${icons[s.icon] ?? icons.mail}</a>`,
    )
    .join('');
}

/** 날짜가 붙은 목록 한 줄 */
function itemRow(item) {
  const name = item.link
    ? `<a class="about-item-name is-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)} ${icons.arrowRight}</a>`
    : `<span class="about-item-name">${escapeHtml(item.name)}</span>`;

  return `<li class="about-item">
  <div class="about-item-main">
    ${name}
    ${item.detail ? `<p class="about-item-detail">${escapeHtml(item.detail)}</p>` : ''}
  </div>
  ${item.period ? `<span class="about-period">${escapeHtml(item.period)}</span>` : ''}
</li>`;
}

function section(sec) {
  const body = sec.body
    ? `<div class="about-body prose">${renderInline(sec.body)}</div>`
    : `<ul class="about-list">${(sec.items ?? []).map(itemRow).join('')}</ul>`;

  return `<section class="about-section">
  <h2 class="about-heading">
    ${sec.emoji ? `<span class="about-emoji" aria-hidden="true">${escapeHtml(sec.emoji)}</span>` : ''}
    ${escapeHtml(sec.title)}
  </h2>
  ${body}
</section>`;
}

export function renderAbout() {
  const intro = about.sections.find((s) => s.body)?.body ?? '';

  return layout({
    title: '소개',
    description: intro.trim().split('\n')[0] || hero.tagline,
    active: '/about',
    bodyClass: 'page-about',
    canonical: '/about',
    body: `<div class="shell">
  <header class="about-head">
    <p class="about-greeting">${escapeHtml(about.greeting)}</p>
    <h1 class="about-headline">${headline()}</h1>
    <div class="about-socials">${socialRow()}</div>
  </header>

  ${about.sections.map(section).join('')}
</div>`,
  });
}
