import { site } from './config.js';

/** 내부 링크에 basePath 를 붙여줍니다. url('/posts') → '/supernovamkblog/posts/' */
export function url(routePath = '/') {
  const base = site.basePath.replace(/\/$/, '');
  if (routePath === '/') return `${base}/`;
  const clean = `/${routePath.replace(/^\/+/, '')}`;
  // 파일(.xml, .json …)은 슬래시를 붙이지 않습니다
  const trailing = /\.[a-z0-9]+$/i.test(clean) ? '' : '/';
  return `${base}${clean.replace(/\/$/, '')}${trailing}`;
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** '2026-08-01' → '2026년 8월 1일' */
export function formatDate(date) {
  const [y, m, d] = String(date).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return String(date);
  return `${y}년 ${m}월 ${d}일`;
}

/** '2026-08-01' → '26.08.01' (목록에서 쓰는 짧은 표기) */
export function shortDate(date) {
  const [y, m, d] = String(date).slice(0, 10).split('-');
  return `${y.slice(2)}.${m}.${d}`;
}

/** '2026-08-01' → '08.01' (연도가 이미 위에 적혀 있을 때) */
export function dayDate(date) {
  const [, m, d] = String(date).slice(0, 10).split('-');
  return `${m}.${d}`;
}

export function year(date) {
  return String(date).slice(0, 4);
}

/** 한글은 분당 약 500자, 영문은 분당 약 220단어로 잡습니다. */
export function readingTime(text) {
  const plain = text.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`\[\]()_-]/g, ' ');
  const korean = (plain.match(/[ㄱ-힝]/g) || []).length;
  const words = (plain.match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = Math.ceil(korean / 500 + words / 220);
  return Math.max(1, minutes);
}

/** 요약이 없을 때 본문 앞부분을 잘라 씁니다. */
export function excerpt(markdown, length = 110) {
  const plain = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > length ? `${plain.slice(0, length).trim()}…` : plain;
}

/** 제목/파일명을 URL 에 쓸 수 있는 형태로 바꿉니다. 한글은 그대로 둡니다. */
export function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
