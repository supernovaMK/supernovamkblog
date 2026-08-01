/**
 * 빌드 스크립트
 * posts/*.md 를 읽어서 dist/ 에 정적 사이트를 만듭니다.
 *
 *   npm run build
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

import { site, HOME_POST_COUNT } from './config.js';
import { renderMarkdown } from './markdown.js';
import { url, escapeHtml, formatDate, readingTime, slugify, excerpt } from './helpers.js';
import { renderHome } from './templates/home.js';
import { renderPostList } from './templates/post-list.js';
import { renderPost } from './templates/post.js';
import { renderAbout } from './templates/about.js';
import { renderNotFound } from './templates/not-found.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const DIST = path.join(ROOT, 'dist');

/* ─────────────────────────── 글 읽어오기 ─────────────────────────── */

/**
 * frontmatter 의 date 를 'YYYY-MM-DD' 로 맞춥니다.
 * YAML 은 따옴표 없는 2026-08-01 을 Date 객체로 바꿔버리기 때문에 한 번 걸러줍니다.
 */
function normalizeDate(value) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  const str = String(value).trim();
  return /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10) : '';
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'));

  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) {
      console.log(`  · 초안 건너뜀: ${file}`);
      continue;
    }

    // 파일명 규칙: 2026-08-01-my-post.md  →  날짜 + slug
    const m = file.replace(/\.md$/, '').match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    const dateFromName = m?.[1];
    const slugFromName = m?.[2] ?? file.replace(/\.md$/, '');

    const date = normalizeDate(data.date) || dateFromName || '';
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
      console.warn(
        `  ! 날짜를 못 찾았습니다: ${file} — 파일명을 2026-08-01-제목.md 형태로 하거나 frontmatter 에 date 를 적어주세요.`,
      );
      continue;
    }

    const { html, toc } = renderMarkdown(content);
    const slug = slugify(data.slug ?? slugFromName);

    posts.push({
      slug,
      title: String(data.title ?? slugFromName),
      date,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      summary: String(data.summary ?? '').trim() || excerpt(content),
      html,
      toc,
      readingTime: readingTime(content),
      permalink: `/posts/${slug}`,
      sourceFile: file,
    });
  }

  // 최신순
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) {
      console.warn(`  ! 주소가 겹칩니다: /posts/${p.slug} (${p.sourceFile})`);
    }
    seen.add(p.slug);
  }

  return posts;
}

/* ─────────────────────────── 파일 쓰기 ─────────────────────────── */

function writePage(routePath, html) {
  // '/posts/hello' → dist/posts/hello/index.html
  const clean = routePath.replace(/^\/+|\/+$/g, '');
  const dir = clean ? path.join(DIST, clean) : DIST;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

/* ─────────────────────── 부가 파일 (RSS·사이트맵) ─────────────────────── */

function buildFeed(posts) {
  const base = site.url.replace(/\/$/, '');
  const items = posts
    .slice(0, 20)
    .map(
      (p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${base}${p.permalink}</link>
      <guid isPermaLink="true">${base}${p.permalink}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00+09:00`).toUTCString()}</pubDate>
      <description>${escapeHtml(p.summary)}</description>
    </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(site.title)}</title>
    <link>${base}</link>
    <description>${escapeHtml(site.description)}</description>
    <language>${site.lang}</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

function buildSitemap(posts) {
  const base = site.url.replace(/\/$/, '');
  const routes = ['/', '/posts', '/about', ...posts.map((p) => p.permalink)];
  const urls = routes
    .map((r) => `  <url><loc>${base}${r === '/' ? '' : r}/</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/* ─────────────────────────── 실행 ─────────────────────────── */

function build() {
  const started = Date.now();
  console.log('\n  블로그를 만드는 중…\n');

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const posts = loadPosts();

  // 정적 자산
  copyDir(path.join(__dirname, 'assets'), path.join(DIST, 'assets'));
  copyDir(path.join(POSTS_DIR, 'images'), path.join(DIST, 'images'));

  // 페이지
  writePage(
    '/',
    renderHome({
      posts: posts.slice(0, HOME_POST_COUNT),
      total: posts.length,
      allPosts: posts, // 스킬 맵이 지점을 실제 글에 연결할 때 씁니다
    }),
  );
  writePage('/posts', renderPostList({ posts }));
  writePage('/about', renderAbout());
  for (const [i, post] of posts.entries()) {
    writePage(post.permalink, renderPost({
      post,
      prev: posts[i + 1] ?? null, // 더 오래된 글
      next: posts[i - 1] ?? null, // 더 최신 글
    }));
  }

  // 검색·태그 필터가 쓰는 데이터
  fs.writeFileSync(
    path.join(DIST, 'posts.json'),
    JSON.stringify(
      posts.map(({ slug, title, date, tags, summary, readingTime, permalink }) => ({
        slug, title, date, tags, summary, readingTime,
        permalink: url(permalink),
        dateLabel: formatDate(date),
      })),
      null,
      2,
    ),
  );

  fs.writeFileSync(path.join(DIST, 'feed.xml'), buildFeed(posts));
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(posts));
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url.replace(/\/$/, '')}/sitemap.xml\n`);
  // GitHub Pages 가 폴더를 Jekyll 로 처리하지 않도록
  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
  // 없는 주소로 들어왔을 때
  fs.writeFileSync(path.join(DIST, '404.html'), renderNotFound());

  console.log(`  글 ${posts.length}개 · ${Date.now() - started}ms`);
  console.log(`  → dist/ 에 만들어졌습니다.\n`);
}

build();
