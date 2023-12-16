import { Shape } from '../core/shape';

export class Image extends Shape {
  // オブジェクトにすると順不同にできる
  // https://zenn.dev/rabee/articles/javascript-destructuring-assignment-default-params
  constructor({ app, container, path, is_tex = false }) {
    super({ app: app, container: container, path: path });
    this.is_load = false; // 画像がロードされているかどうか
    this.is_tex = is_tex; // テクスチャーとして使うかSpriteとして使うか(spriteの場合は_setが走る)

    this._init();
  }

  /**
   * @method _init
   * @memberof Image
   * @protected
   * @override
   * @description
   */
  _init() {
    // 画像を読み込む 遅延処理としてloaderを使う
    // https://zenn.dev/tonbi/articles/a120c86ca99316
    console.log('this.path', this.app);
    this.app.loader.add(this.path).load(this._load);
  }

  /**
   * @method _set
   * @memberof Image
   * @protected
   * @override
   * @description
   * 画像をコンテナ or appにセットする
   * もしテクスチャとして呼び出す場合はセットしない
   */
  _set() {
    if (!this.is_tex) {
      if (this.container !== null) {
        this.container.addChild(this.shape);
      } else {
        this.app.stage.addChild(this.shape);
      }
    }
  }

  /**
   * @method _load
   * @memberof Image
   * @protected
   * @description
   * 画像をロードする loader内で実行される
   */
  _load() {
    // TODO  読み込みタイミングによって順番が変わってしまうので要修正
    const tex = this.app.loader.resources[this.path].texture;
    if (this.is_tex) {
      this.shape = tex;
    } else {
      this.shape = new PIXI.Sprite(tex);
    }
    this.is_load = true;
    this._set();
  }

  /**
   * @method getShape
   * @memberof Image
   * @protected
   * @override
   * @return {PIXI.Sprite|PIXI.Texture} img - Sprite or Texture
   * @description
   * 画像(Sprite or Texture)を返す
   */
  getShape() {
    return this.img;
  }
}

/**
 * @class OldImage
 * @extends {Shape}
 * @description
 * 読み込み処理を自力で書いたパターンのOldImage クラス
 */
class OldImage extends Shape {
  constructor(app, path, is_tex = false, is_set = false) {
    super(app, path);
    this.is_load = false; // 画像がロードされているかどうか
    this.is_tex = is_tex; // テクスチャーとして使うかSpriteとして使うか
    this.is_set = is_set; // 画像をコンテナ or appにセットするかどうか

    this._init();
  }

  /**
   * @method _init
   * @memberof OldImage
   * @protected
   * @override
   * @description
   */
  _init() {
    this._load();
    if (this.is_set) this._set();
  }

  /**
   * @method _set
   * @memberof OldImage
   * @protected
   * @override
   * @description
   * 画像をコンテナ or appにセットする 遅延処理あり
   */
  _set() {
    const timerId = setInterval(() => {
      if (this.is_load) {
        clearInterval(timerId);
        if (this.container !== null) {
          this.container.addChild(this.shape);
        } else {
          this.app.stage.addChild(this.shape);
        }
      }
    }, 100);
  }

  /**
   * @method _load
   * @memberof OldImage
   * @protected
   * @description
   * 画像をロードする
   */
  _load() {
    // 画像を読み込む 遅延処理
    // TODO  読み込みタイミングによって順番が変わってしまうので要修正
    PIXI.Assets.load(this.path).then((texture) => {
      if (this.is_tex) {
        this.img = new PIXI.Texture(texture.baseTexture);
      } else {
        const tex = new PIXI.Texture(texture.baseTexture);
        this.img = new PIXI.Sprite(tex);
      }
      this.is_load = true;
    });
  }

  /**
   * @method getShape
   * @memberof OldImage
   * @protected
   * @override
   * @return {PIXI.Sprite|PIXI.Texture} img - Sprite or Texture
   * @description
   * 画像(Sprite or Texture)を返す
   */
  getShape() {
    return this.img;
  }
}
