/**
 * くまさんを作る
 * @function bear
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {p5} p - p5インスタンス
 * @param {number} x - くまを呼び出す中心座標x
 * @param {number} y - くまを呼び出す中心座標y
 * @param {number} r - くまの直径
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 * @param {string} c3 - 色3
 */
export const bear = (pg, p, x, y, r, c1, c2, c3) => {
  const ear_width = r / 2.8;
  const ear_height = y - r / 3;
  const eye_angle = 10;
  const nose_height = y + r / 10;
  const mouth_height = nose_height + r / 20;

  // 耳
  const ear = () => {
    // 両耳(外枠)
    pg.push();
    pg.fill(c1);
    const left_ear = x - ear_width;
    const right_ear = x + ear_width;
    pg.circle(left_ear, ear_height, r / 3);
    pg.circle(right_ear, ear_height, r / 3);
    pg.pop();

    // 両耳(内枠)
    pg.push();
    pg.fill(c2);
    const left_ear_small = x - ear_width;
    const right_ear_small = x + ear_width;
    pg.circle(left_ear_small, ear_height, r / 4);
    pg.circle(right_ear_small, ear_height, r / 4);
    pg.pop();
  };
  ear();

  // 土台
  pg.fill(c1);
  pg.ellipse(x, y, r, r / 1.2);

  // 鼻
  const nose = () => {
    pg.push();
    pg.fill(c3);
    pg.circle(x, nose_height, r / 20);
    pg.pop();
  };
  nose();

  // 左目
  const left_eye = (angle) => {
    pg.push();
    // 黒目
    pg.fill(100);
    pg.stroke(50);
    pg.strokeWeight(0.8);
    pg.translate(x + r / 4.2, y - r / 10);
    pg.rotate(p.radians(angle));
    pg.arc(0, 0, r / 4, r / 4, p.radians(0), p.radians(180), p.CHORD);

    // 白目
    pg.fill(255);
    pg.arc(0, 0, r / 5, r / 5, p.radians(0), p.radians(180), p.CHORD);

    // 黒目
    pg.fill(10);
    pg.arc(0, 0, r / 10, r / 10, p.radians(0), p.radians(180), p.CHORD);
    pg.pop();
  };
  left_eye(eye_angle);

  // 右目
  const right_eye = (angle) => {
    pg.push();
    // 黒目
    pg.fill(100);
    pg.stroke(50);
    pg.strokeWeight(0.8);
    pg.translate(x - r / 4.2, y - r / 10);
    pg.rotate(p.radians(-angle));
    pg.arc(0, 0, r / 4, r / 4, p.radians(0), p.radians(180), p.CHORD);

    // 白目
    pg.fill(255);
    pg.arc(0, 0, r / 5, r / 5, p.radians(0), p.radians(180), p.CHORD);

    // 黒目
    pg.fill(10);
    pg.arc(0, 0, r / 10, r / 10, p.radians(0), p.radians(180), p.CHORD);
    pg.pop();
  };
  right_eye(eye_angle);

  // 口(枠なし)
  const mouth = () => {
    pg.push();
    pg.stroke(c3);
    pg.strokeWeight(2);
    pg.line(x, mouth_height, x - r / 20, nose_height + r / 10);
    pg.line(x, mouth_height, x + r / 20, nose_height + r / 10);
    pg.pop();
  };
  mouth();
};
