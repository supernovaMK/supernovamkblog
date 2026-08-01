import { url, escapeHtml, shortDate, formatDate } from '../helpers.js';

/** 목록에 들어가는 글 한 줄 */
export function postItem(post, { showYear = false } = {}) {
  const tags = post.tags
    .slice(0, 3)
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');

  // data-search / data-tags 는 목록 페이지의 검색·필터가 사용합니다
  const haystack = [post.title, post.summary, ...post.tags].join(' ').toLowerCase();

  return `<li class="post-item" data-search="${escapeHtml(haystack)}" data-tags="${escapeHtml(post.tags.join('|'))}">
  <a class="post-link" href="${url(post.permalink)}">
    <time class="post-date" datetime="${post.date}">${showYear ? formatDate(post.date) : shortDate(post.date)}</time>
    <span class="post-body">
      <span class="post-title">${escapeHtml(post.title)}</span>
      ${post.summary ? `<span class="post-summary">${escapeHtml(post.summary)}</span>` : ''}
      <span class="post-meta">${tags}<span class="reading-time">${post.readingTime}분</span></span>
    </span>
  </a>
</li>`;
}

/** 섹션 머리말 — 작은 영문 라벨 + 한글 제목 */
export function sectionHead(label, heading, aside = '') {
  return `<div class="section-head">
  <span class="section-label">${escapeHtml(label)}</span>
  <h2 class="section-title">${escapeHtml(heading)}</h2>
  ${aside ? `<div class="section-aside">${aside}</div>` : ''}
</div>`;
}

/** 글이 하나도 없을 때 */
export function emptyState(message, hint = '') {
  return `<div class="empty">
  <p class="empty-title">${escapeHtml(message)}</p>
  ${hint ? `<p class="empty-hint">${hint}</p>` : ''}
</div>`;
}
