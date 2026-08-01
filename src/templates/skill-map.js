import { skillMap } from '../config.js';
import { url, escapeHtml } from '../helpers.js';
import { icons } from './icons.js';

/* 지도 격자 — 도로가 놓이는 자리입니다. config.js 의 지점 좌표도 여기에 맞춰져 있습니다.
   왼쪽 x≈450 까지는 패널에 가려지는 자리라 경로를 그 오른쪽에 둡니다. */
const XS = [90, 190, 300, 400, 490, 640, 740, 840, 950, 1060, 1150];
const YS = [80, 140, 200, 270, 360, 440, 520, 590];

const VIEW_W = 1240;
const VIEW_H = 640;
const WATER_X = 1170; // 이 선부터 오른쪽은 바다

const MAJOR_ROWS = [270]; // 굵은 가로도로
const MAJOR_COLS = [300, 950]; // 굵은 세로도로

/* 공원 — [x1, x2, y1, y2] */
const PARKS = [
  [400, 490, 440, 520],
  [740, 840, 80, 140],
  [190, 300, 270, 360],
  [950, 1060, 440, 520],
];

/** 글자 폭 어림잡기 (한글은 넓고 영문은 좁습니다) */
function textWidth(str, size = 13) {
  let w = 0;
  for (const ch of String(str)) w += /[가-힣ㄱ-ㅎ]/.test(ch) ? size : size * 0.56;
  return w;
}

function inPark(x1, x2, y1, y2) {
  return PARKS.some(([px1, px2, py1, py2]) => x1 < px2 && x2 > px1 && y1 < py2 && y2 > py1);
}

/* ── 지도 바탕 ───────────────────────────────────────────── */

function drawBlocks() {
  const out = [];
  for (let i = 0; i < XS.length - 1; i += 1) {
    for (let j = 0; j < YS.length - 1; j += 1) {
      // 규칙적이면서도 성기게 — 매번 같은 모양이 나오도록 계산식으로 정합니다
      if ((i * 7 + j * 13) % 3 === 0) continue;
      const x1 = XS[i];
      const x2 = Math.min(XS[i + 1], WATER_X);
      const y1 = YS[j];
      const y2 = YS[j + 1];
      if (x2 - x1 < 30 || inPark(x1, x2, y1, y2)) continue;
      out.push(
        `<rect class="map-blockshape" x="${x1 + 7}" y="${y1 + 7}" width="${x2 - x1 - 14}" height="${y2 - y1 - 14}" rx="3"/>`,
      );
    }
  }
  return out.join('');
}

function drawParks() {
  return PARKS.map(
    ([x1, x2, y1, y2]) =>
      `<rect class="map-park" x="${x1 + 5}" y="${y1 + 5}" width="${x2 - x1 - 10}" height="${y2 - y1 - 10}" rx="6"/>`,
  ).join('');
}

function drawWater() {
  // 물결치는 해안선
  return `<path class="map-water" d="M ${WATER_X} 0
    C ${WATER_X + 26} 90, ${WATER_X - 22} 170, ${WATER_X + 14} 250
    C ${WATER_X + 42} 330, ${WATER_X - 10} 420, ${WATER_X + 20} 500
    C ${WATER_X + 40} 570, ${WATER_X + 4} 610, ${WATER_X + 16} ${VIEW_H}
    L ${VIEW_W} ${VIEW_H} L ${VIEW_W} 0 Z"/>`;
}

function roadPaths() {
  const lines = [];
  for (const y of YS) lines.push({ d: `M 24 ${y} H ${WATER_X - 4}`, major: MAJOR_ROWS.includes(y) });
  for (const x of XS) lines.push({ d: `M ${x} 34 V ${VIEW_H - 24}`, major: MAJOR_COLS.includes(x) });
  // 곡선 간선도로 하나 — 격자만 있으면 심심해서
  lines.push({ d: `M 24 448 Q 380 492 740 436 T ${WATER_X - 6} 470`, major: true });
  return lines;
}

function drawRoads() {
  const lines = roadPaths();
  const edges = lines
    .map((l) => `<path class="map-road-edge" d="${l.d}" stroke-width="${l.major ? 15 : 10}"/>`)
    .join('');
  const fills = lines
    .map(
      (l) =>
        `<path class="${l.major ? 'map-road-major' : 'map-road'}" d="${l.d}" stroke-width="${l.major ? 12 : 7}"/>`,
    )
    .join('');
  return edges + fills;
}

function drawAreaLabels() {
  return skillMap.areas
    .map(
      (a) =>
        `<text class="map-area-label" x="${a.x}" y="${a.y}">${escapeHtml(a.name)}</text>`,
    )
    .join('');
}

/* ── 경로와 지점 ─────────────────────────────────────────── */

function routeD(nodes) {
  return nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');
}

function drawPin(x, y) {
  const s = 1.7;
  // 24×24 좌표계의 핀을 끝점이 (x, y) 에 오도록 옮깁니다
  return `<g transform="translate(${x - 12 * s} ${y - 22 * s}) scale(${s})">
    <path class="map-pin" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle class="map-pin-inner" cx="12" cy="9" r="2.6"/>
  </g>`;
}

function drawNodes(nodes) {
  return nodes
    .map((n, i) => {
      const isLast = i === nodes.length - 1;
      const w = textWidth(n.label) + 22;
      const labelY = isLast ? n.y + 16 : n.y + 18;

      const marker = isLast
        ? drawPin(n.x, n.y)
        : `<circle class="node-dot" cx="${n.x}" cy="${n.y}" r="9"/>`;

      return `<g class="map-node${isLast ? ' is-selected' : ''}" data-node="${escapeHtml(n.id)}"
        data-x="${n.x}" data-y="${n.y}"
        role="button" tabindex="0" aria-label="${escapeHtml(n.label)}">
      <circle class="node-hit" cx="${n.x}" cy="${n.y}" r="22" fill="transparent"/>
      ${marker}
      <rect class="node-label-box" x="${n.x - w / 2}" y="${labelY}" width="${w}" height="26" rx="13"/>
      <text class="node-label-text" x="${n.x}" y="${labelY + 18}">${escapeHtml(n.label)}</text>
    </g>`;
    })
    .join('');
}

function drawBadge(nodes) {
  if (nodes.length < 2) return '';
  const mid = Math.floor((nodes.length - 1) / 2);
  const a = nodes[mid];
  const b = nodes[mid + 1];
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2;
  const label = `${nodes.length}단계`;
  const w = textWidth(label, 12) + 20;
  return `<g class="route-badge" transform="translate(${cx} ${cy - 34})">
    <rect class="route-badge-box" x="${-w / 2}" y="-13" width="${w}" height="26" rx="6"/>
    <text class="route-badge-text" x="0" y="5">${escapeHtml(label)}</text>
  </g>`;
}

/* ── 왼쪽 패널 ───────────────────────────────────────────── */

function panel(nodes) {
  const steps = nodes
    .map((n, i) => {
      const haystack = [n.label, n.title, ...n.tech].join(' ').toLowerCase();
      return `<li>
    <button class="map-step${i === nodes.length - 1 ? ' is-selected' : ''}" type="button"
            data-step="${escapeHtml(n.id)}" data-search="${escapeHtml(haystack)}">
      <span class="map-step-num">${i + 1}</span>
      <span>${escapeHtml(n.label)}</span>
    </button>
  </li>`;
    })
    .join('');

  // 카드를 미리 다 그려두고 보이기/숨기기만 합니다.
  // 이러면 자바스크립트가 꺼져 있어도 도착지 정보는 그대로 보입니다.
  const cards = nodes
    .map(
      (n, i) =>
        `<div class="map-card-body" data-card="${escapeHtml(n.id)}"${
          i === nodes.length - 1 ? '' : ' hidden'
        }>${cardInner(n, i === nodes.length - 1)}</div>`,
    )
    .join('');

  return `<div class="map-panel">
  <div class="map-search">
    ${icons.search}
    <input type="search" id="map-search" placeholder="기술 이름으로 찾기" autocomplete="off" aria-label="지도에서 기술 찾기">
  </div>

  <div class="map-scroll">
    <div class="map-card" id="map-card">${cards}</div>

    <p class="map-steps-label">지나온 순서</p>
    <ol class="map-steps" id="map-steps">${steps}</ol>
    <p class="map-no-result" id="map-no-result" hidden>그런 이름은 지도에 없습니다.</p>
  </div>
</div>`;
}

/** 패널 위쪽 카드 하나 */
function cardInner(node, isDestination) {
  const chips = [
    node.readingTime ? `<span class="map-chip map-chip-time">${escapeHtml(node.readingTime)}</span>` : '',
    ...node.tech.map((t) => `<span class="map-chip">${escapeHtml(t)}</span>`),
  ].join('');

  const readBtn = node.href
    ? `<a class="btn btn-primary" href="${escapeHtml(node.href)}">${icons.article} 글 읽기</a>`
    : `<button class="btn" type="button" disabled>글 준비 중</button>`;

  const tagLink = node.tech[0]
    ? `<a class="btn btn-outline" href="${url('/posts')}?tag=${encodeURIComponent(node.tech[0])}">관련 글 보기</a>`
    : '';

  return `<p class="map-card-kicker">${icons.pin} ${isDestination ? '도착지' : '경유지'}</p>
<h3 class="map-card-title">${escapeHtml(node.title)}</h3>
<div class="map-chips">${chips}</div>
<p class="map-card-summary">${escapeHtml(node.summary)}</p>
<div class="map-card-actions">${readBtn}${tagLink}</div>`;
}

/* ── 전체 ────────────────────────────────────────────────── */

/**
 * @param posts 빌드된 글 목록 — 지점의 post(slug) 를 실제 주소로 연결하는 데 씁니다
 */
export function renderSkillMap({ posts = [] } = {}) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  const nodes = skillMap.nodes.map((n) => {
    const post = n.post ? bySlug.get(n.post) : null;
    return {
      ...n,
      tech: Array.isArray(n.tech) ? n.tech : [],
      href: post ? url(post.permalink) : '',
      readingTime: post ? `${post.readingTime}분 읽기` : '',
    };
  });

  return `<section class="skill-map reveal" aria-labelledby="skill-map-heading">
  <div class="map-head">
    <p class="map-label">${escapeHtml(skillMap.label)}</p>
    <h2 class="map-heading" id="skill-map-heading">${escapeHtml(skillMap.heading)}</h2>
    <p class="map-desc">${escapeHtml(skillMap.description)}</p>
  </div>

  <div class="map-frame">
    <div class="map-canvas" id="map-canvas">
      <svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="${escapeHtml(skillMap.heading)} — 기술을 지점으로 표시한 지도">
        <g id="map-viewport">
          <rect x="0" y="0" width="${VIEW_W}" height="${VIEW_H}" fill="var(--map-land)"/>
          ${drawWater()}
          ${drawParks()}
          ${drawBlocks()}
          ${drawRoads()}
          ${drawAreaLabels()}
          <path class="route-casing" d="${routeD(nodes)}"/>
          <path class="route-line" d="${routeD(nodes)}"/>
          ${drawBadge(nodes)}
          ${drawNodes(nodes)}
        </g>
      </svg>

      <div class="map-controls">
        <div class="map-zoom">
          <button class="map-btn" type="button" id="map-zoom-in" aria-label="확대">${icons.plus}</button>
          <button class="map-btn" type="button" id="map-zoom-out" aria-label="축소">${icons.minus}</button>
        </div>
        <button class="map-btn" type="button" id="map-reset" aria-label="경로 전체 보기">${icons.recenter}</button>
      </div>
    </div>

    ${panel(nodes)}
  </div>
</section>`;
}
