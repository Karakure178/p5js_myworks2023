import { gridPosition } from './pg';
import { border, stripe } from './functions/stripe';
import { grid } from './functions/grid';
import { gridLine } from './functions/gridLine';
import { bear } from './functions/bear';

/**
 * ハッカソン用スケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg_group;
  const colors = [
    ['#9EC8B9', '#5C8374', '#1B4242', '#092635'],
    ['#F0ECE5', '#B6BBC4', '#31304D', '#161A30'],
    ['#ECF4D6', '#9AD0C2', '#2D9596', '#2D9596'],
    ['#FAE7C9', '#E1C78F', '#B0926A', '#706233'],
    ['#FFC7C7', '#ED9ED6', '#C683D7', '#7071E8'],
    ['#F9DEC9', '#F78CA2', '#D80032', '#3D0C11'],
    ['#EBE4D1', '#B4B4B3', '#26577C', '#E55604'],
    ['#FFFADD', '#FFCC70', '#8ECDDD', '#22668D'],
    ['#EEE2DE', '#EA906C', '#B31312', '#2B2A4C'],
    ['#C5FFF8', '#96EFFF', '#5FBDFF', '#7B66FF'],
    ['#E9E6C9', '#CA6144', '#566683', '#393E51'],
  ];

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.translate(-p.width / 2, -p.height / 2);

    pg_group = gridPosition(p, 3, colors);
    for (let i = 0; i < pg_group.pgs.length; i++) {
      const funcNum = pg_group.rand[i];
      const pg = pg_group.pgs[i];
      if (funcNum === 1) {
        // 縞模様
        stripe(pg, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 2) {
        // ボーだー
        border(pg, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 3) {
        // グリッド
        const num = Math.floor(p.random(2, 10));
        grid(pg, num, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 4) {
        // エビ or 線
        gridLine(pg, p, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 5) {
        // くま
        for (let j = 0; j < 130; j++) {
          const x = p.random(0, pg.width);
          const y = p.random(0, pg.height);
          const rand = Math.floor(p.random(0, pg_group.pgs.length));
          const colors = pg_group.colors[rand];
          bear(pg, p, x, y, pg.width / 5, colors[1], colors[2], colors[3]);
        }
      }
      //else if (funcNum === 6) {
      // } else if (funcNum === 7) {
      // } else if (funcNum === 8) {
      // } else if (funcNum === 9) {
      // }
      p.image(pg_group.pgs[i], pg_group.res[i].x, pg_group.res[i].y);
    }
  };

  p.draw = () => {
    //p.background('#F3EEEA');
    //pg.push();
    //pg.translate(p.width / 2, p.height / 2);
    //pg.pop();
    // const theShader1 = p.createShader(shader1.vs, shader1.fs);
    // const aperture = p.map(frame.count, 0, 1, 180, 90);
    // p.shader(theShader1);
    // theShader1.setUniform(`u_tex`, pg);
    // theShader1.setUniform(`u_time`, -p.frameCount / 35);
    // theShader1.setUniform(`u_aperture`, aperture);
    // theShader1.setUniform('u_resolution', [pg.width, pg.height]);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };
};
