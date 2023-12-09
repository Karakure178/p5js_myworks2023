// 縞模様
export const stripe = (pg, c1, c2) => {
  const n = 10;
  const w = pg.width;
  const h = pg.height;
  pg.push();
  pg.noStroke();
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) pg.fill(c1);
    pg.fill(c2);

    const y = (h / n) * i;
    pg.rect(0, y, w, n);
  }
  pg.pop();
};

// 縞模様
export const border = (pg, c1, c2) => {
  const n = 10;
  const w = pg.width;
  const h = pg.height;
  pg.push();
  pg.noStroke();
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) pg.fill(c1);
    pg.fill(c2);

    const x = (w / n) * i;
    pg.rect(x, 0, n, h);
  }
  pg.pop();
};
