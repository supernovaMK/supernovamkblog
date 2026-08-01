import { url, escapeHtml, shortDate, dayDate } from '../helpers.js';

/**
 * 목록에 들어가는 글 한 줄
 *   compact : 요약을 한 줄로 줄이고 여백을 좁힙니다 (홈에서 씁니다)
 *   dayOnly : 날짜를 '08.01' 로만 (연도별 목록처럼 연도가 이미 보일 때)
 */
export function postItem(post, { compact = false, dayOnly = false } = {}) {
  const tags = post.tags
    .slice(0, compact ? 2 : 3)
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');

  // data-search / data-tags 는 목록 페이지의 검색·필터가 사용합니다
  const haystack = [post.title, post.summary, ...post.tags].join(' ').toLowerCase();

  const dateText = dayOnly ? dayDate(post.date) : shortDate(post.date);

  // 촘촘한 목록에서는 태그 줄을 없애고 읽는 시간을 날짜 옆에 붙입니다
  const meta = compact
    ? ''
    : `<span class="post-meta">${tags}<span class="reading-time">${post.readingTime}분</span></span>`;

  return `<li class="post-item${compact ? ' is-compact' : ''}" data-search="${escapeHtml(haystack)}" data-tags="${escapeHtml(post.tags.join('|'))}">
  <a class="post-link" href="${url(post.permalink)}">
    <time class="post-date" datetime="${post.date}">${dateText}${
      compact ? `<span class="post-dot">·</span>${post.readingTime}분` : ''
    }</time>
    <span class="post-body">
      <span class="post-title">${escapeHtml(post.title)}</span>
      ${post.summary ? `<span class="post-summary">${escapeHtml(post.summary)}</span>` : ''}
      ${meta}
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
export function emptyState(message) {
  return `<div class="empty"><p class="empty-title">${escapeHtml(message)}</p></div>`;
}
