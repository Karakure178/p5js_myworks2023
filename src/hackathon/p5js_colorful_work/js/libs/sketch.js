import { gridPosition } from './pg';
import { border, stripe } from './functions/stripe';
import { grid } from './functions/grid';
import { gridLine } from './functions/gridLine';
import { bear } from './functions/bear';
import { circles } from './functions/circles';
import { pGrid } from './functions/gridPattern';
import { sinWave } from './functions/wave';
import { cloverGrid } from './functions/clover';
import { shaderNormal } from './shaders/normal';
import { shaderScan } from './shaders/scanline';
import { shaderFish } from './shaders/fisheye';
import { shaderNoise } from './shaders/whiteNoise';

/**
 * ハッカソン用スケッチ
 * @author Karakure178
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
  let pg_total;
  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.translate(-p.width / 2, -p.height / 2);

    // 全体描画用pg
    pg_total = p.createGraphics(p.width, p.height);

    // 以降処理開始
    const num = 3; // 画面の分割数 num*num分カラーがいる
    pg_group = gridPosition(p, num, colors);
    // ここで関数分けをする
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
        pg.push();
        for (let j = 0; j < 130; j++) {
          const x = p.random(0, pg.width);
          const y = p.random(0, pg.height);
          const rand = Math.floor(p.random(0, pg_group.pgs.length));
          const colors = pg_group.colors[rand];
          bear(pg, p, x, y, pg.width / 5, colors[1], colors[2], colors[3]);
        }
        pg.strokeWeight(20);
        pg.stroke('#FF9209');
        pg.noFill();
        pg.rect(0, 0, pg.width, pg.height);
        pg.pop();
      } else if (funcNum === 6) {
        circles(pg, p, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 7) {
        const rand = Math.floor(p.random(2, 10));
        pGrid(pg, p, rand, pg_group.colors[i][1], pg_group.colors[i][2]);
      } else if (funcNum === 8) {
        const c1 = pg_group.colors[i][1];
        const c2 = pg_group.colors[i][2];
        sinWave(pg, p, 0, 0, pg.width, pg.height, 60, c1, c2);
      } else if (funcNum === 9) {
        // クローバー
        const c1 = pg_group.colors[i][1];
        const c2 = pg_group.colors[i][2];
        cloverGrid(pg, p, Math.floor(p.random(2, 8)), c1, c2);
      }
      pg_total.image(pg_group.pgs[i], pg_group.res[i].x, pg_group.res[i].y);
    }

    // ここでerase使うか否かを分ける
    for (let i = 0; i < pg_group.pgs.length; i++) {
      const pg = pg_group.pgs_erase[i];
      const funcNum = pg_group.rand[i];

      if (funcNum === 1) {
        pg.push();
        pg.rectMode(p.CENTER);
        pg.translate(pg.width / 2, pg.height / 2);
        pg.erase();
        pg.rect(0, 0, pg.width / 1.1, pg.height / 1.1);
        pg.noErase();
        pg.pop();
        pg_total.image(pg, pg_group.res[i].x, pg_group.res[i].y);
      } else if (funcNum === 2) {
        pg.push();
        pg.rectMode(p.CENTER);
        pg.translate(pg.width / 2, pg.height / 2);
        pg.erase();
        pg.rect(0, 0, pg.width / 1.4, pg.height / 1.4);
        pg.noErase();
        pg.pop();
        pg_total.image(pg, pg_group.res[i].x, pg_group.res[i].y);
      } else if (funcNum === 3) {
        pg.push();
        pg.translate(pg.width / 2, pg.height / 2);
        pg.erase();
        pg.circle(0, 0, pg.width / 1.3);
        pg.noErase();
        pg.pop();
        pg_total.image(pg, pg_group.res[i].x, pg_group.res[i].y);
      }
    }

    // ここでどのシェーダーを使うかわける
    const randShader = Math.floor(p.random(1, 5));
    if (randShader === 1) {
      // 走査線表現
      const theShader1 = p.createShader(shaderScan.vs, shaderScan.fs);
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg_total);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform('u_resolution', [pg_total.width, pg_total.height]);
    } else if (randShader === 2) {
      // 魚眼レンズ
      const theShader1 = p.createShader(shaderFish.vs, shaderFish.fs);
      const aperture = 178;
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg_total);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform(`u_aperture`, aperture);
      theShader1.setUniform('u_resolution', [pg_total.width, pg_total.height]);
    } else if (randShader === 3) {
      // ホワイトノイズ
      const theShader1 = p.createShader(shaderNoise.vs, shaderNoise.fs);
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg_total);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform('u_resolution', [pg_total.width, pg_total.height]);
    } else {
      // ノーマル：変化なし
      const theShader1 = p.createShader(shaderNormal.vs, shaderNormal.fs);
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg_total);
    }

    p.image(pg_total, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };
};
