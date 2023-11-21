import p5 from 'p5';
import gsap from 'gsap';

const sketch = (p) => {
  const frame_list = { count: 0 };
  const rotation_list = { count: 0 };

  p.setup = () => {
    const one = document.getElementById('one');
    const canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    motion(frame_list);
    rotateMotion(rotation_list);
  };

  p.draw = () => {
    p.background(220);
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(rotation_list.count);
    morth(3000, frame_list.count);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_circle-hypocycloid', 4);
    }
  };

  /** 円とハイポロイドを合成する関数
   * @method morth
   * @param  {Number}        num     頂点数
   * @param  {Number}        t       円とハイポロイドを合成する割合、0-1までの数値
   */
  const morth = (num, t) => {
    const a = 200;
    const b = a / 5;
    const angle = 360 / num;
    const r = 260;
    for (let i = 0; i < num; i++) {
      const x = (a - b) * p.cos(angle * i) + b * p.cos(((a - b) / b) * angle * i);
      const y = (a - b) * p.sin(angle * i) - b * p.sin(((a - b) / b) * angle * i);

      const xx = r * p.cos(p.radians(angle * i));
      const yy = r * p.sin(p.radians(angle * i));

      const tx = xx * t + x * (1 - t);
      const ty = yy * t + y * (1 - t);
      p.point(tx, ty);
    }
  };

  /**
   * Animates the motion of frame_list.
   * @param {Array} frame_list - The list of lines to animate.
   */
  const motion = (frame_list) => {
    gsap
      .timeline({ repeat: -1 })
      .to(frame_list, {
        count: 0.8,
        duration: 3,
        ease: 'expo.inOut',
      })
      .to(frame_list, {
        count: 0.1,
        duration: 2,
        ease: 'expo.inOut',
      })
      .to(frame_list, {
        count: 0,
        duration: 1,
        ease: 'expo.in',
      });
  };

  /**
   * Animates the motion of frame_list.
   * @param {Array} frame_list - The list of lines to animate.
   */
  const rotateMotion = (frame_list) => {
    gsap.timeline({ repeat: -1 }).to(frame_list, {
      count: 3.75,
      duration: 6,
      ease: 'quad.inOut',
    });
  };
};

/* ===========================================
 * 全体処理用
 * ======================================== */
window.addEventListener('DOMContentLoaded', () => {
  new p5(sketch);
});
