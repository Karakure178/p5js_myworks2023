import gsap from 'gsap';
/**
 * LTでの飾り用 アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;

  const r = [240, 190, 180, 280];
  const shift_x = [0, 20, -20, 10];
  const vec = [[], [], [], []];

  const size = [35, 40, 50, 54];
  const size2 = [54, 20, 50, 36];

  const easing = [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }];
  const easing_str = ['quad.inOut', 'quad.in', 'quad.inOut', 'quad.in'];
  const easing_time = [3, 2, 4, 2.2, 3.4];

  const easing2 = [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }];
  const easing2_str = ['quad.in', 'quad.inOut', 'quad.in', 'quad.inOut'];
  const easing2_time = [3, 2, 2.7, 3.3];

  const color = ['#E48F45', '#F1EB90', '#F3B664', '#FF6C22'];
  const angle = 200;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);

    for (let i = 0; i < angle; i++) {
      for (let j = 0; j < r.length; j++) {
        const x = r[j] * p.cos(p.radians(i + 180)) + p.random(1, 2);
        const y = r[j] * p.sin(p.radians(i + 180));
        vec[j].push(p.createVector(x, y));
      }
    }

    for (let j = 0; j < r.length; j++) {
      motion(easing[j], easing_str[j], easing_time[j]);
      motion(easing2[j], easing2_str[j], easing2_time[j]);
    }

    p.noStroke();
  };
  p.draw = () => {
    p.background('#e9edee');

    for (let j = 0; j < r.length; j++) {
      p.push();
      p.fill(color[j]);
      p.translate(p.width / 2 + r[j] + shift_x[j], p.height);
      const cast = parseInt(easing[j].count);
      //console.log(cast)
      p.circle(vec[j][cast].x, vec[j][cast].y, size[j]);
      p.pop();
    }

    for (let j = 0; j < r.length; j++) {
      p.push();
      p.fill(color[j]);
      p.translate(p.width / 2 - r[j] + shift_x[j], p.height);
      p.scale(-1, 1);

      const cast = parseInt(easing2[j].count);
      p.circle(vec[j][cast].x, vec[j][cast].y, size2[j]);
      p.pop();
    }
  };

  const motion = (frame, str, time) => {
    gsap.timeline({ repeat: -1 }).to(frame, {
      count: angle - 1,
      duration: time,
      ease: str,
    });
  };
};
