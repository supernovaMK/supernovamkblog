/**
 * 로컬 미리보기 서버
 *
 *   npm run dev   →  http://localhost:3000
 *
 * posts/ 나 src/ 파일이 바뀌면 알아서 다시 만듭니다.
 * (개발 중에는 basePath 를 비워서 주소가 짧게 나옵니다)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function build() {
  const res = spawnSync(process.execPath, [path.join(__dirname, 'build.js')], {
    stdio: 'inherit',
    env: { ...process.env, BASE_PATH: '' },
  });
  return res.status === 0;
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let filePath = path.join(DIST, urlPath);

  // 디렉터리면 index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // dist 밖으로 나가는 요청 차단
  if (!path.resolve(filePath).startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  if (!fs.existsSync(filePath)) {
    const notFound = path.join(DIST, '404.html');
    const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found';
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(body);
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(filePath)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
});

build();

server.listen(PORT, () => {
  console.log(`  미리보기: http://localhost:${PORT}`);
  console.log('  (파일을 저장하면 다시 만듭니다. 브라우저는 직접 새로고침해주세요.)\n');
});

// 파일 변경 감시
let pending = null;
for (const dir of ['posts', 'src']) {
  const target = path.join(ROOT, dir);
  if (!fs.existsSync(target)) continue;
  fs.watch(target, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    clearTimeout(pending);
    pending = setTimeout(() => {
      console.log(`\n  변경 감지: ${filename}`);
      build();
    }, 120);
  });
}
