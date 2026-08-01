/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  블로그 설정 파일                                              │
 * │  이 파일만 고치면 사이트 대부분의 내용이 바뀝니다.               │
 * └──────────────────────────────────────────────────────────────┘
 */

export const site = {
  // ── 기본 정보 ───────────────────────────────────────────────
  title: 'supernovamk.blog',
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

/* ══════════════════════════════════════════════════════════════
   첫 화면 소개 카드
   여기 글자를 바꾸면 홈 맨 위 카드가 그대로 바뀝니다.
   ══════════════════════════════════════════════════════════════ */
export const hero = {
  greeting: '안녕하세요,',       // 이름 위 작은 인사
  name: '김민기',                // 이름 (크게 나옵니다)
  suffix: '입니다',              // 이름 뒤에 붙는 말

  // 이름 바로 아래 한 줄
  tagline: '만드는 것보다 왜 그렇게 만들었는지를 더 오래 붙잡고 있는 편입니다.',

  // 그 아래 짧은 소개. 두세 줄이 딱 좋습니다.
  // (길게 쓰고 싶으면 아래 about.paragraphs 에 쓰세요 — 소개 페이지에 나옵니다)
  intro: '읽은 것, 만든 것, 틀렸던 것을 여기에 남깁니다. 남에게 설명할 수 있어야 비로소 안다고 생각해서요.',

  /**
   * 오른쪽 동그란 자리에 무엇을 넣을지.
   *   'initial'      → 이름 첫 글자 (기본)
   *   ''             → 아무것도 안 넣음
   *   '/profile.jpg' → static/ 에 넣은 사진 파일
   */
  photo: '',
  photoAlt: '김민기 프로필 사진',
};

/* ══════════════════════════════════════════════════════════════
   소개 페이지 (/about)
   sections 에 항목을 넣으면 그대로 쌓입니다.
     · body  가 있으면 → 마크다운 글 한 덩어리
     · items 가 있으면 → 날짜가 붙은 목록
   섹션을 추가·삭제·순서변경 모두 자유롭게 하세요.
   ══════════════════════════════════════════════════════════════ */
export const about = {
  greeting: '안녕하세요.',
  headline: '백엔드·인프라를 공부하는 김민기입니다.',

  sections: [
    {
      title: 'Introduction',
      body: `
서버가 왜 무너지는지 직접 무너뜨려 보면서 배우는 걸 좋아합니다.
장애를 재현하고, 지표로 원인을 좁히고, 고친 뒤 다시 확인하는 과정을 반복하고 있습니다.

읽은 것과 만든 것, 틀렸던 것을 여기에 기록으로 남깁니다.
남에게 설명할 수 있어야 비로소 안다고 생각해서요.
`,
    },
    {
      title: 'Education',
      items: [
        {
          name: '세종대학교 소프트웨어학과',
          period: '2021.03 ~ 2027.02',
          detail: '학점 3.9 / 4.5 · 네트워크, 자료구조, 알고리즘, 컴퓨터구조, 운영체제, 데이터베이스',
        },
      ],
    },
    {
      title: 'Experience',
      items: [
        {
          name: 'Grit Standard · 소프트웨어 엔지니어 인턴',
          period: '2023.08 ~ 2023.12',
          detail:
            '손으로 처리하던 문서 작업을 Tesseract·Pandas 기반 파이썬 파이프라인으로 자동화했습니다. 처리에 실패한 문서를 따로 모아 실패 원인과 함께 머신러닝 팀에 넘겨, 미지원 양식까지 다루는 모델로 이어지게 했습니다.',
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        {
          name: 'RushGate · 백엔드 · 인프라',
          period: '2026.05 ~',
          detail:
            '쿠버네티스 위에 선착순 티켓팅 서비스를 올리고, 일부러 장애를 일으켜 진단하는 무대로 만들고 있습니다. Chaos Mesh로 장애를 주입하고 Prometheus·Loki·Grafana로 관측합니다. 이상 징후를 스스로 찾아 원인 가설을 세우고 조치까지 하는 에이전트를 붙이는 중입니다.',
          link: '',
        },
        {
          name: 'Pickeat · 백엔드 · 인프라',
          period: '2025.06 ~',
          detail:
            '여럿이 모여 식당을 빠르게 고르는 실시간 투표 서비스입니다. 5분 남짓한 투표에 600명이 몰리는 상황을 Java·Spring으로 처리했고, 느린 쿼리를 찾아 P99 응답을 1.5초에서 200ms로 줄였습니다.',
          link: '',
        },
      ],
    },
    {
      title: 'Activity',
      items: [
        {
          name: '우아한테크코스',
          period: '2025.02 ~ 2025.11',
          detail:
            '10개월 동안 자바와 객체지향, 클린 코드를 다뤘습니다. 페어 프로그래밍과 팀 프로젝트로 계속 토론하며 배웠습니다.',
        },
        {
          name: 'Greedy · 세종대학교 소프트웨어 동아리',
          period: '',
          detail:
            '동아리를 운영하며 매주 세션을 진행합니다. 웹, 앱, 오픈소스 기여, AI까지 폭넓게 다룹니다.',
        },
      ],
    },
    {
      title: 'Skills',
      items: [
        {
          name: 'Languages',
          period: '',
          detail: 'Java · Python · C · SQL · Shell / Bash Script',
        },
        {
          name: 'Technologies',
          period: '',
          detail:
            'Kubernetes · Docker · AWS · GCP · Spring · MySQL · Nginx · GitHub Actions · Prometheus · Grafana · Loki · k6 · Flyway',
        },
      ],
    },
    {
      title: 'Certificates',
      items: [
        { name: 'AWS Certified Solutions Architect – Associate', period: '', detail: '' },
        { name: 'SQL 개발자 (SQLD)', period: '', detail: '' },
        { name: 'OPIc IH (Intermediate High)', period: '', detail: '' },
      ],
    },
  ],
};

/* ══════════════════════════════════════════════════════════════
   "제가 요즘 하고 있는 것은…" 블록
   아래 body 에 그냥 마크다운으로 쓰면 됩니다.
     ##  → 굵은 제목 한 줄
     ### → 그 아래 작은 제목
     그냥 글  → 설명 문단
   글자 크기는 블록에 맞게 알아서 줄여서 들어갑니다.
   ══════════════════════════════════════════════════════════════ */
export const now = {
  heading: '최근 하고 있는 것',

  body: `
## 선착순 서비스를 개발 중입니다

### 동아리와 모임에서 쓰는 작은 예약 도구

짧은 시간에 요청이 몰릴 때 서버가 어떻게 버티는지 직접 부딪혀보고 있습니다.

## 읽고 있는 것

여기에 요즘 보는 책이나 문서를 적어두세요.

## 미뤄둔 것

언젠가 다시 꺼낼 것들도 적어두면 나중에 반갑습니다.
`,
};

// ── 소셜 링크 ─────────────────────────────────────────────────
// 필요 없는 줄은 지우면 아이콘도 같이 사라집니다.
// url 을 빈 문자열('')로 두면 그 버튼은 사라집니다. 주소를 채우면 다시 나타납니다.
export const socials = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/supernovaMK' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/minkikim02' },
  { name: 'YouTube', icon: 'youtube', url: '' },   // ← 예: https://www.youtube.com/@내채널
  { name: 'Email', icon: 'mail', url: 'mailto:daihoon5336@gmail.com' },
  // { name: 'X', icon: 'x', url: 'https://x.com/...' },
];

// ── 상단 내비게이션 ───────────────────────────────────────────
export const nav = [
  { label: '글', path: '/posts' },
  { label: '기록', path: '/log' },
  { label: '소개', path: '/about' },
];

// ── 홈 '최신 글' 블록에 보여줄 개수 ───────────────────────────
// (그 아래 연도별 목록에는 모든 글이 나옵니다)
export const HOME_POST_COUNT = 3;

// ── 홈 아래쪽 연도별 목록 ─────────────────────────────────────
export const archive = {
  heading: '전체 글',
  // 연도를 최신순으로 볼지 (false 로 하면 오래된 연도부터)
  newestFirst: true,
};

/* ══════════════════════════════════════════════════════════════
   활동 기록 — 깃허브 커밋 목록처럼 쌓이는 페이지 (/log)
   맨 위에 적은 것이 가장 최근입니다.
   여기에 하나 추가할 때마다 홈의 커밋 버튼도 같이 바뀝니다.
   ══════════════════════════════════════════════════════════════ */
export const updates = {
  heading: '활동 기록',
  description: '무엇을 했는지 날짜별로 쌓아둡니다.',

  items: [
    {
      date: '2026-08-01',
      title: '블로그를 열었습니다',
      body: `
읽은 것과 만든 것을 남길 자리를 만들었습니다.
마크다운으로 쓰면 그대로 올라가게 해뒀습니다.
`,
    },
    {
      date: '2026-07-20',
      title: '선착순 서비스 첫 삽',
      body: `
동아리에서 쓸 예약 도구를 만들기 시작했습니다.
짧은 시간에 요청이 몰릴 때 서버가 어떻게 버티는지 보려고 합니다.
`,
    },
  ],
};
