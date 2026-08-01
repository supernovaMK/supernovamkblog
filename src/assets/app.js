/* ============================================================
   클라이언트 스크립트
   - 다크/라이트 전환
   - 헤더 그림자
   - 스크롤하면 나타나는 섹션
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

    // ?tag=… 로 들어오면 그 태그를 켜둡니다
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
  initPostFilter();
  initCopyButtons();
  initTables();
  initToc();
})();
