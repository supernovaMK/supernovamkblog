/**
 * 새 글 만들기
 *
 *   npm run new "글 제목"
 *   npm run new "글 제목" -- --slug my-first-post
 *
 * posts/ 폴더에 오늘 날짜가 붙은 마크다운 파일을 만들어줍니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '..', 'posts');

const args = process.argv.slice(2);
const slugFlag = args.indexOf('--slug');
const customSlug = slugFlag !== -1 ? args[slugFlag + 1] : null;
const title = args.filter((a, i) => !a.startsWith('--') && i !== slugFlag + 1).join(' ').trim();

if (!title) {
  console.error('\n  글 제목이 필요합니다.\n');
  console.error('    npm run new "첫 글을 씁니다"\n');
  process.exit(1);
}

const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }); // YYYY-MM-DD
const slug = slugify(customSlug ?? title) || 'untitled';
const filename = `${today}-${slug}.md`;
const filePath = path.join(POSTS_DIR, filename);

if (fs.existsSync(filePath)) {
  console.error(`\n  이미 있는 파일입니다: posts/${filename}\n`);
  process.exit(1);
}

const template = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${today}
summary: ""
tags: []
draft: true
---

여기에 글을 씁니다.

<!--
  ↑ frontmatter 설명
  title   : 글 제목
  date    : 발행일 (YYYY-MM-DD)
  summary : 목록에 보일 한두 줄 요약. 비워두면 본문 앞부분을 자동으로 씁니다.
  tags    : ["회고", "javascript"] 처럼 적습니다.
  draft   : true 면 아직 공개되지 않습니다. 다 쓰고 나서 false 로 바꾸거나 이 줄을 지우세요.

  이미지는 posts/images/ 에 넣고  ![설명](/images/파일이름.png)  으로 부릅니다.
-->
`;

fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(filePath, template);

console.log(`\n  만들었습니다:  posts/${filename}`);
console.log(`  주소는 나중에  /posts/${slug}  가 됩니다.`);
console.log(`\n  아직 draft: true 상태라 사이트에는 안 보입니다.`);
console.log(`  다 쓰면 draft 줄을 지우고  npm run build  하세요.\n`);
