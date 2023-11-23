import { CanvasCapture } from 'canvas-capture';

export const loop = () => {
  let gifCapture;
  const GIF_OPTIONS = {
    name: 'demo-gif',
    quality: 1,
    fps: 60,
    onExportProgress: (progress) => console.log(`GIF export progress: ${progress}.`),
    onExportFinish: () => console.log(`Finished GIF export.`),
  };
  CanvasCapture.init(document.getElementById('defaultCanvas0'), { showRecDot: false });
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
