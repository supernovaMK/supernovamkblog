import { url, escapeHtml, formatDate } from '../helpers.js';
import { site } from '../config.js';
import { layout } from './layout.js';
import { icons } from './icons.js';

function toc(items) {
  if (items.length < 3) return ''; // 짧은 글엔 목차가 오히려 방해됩니다
  const links = items
    .map(
      (h) =>
        `<li class="toc-${h.depth}"><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`,
    )
    .join('');
  return `<aside class="toc" aria-label="목차">
  <p class="toc-label">목차</p>
  <ul>${links}</ul>
</aside>`;
}

function neighbor(post, direction) {
  if (!post) return '<span></span>';
  const isPrev = direction === 'prev';
  return `<a class="neighbor ${isPrev ? 'neighbor-prev' : 'neighbor-next'}" href="${url(post.permalink)}">
  <span class="neighbor-label">${isPrev ? `${icons.arrowLeft} 이전 글` : `다음 글 ${icons.arrowRight}`}</span>
  <span class="neighbor-title">${escapeHtml(post.title)}</span>
</a>`;
}

export function renderPost({ post, prev, next }) {
  const tags = post.tags.length
    ? `<div class="post-tags">${post.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    url: `${site.url.replace(/\/$/, '')}${post.permalink}/`,
  };

  return layout({
    title: post.title,
    description: post.summary,
    active: '/posts',
    bodyClass: 'page-post',
    canonical: post.permalink,
    ogType: 'article',
    extraHead: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    body: `<div class="shell">
  <article class="article">
    <header class="article-head">
      <div class="article-meta">
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <span class="dot-sep">·</span>
        <span>${post.readingTime}분 읽기</span>
      </div>
      <h1 class="article-title">${escapeHtml(post.title)}</h1>
      ${post.summary ? `<p class="article-summary">${escapeHtml(post.summary)}</p>` : ''}
      ${tags}
    </header>

    ${toc(post.toc)}

    <div class="prose">
${post.html}
    </div>
  </article>

  <nav class="neighbors" aria-label="다른 글">
    ${neighbor(prev, 'prev')}
    ${neighbor(next, 'next')}
  </nav>

  <p class="back-link"><a class="text-link" href="${url('/posts')}">${icons.arrowLeft} 글 목록으로</a></p>
</div>`,
  });
}
