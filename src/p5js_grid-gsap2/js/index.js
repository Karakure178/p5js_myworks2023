import p5 from 'p5';
import { sketch } from './libs/sketch';
import { loop } from './libs/capture';

/* ===========================================
 * 全体処理用
 * ======================================== */
window.addEventListener('DOMContentLoaded', () => {
  new p5(sketch);
  const cap = setInterval(() => {
    if (document.getElementById('defaultCanvas0')) {
      clearInterval(cap);
      loop();
    }
  }, 10);
});
