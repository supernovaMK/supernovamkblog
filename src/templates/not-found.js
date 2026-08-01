import { url } from '../helpers.js';
import { layout } from './layout.js';

export function renderNotFound() {
  return layout({
    title: '없는 페이지',
    description: '요청하신 주소를 찾지 못했습니다.',
    bodyClass: 'page-404',
    canonical: '/',
    body: `<div class="shell">
  <div class="notfound">
    <p class="notfound-code">404</p>
    <h1 class="page-title">여기엔 아무것도 없네요</h1>
    <p class="page-desc">주소가 바뀌었거나, 아직 쓰지 않은 글일 수 있습니다.</p>
    <p><a class="text-link" href="${url('/')}">첫 화면으로 돌아가기</a></p>
  </div>
</div>`,
  });
}
