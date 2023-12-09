import gsap from 'gsap';

/**
 * フレームの動きをアニメーション化します。
 * @param {Array} frame - フレーム情報の配列
 */
const motion = (frame) => {
  gsap
    .timeline({ repeat: -1 })
    .to(frame, {
      count: 1,
      duration: 2,
      ease: 'expo.inOut',
    })
    .to(frame, {
      count: 0,
      duration: 2,
      ease: 'expo.inOut',
    });
};
