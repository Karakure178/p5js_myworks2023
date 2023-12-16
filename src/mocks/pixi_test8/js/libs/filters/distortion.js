import { Shader } from '../core/shader';
import vertex from '../shaders/normal.vert';
import fragment from '../shaders/distortion.frag';
import gsap from 'gsap';

/**
 * @class Distortion
 * @description
 * distortion effectシェーダークラス<br>
 * 画像と画像を重ねて描画できる
 * */
export class Distortion extends Shader {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {PIXI.Texture} disp - 差分画像用
   * @param {[PIXI.Texture]} img_list - 配列の画像
   */
  constructor({ app, disp, img_list }) {
    const uniforms = {
      dispFactor: 0.0,
      u_time: { type: '1f', value: 0.0 },
      u_resolution: { type: 'v2', value: [app.renderer.width, app.renderer.height] },
      u_disp: { type: 'sampler2D', value: disp },
      u_texture: { type: 'sampler2D', value: img_list[0] },
      u_texture2: { type: 'sampler2D', value: img_list[1] },
      angle1: 0.0,
      angle2: 0.0,
      intensity1: 1.0,
      intensity2: 0.0,
      res: [app.screen.width, app.screen.height, 1.0, -1.0],
    };

    super({ app: app, uniforms: uniforms, vertex: vertex, fragment: fragment });
    this.disp = disp; // 差分画像用
    this.img_list = img_list;
    this.img_count = 1;
    this.frame = { count: 0 };
    this._init();
  }

  _init() {
    this._motion();
  }

  /**
   * @method ticker
   * @override
   */
  ticker() {
    const time = this.frame.count;
    this.filter.uniforms.dispFactor = time;
  }

  // gsapを使ったモーション作成
  _motion() {
    gsap.timeline({ repeat: -1 }).to(this.frame, {
      count: 1,
      duration: 3,
      ease: 'quad.inOut',
      delay: 1,
      onComplete: () => {
        if (this.img_count > this.img_list.length - 2) {
          this.img_count = 0;
          this.filter.uniforms.u_texture1 = this.img_list[this.img_list.length - 1];
          this.filter.uniforms.u_texture2 = this.img_list[0];
        } else {
          this.filter.uniforms.u_texture1 = this.img_list[this.img_count];
          this.filter.uniforms.u_texture2 = this.img_list[this.img_count + 1];
          this.img_count++;
        }
      },
    });
  }
}
