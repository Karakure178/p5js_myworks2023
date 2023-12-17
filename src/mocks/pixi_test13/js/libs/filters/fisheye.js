import { Shader } from '../core/shader';
import vertex from '../shaders/normal.vert';
import fragment from '../shaders/vennDiagram.frag';
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
   */
  constructor({ app, container, uniforms = null }) {
    super({ app: app, container: container, uniforms: uniforms, vertex: vertex, fragment: fragment });
  }
}
