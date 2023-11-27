import p5 from 'p5';
import { sketch } from './libs/sketch';

/* ===========================================
 * 全体処理用
 * ======================================== */
window.addEventListener('DOMContentLoaded', () => {
  new p5(sketch);
});
