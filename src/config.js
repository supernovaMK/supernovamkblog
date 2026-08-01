/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  블로그 설정 파일                                              │
 * │  이 파일만 고치면 사이트 대부분의 내용이 바뀝니다.               │
 * └──────────────────────────────────────────────────────────────┘
 */

export const site = {
  // ── 기본 정보 ───────────────────────────────────────────────
  title: 'supernova.log',
  // 브라우저 탭 / 검색 결과에 쓰이는 설명
  description: '기록하면서 배우는 개발자 김민기의 블로그',
  // 배포 주소 (RSS·sitemap·og 태그에 쓰입니다)
  url: 'https://supernovamk.github.io/supernovamkblog',
  lang: 'ko',

  /**
   * GitHub Pages 하위 경로.
   *   - 지금처럼 `supernovamkblog` 저장소로 배포하면  → '/supernovamkblog'
   *   - 저장소 이름을 `supernovaMK.github.io` 로 바꾸거나
   *     커스텀 도메인(CNAME)을 쓰면                  → ''  (빈 문자열)
   * GitHub Actions 로 배포할 땐 자동으로 채워지니 대개 손댈 일이 없습니다.
   */
  basePath: process.env.BASE_PATH ?? '/supernovamkblog',
};

// ── 히어로 (첫 화면 인사말) ────────────────────────────────────
export const hero = {
  greeting: '안녕하세요,',
  name: '김민기',
  suffix: '입니다',
  // 이름 아래 한 줄 소개
  tagline: '만드는 것보다 왜 그렇게 만들었는지를 더 오래 붙잡고 있는 편입니다.',
};

// ── "저는 이런 사람입니다" 블록 ────────────────────────────────
export const about = {
  label: 'ABOUT',
  heading: '저는 이런 사람입니다',
  // 문단 (여러 개 쓰면 여러 문단이 됩니다)
  paragraphs: [
    '문제를 붙잡고 오래 고민하는 걸 좋아합니다. 빨리 되는 것보다 왜 되는지가 설명되는 쪽을 택합니다.',
    '읽은 것, 만든 것, 틀렸던 것을 여기에 남깁니다. 남에게 설명할 수 있어야 비로소 안다고 생각해서요.',
  ],
  // 짧은 키워드 카드 — 자유롭게 추가/삭제하세요
  facts: [
    { k: '관심사', v: '백엔드 · 분산 시스템 · 개발자 경험' },
    { k: '요즘 언어', v: 'JavaScript · Python' },
    { k: '작업 방식', v: '작게 만들고, 자주 고치고, 반드시 기록' },
    { k: '연락', v: '아래 링크 아무거나' },
  ],
  // About 페이지(/about)에만 나오는 긴 글 — 마크다운 문법 그대로 쓸 수 있습니다
  longform: `
아직 채워지지 않은 자리입니다. \`src/config.js\` 의 \`about.longform\` 을 고치면
이 문단이 바뀝니다. 살아온 이야기, 해온 일, 관심 있는 주제를 편하게 적어보세요.
`,
};

// ── "제가 요즘 하고 있는 것은..." 블록 ─────────────────────────
// status 는 아래 3가지 중 하나: 'active'(진행중) | 'exploring'(탐색중) | 'paused'(잠시 멈춤)
export const now = {
  label: 'NOW',
  heading: '제가 요즘 하고 있는 것은…',
  // 언제 기준으로 쓴 내용인지
  updated: '2026년 8월',
  items: [
    {
      status: 'active',
      title: '블로그 만들기',
      detail: '남의 글을 읽기만 하다가, 이제는 내 언어로 정리해보려고 합니다.',
    },
    {
      status: 'exploring',
      title: '읽고 있는 것',
      detail: '여기에 요즘 보고 있는 책이나 문서를 적어두세요.',
    },
    {
      status: 'paused',
      title: '미뤄둔 것',
      detail: '언젠가 다시 꺼낼 것들도 적어두면 나중에 반갑습니다.',
    },
  ],
};

// ── 소셜 링크 ─────────────────────────────────────────────────
// 필요 없는 줄은 지우면 아이콘도 같이 사라집니다.
export const socials = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/supernovaMK' },
  { name: 'Email', icon: 'mail', url: 'mailto:daihoon5336@gmail.com' },
  // { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/...' },
  // { name: 'X', icon: 'x', url: 'https://x.com/...' },
];

// ── 상단 내비게이션 ───────────────────────────────────────────
export const nav = [
  { label: '글', path: '/posts' },
  { label: '소개', path: '/about' },
];

// ── 홈에 보여줄 최신 글 개수 ──────────────────────────────────
export const HOME_POST_COUNT = 5;

/* ══════════════════════════════════════════════════════════════
   스킬 맵 — 스크롤을 내리면 나오는 지도
   지도 좌표는 1240 × 640 격자를 씁니다. (왼쪽 위가 0,0)
   왼쪽 x≈450 까지는 정보 패널에 가려지니 그보다 오른쪽에 두세요.
   길은 가로/세로로만 이어지니, 이웃한 지점끼리는
   x 가 같거나 y 가 같도록 두세요. 그래야 도로 위를 지나갑니다.
   ══════════════════════════════════════════════════════════════ */
export const skillMap = {
  label: 'SKILL MAP',
  heading: '제가 지나온 길',
  description: '지점을 누르면 그때 무엇을 했는지, 어떤 글을 썼는지 왼쪽에 나옵니다.',

  // 지도 위에 흐리게 깔리는 동네 이름
  areas: [
    { name: '프론트엔드', x: 395, y: 612 },
    { name: '백엔드', x: 560, y: 300 },
    { name: '인프라', x: 900, y: 138 },
    { name: '데이터', x: 700, y: 572 },
  ],

  /**
   * 경로 위의 지점들. 적힌 순서대로 파란 길이 이어집니다.
   *   post : posts/ 안의 글 주소(slug). 그 글로 가는 버튼이 생깁니다.
   *          아직 글이 없으면 빈 문자열('')로 두세요.
   */
  nodes: [
    {
      id: 'js',
      label: 'JavaScript',
      x: 490,
      y: 520,
      title: '여기서 시작했습니다',
      summary: '처음으로 화면에 글자를 띄워본 언어입니다. 왜 되는지 모른 채 됐던 시기.',
      tech: ['JavaScript', 'DOM'],
      post: '',
    },
    {
      id: 'node',
      label: 'Node.js',
      x: 640,
      y: 520,
      title: '브라우저 밖으로 나오기',
      summary: '서버라는 게 결국 요청을 받아 응답을 돌려주는 프로그램이란 걸 알게 됐습니다.',
      tech: ['Node.js', 'Express'],
      post: '',
    },
    {
      id: 'db',
      label: '데이터베이스',
      x: 640,
      y: 360,
      title: '데이터를 어디에 둘 것인가',
      summary: '인덱스 하나로 응답이 몇 배 빨라지는 걸 보고 흥미가 붙었습니다.',
      tech: ['PostgreSQL', 'Redis'],
      post: '',
    },
    {
      id: 'docker',
      label: 'Docker',
      x: 840,
      y: 360,
      title: '내 컴퓨터에서는 되는데요',
      summary: '이 말을 안 하려고 컨테이너를 배웠습니다.',
      tech: ['Docker', 'CI/CD'],
      post: '',
    },
    {
      id: 'dist',
      label: '분산 시스템',
      x: 840,
      y: 200,
      title: '한 대로 안 될 때',
      summary: '서버를 늘리면 생기는 문제들. 지금 가장 오래 붙잡고 있는 주제입니다.',
      tech: ['Kafka', 'Consistency'],
      post: '',
    },
    {
      id: 'now',
      label: '지금 여기',
      x: 1060,
      y: 200,
      title: '기록하는 중',
      summary: '배운 걸 남기려고 이 블로그를 만들었습니다. 다음 지점은 아직 비어 있습니다.',
      tech: ['Writing'],
      post: '',
    },
  ],
};
