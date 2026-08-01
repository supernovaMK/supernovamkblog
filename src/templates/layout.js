import { site, nav, socials } from '../config.js';
import { url, escapeHtml } from '../helpers.js';
import { icons } from './icons.js';

function socialLinks() {
  return socials
    .map(
      (s) =>
        `<a class="icon-link" href="${escapeHtml(s.url)}" title="${escapeHtml(s.name)}" aria-label="${escapeHtml(s.name)}"${
          s.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
        }>${icons[s.icon] ?? icons.mail}</a>`,
    )
    .join('');
}

function header(active) {
  const links = nav
    .map(
      (item) =>
        `<a href="${url(item.path)}"${active === item.path ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`,
    )
    .join('');

  return `<header class="site-header">
  <div class="shell header-inner">
    <a class="brand" href="${url('/')}">
      <span class="brand-pin">${icons.pin}</span>${escapeHtml(site.title)}
    </a>
    <nav class="site-nav" aria-label="주요 메뉴">
      ${links}
      <button class="theme-toggle" type="button" aria-label="화면 밝기 전환">
        <span class="only-light">${icons.moon}</span><span class="only-dark">${icons.sun}</span>
      </button>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell footer-inner">
    <div class="footer-social">
      ${socialLinks()}
      <a class="icon-link" href="${url('/feed.xml')}" title="RSS" aria-label="RSS 구독">${icons.rss}</a>
    </div>
    <p class="footer-note">© ${new Date().getFullYear()} ${escapeHtml(site.title)} · 손으로 쓰고 마크다운으로 남깁니다</p>
  </div>
</footer>`;
}

/**
 * 모든 페이지가 이 껍데기를 씁니다.
 */
export function layout({
  title,
  description = site.description,
  body,
  active = null,
  bodyClass = '',
  canonical = '/',
  ogType = 'website',
  extraHead = '',
}) {
  const fullTitle = title === site.title ? title : `${title} · ${site.title}`;
  const canonicalUrl = `${site.url.replace(/\/$/, '')}${canonical === '/' ? '/' : `${canonical}/`}`;

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonicalUrl)}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonicalUrl)}">
<meta property="og:site_name" content="${escapeHtml(site.title)}">
<meta name="twitter:card" content="summary">
<link rel="alternate" type="application/rss+xml" title="${escapeHtml(site.title)}" href="${url('/feed.xml')}">
<meta name="theme-color" content="#1a73e8">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%231a73e8' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'/><circle cx='12' cy='9' r='2.6' fill='%23fff'/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${url('/assets/style.css')}">
${extraHead}
<script>
  // 첫 페인트 전에 테마를 정합니다 (화면 깜빡임 방지)
  (function () {
    try {
      var saved = localStorage.getItem('theme');
      var dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    } catch (e) {}
  })();
</script>
</head>
<body class="${bodyClass}">
${header(active)}
<main id="content">
${body}
</main>
${footer()}
<script src="${url('/assets/app.js')}" defer></script>
</body>
</html>
`;
}
