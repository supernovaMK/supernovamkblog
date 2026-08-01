import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

import { slugify, escapeHtml } from './helpers.js';

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
  {
    gfm: true,
    breaks: true, // 엔터 한 번으로 줄바꿈 (한국어 글쓰기에 편합니다)
  },
);

/**
 * 마크다운 → HTML.
 * h2·h3 에는 id 를 붙이고, 목차(toc)로 모아서 함께 돌려줍니다.
 */
export function renderMarkdown(markdown) {
  let html = marked.parse(markdown);
  const toc = [];
  const used = new Map();

  html = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (_all, depth, attrs = '', inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let id = slugify(text) || `section-${toc.length + 1}`;
    if (used.has(id)) {
      const n = used.get(id) + 1;
      used.set(id, n);
      id = `${id}-${n}`;
    } else {
      used.set(id, 1);
    }
    toc.push({ depth: Number(depth), text, id });
    return `<h${depth} id="${id}"${attrs}><a class="anchor" href="#${id}" aria-label="${escapeHtml(text)} 링크">#</a>${inner}</h${depth}>`;
  });

  // 코드 블록에 복사 버튼을 달기 위한 표시
  html = html.replace(/<pre><code/g, '<pre data-code-block><code');

  // 바깥 링크는 새 탭으로
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return { html, toc };
}

/** 설정 파일 안의 짧은 마크다운(소개글 등)을 렌더링할 때 씁니다. */
export function renderInline(markdown = '') {
  return marked.parse(String(markdown).trim());
}
