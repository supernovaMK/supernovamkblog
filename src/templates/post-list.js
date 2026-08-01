import { url, escapeHtml, year } from '../helpers.js';
import { layout } from './layout.js';
import { icons } from './icons.js';
import { postItem, emptyState } from './partials.js';

function groupByYear(posts) {
  const groups = new Map();
  for (const p of posts) {
    const y = year(p.date);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y).push(p);
  }
  return [...groups.entries()];
}

function tagBar(posts) {
  const counts = new Map();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  if (!counts.size) return '';

  const chips = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(
      ([tag, n]) =>
        `<button class="chip" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}<span class="chip-count">${n}</span></button>`,
    )
    .join('');

  return `<div class="tag-bar" role="group" aria-label="태그로 걸러보기">
  <button class="chip is-on" type="button" data-tag="">전체<span class="chip-count">${posts.length}</span></button>
  ${chips}
</div>`;
}

export function renderPostList({ posts }) {
  const body = posts.length
    ? groupByYear(posts)
        .map(
          ([y, list]) => `<section class="year-group" data-year="${y}">
  <h2 class="year-mark">${y}<span class="year-count">${list.length}</span></h2>
  <ul class="post-list">${list.map((p) => postItem(p)).join('')}</ul>
</section>`,
        )
        .join('')
    : emptyState(
        '아직 쓴 글이 없습니다.',
        '터미널에서 <code>npm run new "첫 글"</code> 을 실행해보세요.',
      );

  return layout({
    title: '글',
    description: '지금까지 쓴 글 목록',
    active: '/posts',
    bodyClass: 'page-posts',
    canonical: '/posts',
    body: `<div class="shell">
  <div class="page-head">
    <span class="section-label">WRITING</span>
    <h1 class="page-title">글</h1>
    <p class="page-desc">${posts.length}개의 글이 있습니다.</p>
  </div>

  ${posts.length ? `<div class="filters">
    <label class="search">
      ${icons.search}
      <input type="search" id="post-search" placeholder="제목·요약·태그로 찾기" autocomplete="off">
    </label>
    ${tagBar(posts)}
  </div>
  <p class="no-result" hidden>찾는 글이 없습니다.</p>` : ''}

  <div id="post-groups">${body}</div>
</div>`,
  });
}
