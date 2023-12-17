import { Shader } from '../core/shader';
import vertex from '../shaders/normal.vert';
import fragment from '../shaders/fisheye.frag';
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
  constructor({ app, tex = null, container }) {
    const uniforms = {};

    super({ app: app, container: container, uniforms: uniforms, vertex: vertex, fragment: fragment });
  }
}
