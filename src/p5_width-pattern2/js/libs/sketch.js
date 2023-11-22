import gsap from 'gsap';
/**
 * 円で重なり模様をくり抜いたアニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let pg;
  let canvas;
  const frame = { count: 0 };
  const num = 30;

  p.setup = () => {
    const one = document.getElementById('one');
    canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    pg = p.createGraphics(p.width, p.height);

    p.noStroke();
    curtain(num, p.width / num);
    motion(frame);
  };
  p.draw = () => {
    p.background(220);
    pg.background(100);
    curtain(num, p.width / num);

    stripes(['#2B2A4C', '#2D9596'], 30, 20);
    pg.erase();
    for (let i = 1; i < 10; i++) {
      eraseAnimation(frame, 30 * i, 24 * i, p.radians(50 * i));
    }
    pg.noErase();
    p.drawingContext.filter = 'drop-shadow(8px 8px 8px rgba(46,46,46,0.7))';
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_width-pattern2', 3);
    }
  };

  /**
   * 四角形の重なり模様を描く関数
   * @param {number} num - 何個の四角形を描くか
   * @param {number} s - 四角形の幅
   */
  const curtain = (num, s) => {
    for (let i = num; i > 0; i--) {
      const x = s * i;
      const y = p.height;
      p.push();
      {
        p.drawingContext.filter = 'drop-shadow(2px 0px 30px #000)';
        p.fill(200);
        p.rect(0, 0, x, y);
      }
      p.pop();
    }
  };

  /**
   * eraseAnimation関数は、フレーム、サイズ、位置、角度を指定してくり抜きアニメーションを描画します。
   *
   * @param {Object} frame - フレーム情報を含むオブジェクト
   * @param {number} size - 円のサイズ
   * @param {number} position - 円の位置
   * @param {number} angle - くり抜きキャンバスの回転角度
   * @returns {void}
   */
  const eraseAnimation = (frame, size, position, angle) => {
    pg.push();
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rotate(angle);
    const x = p.cos(p.radians(frame.count)) * size;
    const y = p.sin(p.radians(frame.count)) * size;
    const r = p.sin(p.radians(frame.count)) * 50 + position;
    pg.circle(x, y, r);
    pg.pop();
  };

  /**
   * グラフィックオブジェクトにストライプを描画します。
   * @param {Array} color - [color1, color2] のような2つの色の配列です。
   * @param {number} num - 描画するストライプの数です。
   * @param {number} size - 各ストライプの高さです。
   */
  const stripes = (color, num, size) => {
    pg.push();
    pg.noStroke();
    for (let i = 0; i < num; i++) {
      if (i % 2 === 0) {
        pg.fill(color[0]);
        pg.translate(0, size);
        pg.rect(0, 0, pg.width, size);
      } else {
        pg.fill(color[1]);
        pg.translate(0, size + size / 2);
        pg.rect(0, 0, pg.width, size / 3);
      }
    }
    pg.pop();
  };

  /**
   * フレームの動きをアニメーション化します。
   * @param {Array} frame - フレーム情報の配列
   */
  const motion = (frame) => {
    gsap
      .timeline({ repeat: -1 })
      .to(frame, {
        count: 180,
        duration: 2,
        ease: 'expo.inOut',
      })
      .to(frame, {
        count: -360,
        duration: 2,
        ease: 'expo.inOut',
      })
      .to(frame, {
        count: 0,
        duration: 2,
        ease: 'expo.inOut',
      });
  };
};
