import { site, hero, now, socials, archive } from '../config.js';
import { url, escapeHtml, year } from '../helpers.js';
import { renderInline } from '../markdown.js';
import { layout } from './layout.js';
import { icons } from './icons.js';
import { postItem, emptyState } from './partials.js';
import { commitChip } from './log.js';

/** 주소가 채워진 소셜만 남깁니다 */
function activeSocials() {
  return socials.filter((s) => s.url && s.url.trim());
}

/* ── 첫 화면: 인사 + 사진 ───────────────────────────────── */
function heroCard(photo) {
  const links = activeSocials()
    .map(
      (s) =>
        `<a class="icon-btn" href="${escapeHtml(s.url)}" title="${escapeHtml(s.name)}" aria-label="${escapeHtml(s.name)}"${
          s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${icons[s.icon] ?? icons.mail}</a>`,
    )
    .join('');

  // photo: 파일경로 → 사진 / 'initial' → 이름 첫 글자 / '' → 안 보임
  let avatar = '';
  if (photo === 'initial') {
    avatar = `<span class="avatar avatar-initial" aria-hidden="true">${escapeHtml([...hero.name][0] ?? '')}</span>`;
  } else if (photo) {
    avatar = `<img class="avatar" src="${url(photo)}" alt="${escapeHtml(hero.photoAlt || hero.name)}" width="132" height="132">`;
  }

  return `<section class="hero-card${avatar ? '' : ' is-solo'}">
  <svg class="card-run" aria-hidden="true" focusable="false">
    <rect class="card-run-line" x="0" y="0" width="100%" height="100%" rx="10" ry="10" pathLength="100"/>
  </svg>
  <div class="hero-text">
    <p class="hero-eyebrow">${escapeHtml(hero.greeting)}</p>
    <h1 class="hero-name">${escapeHtml(hero.name)}${escapeHtml(hero.suffix)}</h1>
    <p class="hero-tagline">${escapeHtml(hero.tagline)}</p>
    ${hero.intro ? `<p class="hero-intro">${escapeHtml(hero.intro)}</p>` : ''}
    <div class="hero-actions">
      <a class="btn btn-primary" href="${url('/about')}">더 자세히 알아보기</a>
      <span class="icon-btns">${links}</span>
    </div>
  </div>
  ${avatar ? `<div class="hero-photo">${avatar}</div>` : ''}
</section>`;
}

/* ── 왼쪽 블록: 최신 글 ─────────────────────────────────── */
function postsBlock(posts, total) {
  const body = posts.length
    ? `<ul class="post-list">${posts.map((p) => postItem(p, { compact: true })).join('')}</ul>`
    : emptyState('아직 쓴 글이 없습니다.');

  return `<section class="block">
  <div class="block-head">
    <h2 class="block-title">${icons.article} 최신 글</h2>
    ${total ? `<span class="block-aside">${total}개</span>` : ''}
  </div>
  <div class="block-body">${body}</div>
  ${
    total > posts.length
      ? `<div class="block-foot"><a class="btn btn-text" href="${url('/posts')}">전체 보기 ${icons.arrowRight}</a></div>`
      : ''
  }
</section>`;
}

/* ── 오른쪽 블록: 요즘 하는 것 ──────────────────────────── */
function nowBlock() {
  return `<section class="block">
  <div class="block-head">
    <h2 class="block-title">${icons.clock} ${escapeHtml(now.heading)}</h2>
    ${commitChip()}
  </div>
  <div class="block-body">
    <div class="now-md">${renderInline(now.body)}</div>
  </div>
</section>`;
}

/* ── 아래: 연도별로 쭉 나열 ─────────────────────────────── */
function archiveSection(posts) {
  // 글이 없어도 자리는 보여줍니다 (여기에 쌓인다는 걸 알 수 있게)
  if (!posts.length) {
    return `<section class="archive">
  <h2 class="archive-heading">${escapeHtml(archive.heading)}</h2>
  ${emptyState('글을 올리면 연도별로 여기에 쌓입니다.')}
</section>`;
  }

  const groups = new Map();
  for (const p of posts) {
    const y = year(p.date);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y).push(p);
  }

  const entries = [...groups.entries()];
  if (!archive.newestFirst) entries.reverse();

  const years = entries
    .map(
      ([y, list]) => `<section class="archive-year">
  <h3 class="archive-mark">${y}<span class="archive-count">${list.length}</span></h3>
  <ul class="post-list">${list.map((p) => postItem(p, { compact: true, dayOnly: true })).join('')}</ul>
</section>`,
    )
    .join('');

  return `<section class="archive">
  <h2 class="archive-heading">${escapeHtml(archive.heading)}</h2>
  ${years}
</section>`;
}

export function renderHome({ posts, total, allPosts = [], heroPhoto = '' }) {
  return layout({
    title: site.title,
    description: site.description,
    active: '/',
    bodyClass: 'page-home',
    canonical: '/',
    body: `<div class="shell shell-wide">
${heroCard(heroPhoto)}

<div class="split">
${postsBlock(posts, total)}
${nowBlock()}
</div>

${archiveSection(allPosts)}
</div>`,
  });
}
