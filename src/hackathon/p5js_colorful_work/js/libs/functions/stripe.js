// 縞模様
export const stripe = (pg, c1, c2) => {
  const n = Math.floor(pg.random(5, 14));
  const w = pg.width;
  const h = pg.height;
  pg.push();
  pg.noStroke();
  for (let i = 0; i < n; i++) {
    pg.fill(c2);
    if (i % 2 === 0) pg.fill(c1);

    const y = (h / n) * i;
    pg.rect(0, y, w, n);
  }
  pg.pop();
};

// 縞模様
export const border = (pg, c1, c2) => {
  const n = Math.floor(pg.random(10, 30));
  const w = pg.width;
  const h = pg.height;
  pg.push();
  pg.noStroke();
  for (let i = 0; i < n; i++) {
    pg.fill(c2);
    if (i % 2 === 0) pg.fill(c1);
    const x = (w / n) * i;
    pg.rect(x, 0, n, h);
  }
  pg.pop();
};
