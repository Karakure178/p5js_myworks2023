/**
 * ハッカソン用スケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  const frame = { count: 0 };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    motion(frame);
  };

  p.draw = () => {
    p.background('#F3EEEA');
    p.translate(-p.width / 2, -p.height / 2);

    pg.push();
    //pg.translate(p.width / 2, p.height / 2);
    pg.pop();

    // const theShader1 = p.createShader(shader1.vs, shader1.fs);
    // const aperture = p.map(frame.count, 0, 1, 180, 90);
    // p.shader(theShader1);
    // theShader1.setUniform(`u_tex`, pg);
    // theShader1.setUniform(`u_time`, -p.frameCount / 35);
    // theShader1.setUniform(`u_aperture`, aperture);
    // theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };

  //
};
