import { updates } from '../config.js';
import { url, escapeHtml, formatDate } from '../helpers.js';
import { renderInline } from '../markdown.js';
import { layout } from './layout.js';
import { icons } from './icons.js';

/**
 * 항목마다 짧은 식별자를 만듭니다 (깃 커밋 해시처럼 보이게).
 * 같은 내용이면 항상 같은 값이 나오도록 계산식으로만 만듭니다.
 */
export function shortHash(item) {
  const seed = `${item.date}${item.title}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0').slice(0, 7);
}

/** '2026-08-01' → '2026.08.01' */
export function dotDate(date) {
  return String(date).slice(0, 10).replace(/-/g, '.');
}

/** 최신순으로 정렬한 목록 */
export function sortedUpdates() {
  return [...updates.items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/**
 * 홈의 '최근 하고 있는 것' 머리에 붙는 커밋 버튼.
 * 활동을 하나 추가할 때마다 해시와 날짜가 같이 바뀝니다.
 */
export function commitChip() {
  const latest = sortedUpdates()[0];
  if (!latest) return '';

  return `<a class="commit-chip" href="${url('/log')}" title="활동 기록 보기">
  ${icons.gitCommit}
  <span class="commit-hash">${shortHash(latest)}</span>
  <span class="commit-when" data-date="${latest.date}">${dotDate(latest.date)}</span>
</a>`;
}

export function renderLog() {
  const items = sortedUpdates();

  const list = items.length
    ? items
        .map(
          (item) => `<li class="commit">
  <div class="commit-rail" aria-hidden="true"><span class="commit-dot"></span></div>
  <div class="commit-card">
    <div class="commit-meta">
      <time class="commit-date" datetime="${item.date}">${dotDate(item.date)}</time>
      <span class="commit-sha">${shortHash(item)}</span>
    </div>
    <h2 class="commit-title">${escapeHtml(item.title)}</h2>
    <div class="commit-body prose">${renderInline(item.body)}</div>
  </div>
</li>`,
        )
        .join('')
    : `<li class="commit"><div class="commit-card"><p class="empty-title">아직 기록이 없습니다.</p></div></li>`;

  return layout({
    title: updates.heading,
    description: updates.description,
    active: '/log',
    bodyClass: 'page-log',
    canonical: '/log',
    body: `<div class="shell">
  <div class="page-head">
    <span class="section-label">LOG</span>
    <h1 class="page-title">${escapeHtml(updates.heading)}</h1>
    <p class="page-desc">${escapeHtml(updates.description)}</p>
  </div>

  <ol class="commit-list">${list}</ol>
</div>`,
  });
}
