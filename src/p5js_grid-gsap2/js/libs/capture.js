import { CanvasCapture } from 'canvas-capture';

// 参考：https://npm.io/package/canvas-capture
export const loop = () => {
  //console.log('loop');
  let gifCapture;
  const GIF_OPTIONS = {
    name: 'demo-gif',
    quality: 1,
    fps: 24,
    onExportProgress: (progress) => console.log(`GIF export progress: ${progress}.`),
    onExportFinish: () => console.log(`Finished GIF export.`),
  };
  CanvasCapture.init(document.getElementById('defaultCanvas0'), { showRecDot: true });
  CanvasCapture.bindKeyToGIFRecord('g', GIF_OPTIONS);
  requestAnimationFrame(loop);
  CanvasCapture.checkHotkeys();

  if (CanvasCapture.isRecording()) {
    gifCapture = CanvasCapture.recordFrame();
    setTimeout(() => {
      CanvasCapture.stopRecord(gifCapture);
      console.log('stop');
    }, 10000);
  }
};
