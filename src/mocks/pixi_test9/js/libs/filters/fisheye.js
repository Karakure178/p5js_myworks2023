import { Shader } from '../core/shader';
import vertex from '../shaders/normal.vert';
import fragment from '../shaders/fisheye.frag';
//import fragment from '../shaders/normal.frag';
import { imgReso } from '../../parameters';
import * as PIXI from 'pixi.js';

/**
 * @class Fisheye
 * @description
 * distortion effectシェーダークラス<br>
 * 画像と画像を重ねて描画できる
 * */
export class Fisheye extends Shader {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {PIXI.Texture} tex - 画像
   */
  constructor({ app, tex }) {
    const uniforms = {
      u_texture: tex.img,
    };

    super({ app: app, uniforms: uniforms, vertex: vertex, fragment: fragment });
  }

  /**
   * @method setTexture
   */
  setTexture() {
    this.buffer = new PIXI.Framebuffer(this.tex.width, this.tex.height);
    return this.buffer.colorTexture;
  }
}
