/* ============================================================
   클라이언트 스크립트
   - 다크/라이트 전환
   - 헤더 그림자
   - 스크롤하면 나타나는 섹션
   - 스킬 맵 (지점 선택 · 검색 · 확대 · 끌어서 이동)
   - 글 목록 검색 + 태그 필터
   - 코드 블록 복사 버튼 / 목차 현재 위치
   ============================================================ */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ── 테마 전환 ───────────────────────────────────────── */
  function initTheme() {
    const toggle = $('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        /* 사생활 보호 모드 등에서 저장이 막힐 수 있습니다 */
      }
    });

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem('theme');
      } catch (err) {}
      if (!saved) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    });
  }

  /* ── 스크롤하면 헤더에 그림자 ────────────────────────── */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    addEventListener('scroll', update, { passive: true });
  }

  /* ── 스크롤하면 나타나는 섹션 ────────────────────────── */
  function initReveal() {
    const targets = $$('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      for (const el of targets) el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    for (const el of targets) observer.observe(el);
  }

  /* ── 스킬 맵 ─────────────────────────────────────────── */
  function initSkillMap() {
    const canvas = $('#map-canvas');
    const viewport = $('#map-viewport');
    if (!canvas || !viewport) return;

    // 지도 크기는 SVG 가 들고 있는 값을 그대로 씁니다
    const svg = $('svg', canvas);
    const [, , VIEW_W, VIEW_H] = (svg?.getAttribute('viewBox') ?? '0 0 1240 640')
      .split(/\s+/)
      .map(Number);
    const CX = VIEW_W / 2;
    const CY = VIEW_H / 2;

    const nodes = $$('.map-node', canvas);
    const steps = $$('.map-step');
    const cards = $$('.map-card-body');

    /* 지점 고르기 */
    function select(id) {
      for (const n of nodes) n.classList.toggle('is-selected', n.dataset.node === id);
      for (const s of steps) s.classList.toggle('is-selected', s.dataset.step === id);
      for (const c of cards) c.hidden = c.dataset.card !== id;
    }

    for (const step of steps) {
      step.addEventListener('click', () => select(step.dataset.step));
    }

    // 지점을 키보드로도 고를 수 있게
    for (const node of nodes) {
      node.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        select(node.dataset.node);
      });
    }

    /* 확대 · 이동 */
    let scale = 1;
    let panX = 0;
    let panY = 0;

    function apply() {
      viewport.setAttribute(
        'transform',
        `translate(${panX} ${panY}) translate(${CX} ${CY}) scale(${scale}) translate(${-CX} ${-CY})`,
      );
    }

    /**
     * 화면 밖으로 밀려난 만큼만 움직일 수 있게 묶어둡니다.
     * SVG 가 slice 로 잘려 들어가므로, 상자 크기와 지도 크기를 견줘서 계산합니다.
     */
    function panLimits() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return { x: 0, y: 0 };
      const k = Math.max(rect.width / VIEW_W, rect.height / VIEW_H) * scale;
      return {
        x: Math.max(0, (VIEW_W - rect.width / k) / 2),
        y: Math.max(0, (VIEW_H - rect.height / k) / 2),
      };
    }

    function clampPan() {
      const limit = panLimits();
      panX = Math.max(-limit.x, Math.min(limit.x, panX));
      panY = Math.max(-limit.y, Math.min(limit.y, panY));
    }

    /**
     * 처음 보이는 자리를 정합니다.
     * 넓은 화면은 지도를 그대로 두고(패널 오른쪽에 경로가 다 들어옵니다),
     * 좁은 화면은 잘려서 경로가 화면 밖으로 나가므로 경로 한가운데로 맞춥니다.
     */
    function centerOnRoute() {
      const rect = canvas.getBoundingClientRect();
      const pts = nodes.map((n) => ({ x: +n.dataset.x, y: +n.dataset.y }));

      if (rect.width >= 700 || !pts.length) {
        panX = 0;
        panY = 0;
      } else {
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        panX = CX - (Math.min(...xs) + Math.max(...xs)) / 2;
        panY = CY - (Math.min(...ys) + Math.max(...ys)) / 2;
      }
      clampPan();
      apply();
    }

    function zoom(delta) {
      scale = Math.max(1, Math.min(2.6, +(scale + delta).toFixed(2)));
      clampPan();
      apply();
    }

    $('#map-zoom-in')?.addEventListener('click', () => zoom(0.4));
    $('#map-zoom-out')?.addEventListener('click', () => zoom(-0.4));
    $('#map-reset')?.addEventListener('click', () => {
      scale = 1;
      centerOnRoute();
    });

    // 처음 그릴 때와 창 크기가 바뀔 때 경로가 보이는 자리에 오도록
    centerOnRoute();
    let resizeTimer;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(centerOnRoute, 150);
    });

    /* 끌어서 이동 — 살짝만 움직였으면 '누른 것'으로 봅니다 */
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('.map-controls')) return; // 확대·축소 버튼은 지도 끌기가 아닙니다
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add('is-dragging');
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      const unit = VIEW_W / rect.width; // 화면 픽셀 → 지도 좌표
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      panX += dx * unit;
      panY += dy * unit;
      lastX = e.clientX;
      lastY = e.clientY;
      clampPan();
      apply();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      canvas.classList.remove('is-dragging');
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // 끌지 않고 그냥 눌렀으면 지점 선택으로 봅니다.
      // 포인터를 붙잡아둔(setPointerCapture) 상태에선 e.target 이 캔버스로 바뀌므로
      // 실제로 무엇 위에서 손을 뗐는지는 좌표로 다시 찾습니다.
      if (moved < 6) {
        const under = document.elementFromPoint(e.clientX, e.clientY);
        const node = under?.closest?.('.map-node');
        if (node) select(node.dataset.node);
      }
    }

    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    /* 패널 검색 */
    const search = $('#map-search');
    const noResult = $('#map-no-result');
    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase();
        let hits = 0;
        for (const step of steps) {
          const show = !q || (step.dataset.search || '').includes(q);
          step.parentElement.hidden = !show;
          if (show) hits += 1;
        }
        if (noResult) noResult.hidden = hits > 0;

        // 딱 하나만 남으면 그 지점을 바로 보여줍니다
        if (q && hits === 1) {
          const only = steps.find((s) => !s.parentElement.hidden);
          if (only) select(only.dataset.step);
        }
      });
    }
  }

  /* ── 글 목록 검색 · 태그 필터 ────────────────────────── */
  function initPostFilter() {
    const search = $('#post-search');
    const groups = $$('.year-group');
    if (!groups.length) return;

    const items = $$('.post-item');
    const chips = $$('.chip');
    const noResult = $('.no-result');
    let activeTag = '';
    let query = '';

    function apply() {
      let visible = 0;

      for (const item of items) {
        const haystack = item.dataset.search || '';
        const tags = (item.dataset.tags || '').split('|').filter(Boolean);
        const matchQuery = !query || haystack.includes(query);
        const matchTag = !activeTag || tags.includes(activeTag);
        const show = matchQuery && matchTag;
        item.hidden = !show;
        if (show) visible += 1;
      }

      for (const group of groups) {
        group.hidden = !$$('.post-item', group).some((li) => !li.hidden);
      }

      if (noResult) noResult.hidden = visible > 0;
    }

    function setTag(tag) {
      activeTag = tag;
      for (const c of chips) c.classList.toggle('is-on', (c.dataset.tag || '') === activeTag);
      apply();
    }

    if (search) {
      let timer;
      search.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          query = search.value.trim().toLowerCase();
          apply();
        }, 90);
      });
    }

    for (const chip of chips) {
      chip.addEventListener('click', () => {
        setTag(chip.classList.contains('is-on') ? '' : chip.dataset.tag || '');
      });
    }

    // 스킬 맵의 '관련 글 보기' 처럼 ?tag=… 로 들어온 경우
    const wanted = new URLSearchParams(location.search).get('tag');
    if (wanted && chips.some((c) => c.dataset.tag === wanted)) setTag(wanted);
  }

  /* ── 코드 블록 복사 버튼 ─────────────────────────────── */
  function initCopyButtons() {
    for (const pre of $$('pre[data-code-block]')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = '복사';
      btn.setAttribute('aria-label', '코드 복사');

      btn.addEventListener('click', async () => {
        const code = $('code', pre)?.innerText ?? '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = '복사됨';
          btn.classList.add('is-done');
        } catch (e) {
          btn.textContent = '실패';
        }
        setTimeout(() => {
          btn.textContent = '복사';
          btn.classList.remove('is-done');
        }, 1600);
      });

      pre.appendChild(btn);
    }
  }

  /* ── 넓은 표는 가로 스크롤 상자에 담기 ───────────────── */
  function initTables() {
    for (const table of $$('.prose > table')) {
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    }
  }

  /* ── 목차: 지금 읽는 위치 표시 ───────────────────────── */
  function initToc() {
    const links = $$('.toc a');
    if (!links.length) return;

    const map = new Map();
    for (const link of links) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) map.set(target, link);
    }
    if (!map.size) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links) link.classList.remove('is-current');
          map.get(entry.target)?.classList.add('is-current');
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );

    for (const heading of map.keys()) observer.observe(heading);
  }

  /* ── 실행 ────────────────────────────────────────────── */
  initTheme();
  initHeader();
  initReveal();
  initSkillMap();
  initPostFilter();
  initCopyButtons();
  initTables();
  initToc();
})();
