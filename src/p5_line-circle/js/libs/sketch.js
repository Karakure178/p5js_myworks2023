import gsap from 'gsap';
/**
 * 円と線を描くスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  const smallCircle_list = { frame: 0, x: [], y: [] };
  const largeCircle_list = { frame: 0, x: [], y: [] };

  p.setup = () => {
    const one = document.getElementById('one');
    const canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    p.strokeWeight(2);
    p.stroke(20);
    point_circle(40, 50, smallCircle_list, 0);
    point_circle(150, 50, largeCircle_list, 5);
    motion(smallCircle_list);
  };

  p.draw = () => {
    p.background(220);
    p.fill(20);
    p.push();
    p.translate(p.width / 2, p.height / 2);

    //円を書いていく
    for (let i = 0; i < smallCircle_list.x.length; i++) {
      const x = p.cos(p.radians(smallCircle_list.frame)) * 50;
      const y = p.sin(p.radians(smallCircle_list.frame)) * 70;
      p.line(smallCircle_list.x[i] + x, smallCircle_list.y[i] + y, largeCircle_list.x[i], largeCircle_list.y[i]);
    }

    for (let i = 0; i < largeCircle_list.x.length; i++) {
      p.point(largeCircle_list.x[i], largeCircle_list.y[i]);
    }
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_line-circle', 6);
    }
  };

  /**
   * Animates the motion of line_list.
   * @param {Array} line_list - The list of lines to animate.
   */
  const motion = (line_list) => {
    gsap
      .timeline({ repeat: -1 })
      .to(line_list, {
        frame: 180,
        duration: 2,
        ease: 'expo.inOut',
      })
      .to(line_list, {
        frame: -360,
        duration: 2,
        ease: 'expo.inOut',
      })
      .to(line_list, {
        frame: 0,
        duration: 2,
        ease: 'expo.inOut',
      });
  };

  /**
   * Generates points on a circle with a given size and number of points.
   * @param {number} size - The size of the circle.
   * @param {number} points - The number of points on the circle.
   * @param {object} line_list - The object containing x and y arrays to store the generated points.
   * @param {number} index - The starting index for generating points.
   */
  const point_circle = (size, points, line_list, index) => {
    const angle = 360 / points;
    for (let i = index; i < points + index; i++) {
      const x = size * p.cos(p.radians(angle * i));
      const y = size * p.sin(p.radians(angle * i));
      line_list.x.push(x);
      line_list.y.push(y);
    }
  };
};
