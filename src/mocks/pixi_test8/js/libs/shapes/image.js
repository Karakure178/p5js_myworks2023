class Image extends Shape {
  constructor(app, path, is_tex = false, is_set = false) {
    super(app, path);
    this.is_load = false; // 画像がロードされているかどうか
    this.is_tex = is_tex; // テクスチャーとして使うかSpriteとして使うか
    this.is_set = is_set; // 画像をコンテナ or appにセットするかどうか

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
    this._load();
    if (this.is_set) this._set();
  }

  /**
   * @method _set
   * @memberof Image
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
   * @memberof Image
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
