import p5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    const one = document.getElementById('one');
    const canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
  };

  p.draw = () => {
    p.background(220);
    p.fill(20);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(p.mouseX, p.mouseY, 50, 50);
  };
};

/* ===========================================
 * 全体処理用
 * ======================================== */
window.addEventListener('DOMContentLoaded', () => {
  new p5(sketch);
});
