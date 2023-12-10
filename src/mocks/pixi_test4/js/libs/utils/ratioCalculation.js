/**
 * @function
 * 値の比率計算をする関数
 * たとえば x(x_left):900(y_left) = 1920(x_right):1080(y_rihgt) を解くのと同じ
 * @param {number} y_left   左辺の固定値y
 * @param {number} x_right  右辺の固定値x
 * @param {number} y_right  右辺の固定値y
 */
export const ratioCalculation = (y_left, x_right, y_right) => {
  const x_left = (y_left * x_right) / y_right;
  return x_left;
};
