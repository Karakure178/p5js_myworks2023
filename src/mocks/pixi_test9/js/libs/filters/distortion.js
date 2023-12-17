import { Shader } from '../core/shader';
import vertex from '../shaders/normal.vert';
import fragment from '../shaders/distortion.frag';
import { ratioCalculation } from '../utils/ratioCalculation';
import { imgReso } from '../../parameters';

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
      disp: disp.img,
      texture1: img_list[0].img,
      texture2: img_list[1].img,
      angle1: 0.0,
      angle2: 0.0,
      intensity1: 1.0,
      intensity2: 0.0,
      res: [imgReso.width, imgReso.height, 1.0, -1.0],
    };

    super({ app: app, uniforms: uniforms, vertex: vertex, fragment: fragment });
    this.disp = disp.img; // 差分画像用
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
  // .bindしないとthisが変わってしまう
  _motion() {
    gsap.timeline({ repeat: -1 }).to(this.frame, {
      count: 1,
      duration: 3,
      ease: 'quad.inOut',
      delay: 1,
      onComplete: this._setUniforms.bind(this),
    });
  }

  _setUniforms() {
    if (this.img_count > this.img_list.length - 2) {
      this.img_count = 0;
      this.filter.uniforms.texture1 = this.img_list[this.img_list.length - 1].img;
      this.filter.uniforms.texture2 = this.img_list[0].img;
    } else {
      this.filter.uniforms.texture1 = this.img_list[this.img_count].img;
      this.filter.uniforms.texture2 = this.img_list[this.img_count + 1].img;
      this.img_count++;
    }
  }
}
