export const recter = (p, colors, w, h, n) => {
  // 縞々模様を描きたい
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) p.fill(colors[0]);
    else p.fill(colors[1]);
    p.rect(0, (i * h) / n, w, h / n);
  }
};
