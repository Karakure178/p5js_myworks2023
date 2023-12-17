import { Hexagon } from '../shapes/hexagon';

/**
 * @class Grid
 * @description
 * 六角形を画面上に並べるグリッド用クラス<br>
 * シェーダー設定も入ってる
 */
export class Grid {
  constructor({ app: app, container: container }) {
    this.app = app;
    this.container = container;
    this.hexagons = [];
    this.filter;
    this._init();
    console.log('grid', this.container);
  }

  /**
   * @memberof Grid
   * @method _init
   * @protected
   * @description
   * 初期化,グリッドを作成する
   */
  _init() {
    this._createGrid(10);
    //this._setShader();
  }

  /**
   * @memberof Grid
   * @method _createGrid
   * @protected
   * @description
   * グリッドを作成する関数<br>
   * TODO 要確認
   */
  _createGrid(num) {
    const n1 = num + 1;

    const margin_left = this.app.screen.width / n1 / n1;
    const margin_bottom = this.app.screen.height / n1 / n1;

    const nw = this.app.screen.width / n1;
    const nh = this.app.screen.height / n1;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        const hexagon = new Hexagon({
          app: this.app,
          container: this.container,
          center: { x: x + nw / 2, y: y + nh / 2 },
          radius: nw / 3,
          color: 0x000000,
        });
        this.hexagons.push(hexagon);
      }
    }
  }
}
