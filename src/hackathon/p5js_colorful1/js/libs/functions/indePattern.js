/* 円と円のあたり判定の処理を確認するテスト関数
 * @method base
 * @param  {Number}        count       フレームカウント用
 */
function cross(pg) {
  const r = 40;
  const x = 0;
  const y = 0;

  const xx = r;
  const yy = 140;

  const xxx = yy;
  const yyy = r;
  for (let i = 0; i < 10; i++) {
    pg.push();
    pg.translate(x + i * r, y + i * r);
    if (i % 2 === 0) {
      pg.fill('#FFF5E0');
    } else {
      pg.fill('#C70039');
    }
    pg.rect(x, y, xx, yy);
    if (i % 2 === 0) {
      pg.fill('#FF6969');
    } else {
      pg.fill('#141E46');
    }

    pg.rect(xx, y, xxx, yyy);
    pg.pop();
  }
}
