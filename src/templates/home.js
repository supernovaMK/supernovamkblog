import { site, hero, about, now, socials } from '../config.js';
import { url, escapeHtml } from '../helpers.js';
import { layout } from './layout.js';
import { icons } from './icons.js';
import { postItem, emptyState } from './partials.js';
import { renderSkillMap } from './skill-map.js';

const STATUS = {
  active: { label: '진행 중', className: 'is-active' },
  exploring: { label: '살펴보는 중', className: 'is-exploring' },
  paused: { label: '잠시 멈춤', className: 'is-paused' },
};

/* ── 첫 화면: 인사 + 소개 한 덩어리 ─────────────────────── */
function heroCard() {
  const paragraphs = about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  const facts = about.facts
    .map((f) => `<div class="fact"><dt>${escapeHtml(f.k)}</dt><dd>${escapeHtml(f.v)}</dd></div>`)
    .join('');

  const links = socials
    .map(
      (s) =>
        `<a class="btn btn-outline" href="${escapeHtml(s.url)}"${
          s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${icons[s.icon] ?? icons.mail}${escapeHtml(s.name)}</a>`,
    )
    .join('');

  return `<section class="hero-card">
  <p class="hero-eyebrow">${escapeHtml(hero.greeting)}</p>
  <h1 class="hero-name">${escapeHtml(hero.name)}${escapeHtml(hero.suffix)}</h1>
  <p class="hero-tagline">${escapeHtml(hero.tagline)}</p>
  <div class="hero-body">${paragraphs}</div>
  <dl class="fact-grid">${facts}</dl>
  <div class="hero-actions">
    <a class="btn btn-primary" href="${url('/about')}">${icons.article} 더 자세히</a>
    ${links}
  </div>
</section>`;
}

/* ── 왼쪽 블록: 최신 글 ─────────────────────────────────── */
function postsBlock(posts, total) {
  const body = posts.length
    ? `<ul class="post-list">${posts.map((p) => postItem(p)).join('')}</ul>`
    : emptyState(
        '아직 쓴 글이 없습니다.',
        '<code>posts/</code> 폴더에 마크다운 파일을 하나 만들면 여기에 나타납니다.',
      );

  return `<section class="block">
  <div class="block-head">
    <h2 class="block-title">${icons.article} 최신 글</h2>
    <span class="block-aside">${total}개</span>
  </div>
  <div class="block-body">${body}</div>
  <div class="block-foot">
    <a class="btn btn-text" href="${url('/posts')}">전체 보기 ${icons.arrowRight}</a>
  </div>
</section>`;
}

/* ── 오른쪽 블록: 요즘 하는 것 ──────────────────────────── */
function nowBlock() {
  const items = now.items
    .map((item) => {
      const s = STATUS[item.status] ?? STATUS.active;
      return `<li class="now-item ${s.className}">
    <span class="now-status"><span class="dot" aria-hidden="true"></span>${escapeHtml(s.label)}</span>
    <div class="now-body">
      <p class="now-title">${escapeHtml(item.title)}</p>
      <p class="now-detail">${escapeHtml(item.detail)}</p>
    </div>
  </li>`;
    })
    .join('');

  return `<section class="block">
  <div class="block-head">
    <h2 class="block-title">${icons.clock} ${escapeHtml(now.heading)}</h2>
    <span class="block-aside">${escapeHtml(now.updated)} 기준</span>
  </div>
  <div class="block-body"><ul class="now-list">${items}</ul></div>
</section>`;
}

export function renderHome({ posts, total, allPosts = [] }) {
  return layout({
    title: site.title,
    description: site.description,
    active: '/',
    bodyClass: 'page-home',
    canonical: '/',
    body: `<div class="shell shell-wide">
${heroCard()}

<div class="split">
${postsBlock(posts, total)}
${nowBlock()}
</div>

${renderSkillMap({ posts: allPosts })}
</div>`,
  });
}
