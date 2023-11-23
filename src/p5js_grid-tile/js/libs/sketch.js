import gsap from 'gsap';
import p5 from 'p5';
/**
 * round rect アニメーションスケッチ2
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  const oddframe = { count: 0.3 };
  const evenframe = { count: 1 };
  const num = 10;

  p.setup = () => {
    const one = document.getElementById('one');
    canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    p.frameRate(24);
    p.rectMode(p.CENTER);
    motion(oddframe, true);
    motion(evenframe, false);
    p.noFill();
    p.strokeWeight(5);
  };

  p.draw = () => {
    p.background('#161d1d');
    p.translate(0, -p.height / 2);
    p.rotate(p.radians(30));
    grid(num);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_grid-tile', 'png');
      p.saveGif('p5js_grid-tile', 8);
    }
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  function grid(num) {
    const n1 = num + 1;
    const width = p.width * 2;
    const height = p.height * 2;

    const margin_left = width / n1 / n1;
    const margin_bottom = height / n1 / n1;
    const nw = width / n1;
    const nh = height / n1;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        if (i % 2 === 0) {
          p.stroke('#2D9596');
          const r = p.map(oddframe.count, 0, 1, nw / 2, nw);
          const round = p.map(evenframe.count, 0.3, 1, 20, 10);

          p.rect(x + nw / 2, y + nh / 2, r, r, round, round, round, round);
        } else {
          p.stroke('#ECF4D6');
          const r = p.map(evenframe.count, 0, 1, nw / 2, nw);
          const round = p.map(oddframe.count, 0.3, 1, 20, 10);

          p.rect(x + nw / 2, y + nh / 2, r, r, round, round, round, round);
          // p.circle(x + nw / 2, y + nh / 2, nw / 4);
        }
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
          ease: 'quad.inOut',
        })
        .to(frame, {
          count: 0.3,
          duration: 2,
          ease: 'quad.inOut',
        });
    } else {
      gsap
        .timeline({ repeat: -1 })
        .to(frame, {
          count: 0.3,
          duration: 2,
          ease: 'quad.inOut',
        })
        .to(frame, {
          count: 1,
          duration: 2,
          ease: 'quad.inOut',
        });
    }
  };
};
