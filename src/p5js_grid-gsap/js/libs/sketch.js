import gsap from 'gsap';
import p5 from 'p5';
/**
 * round rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  const oddframe = { count: 0 };
  const evenframe = { count: 1 };
  const num = 5;

  p.setup = () => {
    const one = document.getElementById('one');
    canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    p.frameRate(24);
    p.rectMode(p.CENTER);
    motion(oddframe, true);
    motion(evenframe, false);
  };

  p.draw = () => {
    p.background(220);
    grid(num);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_grid2', 8);
    }
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  function grid(num) {
    const n1 = num + 1;

    const margin_left = p.width / n1 / n1;
    const margin_bottom = p.height / n1 / n1;
    const nw = p.width / n1;
    const nh = p.height / n1;

    const points = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
          const r = p.map(oddframe.count, 0, 1, nw / 2, nw);
          const round = p.map(evenframe.count, 0, 1, 10, 100);
          p.rect(x + nw / 2, y + nh / 2, r, r, round, round, round, round);
        } else {
          const r = p.map(evenframe.count, 0, 1, nw / 2, nw);
          p.rect(x + nw / 2, y + nh / 2, r, r, 10, 10, 10, 10);
          p.circle(x + nw / 2, y + nh / 2, nw / 4);
        }
        points.push(new p5.Vector(x, y));
      }
    }
  }

  /**
   * フレームの動きをアニメーション化します。
   * @param {Array} frame - フレーム情報の配列
   */
  const motion = (frame, bool) => {
    if (bool) {
      gsap
        .timeline({ repeat: -1 })
        .to(frame, {
          count: 1,
          duration: 2,
          ease: 'expo.inOut',
        })
        .to(frame, {
          count: 0,
          duration: 2,
          ease: 'expo.inOut',
        });
    } else {
      gsap
        .timeline({ repeat: -1 })
        .to(frame, {
          count: 0,
          duration: 2,
          ease: 'expo.inOut',
        })
        .to(frame, {
          count: 1,
          duration: 2,
          ease: 'expo.inOut',
        });
    }
  };
};
