import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let img; // 画像を格納する変数
  let is_img = false;

  let is_prev = false;
  let is_next = false;

  const canvas = document.getElementById('canvas'); // canvas要素を取得
  const frame = { count: 5 }; // モーション用のカウンター
  const imgReso = {
    width: 1216,
    height: 832,
  }; // 画像の解像度

  const init_app = {
    width: imgReso.width,
    height: imgReso.height,
    backgroundColor: 0x061639,
    antialias: true,
    resolution: 1,
    resizeTo: window,
  };
  //  resolution: window.devicePixelRatio || 1,

  // 画面サイズに合わせてcanvasのサイズを変更
  init_app.width = window.innerWidth;
  init_app.height = ratioCalculation(init_app.width, imgReso.height, imgReso.width);

  // setup関数とdraw関数を定義
  const setup = () => {
    app = new PIXI.Application(init_app); // pixiアプリケーションを作成
    canvas.appendChild(app.view); // canvas要素をDOMに追加
    globalThis.__PIXI_APP__ = app;

    motion(frame); // モーションを作成

    // https://pixijs.com/playground?source=undefined&exampleId=textures.textureRotate
    const path = '../../mocks/pixi_test3/images/test1.png';
    PIXI.Assets.load(path).then((texture) => {
      const bg1 = new PIXI.Texture(texture.baseTexture);
      img = new PIXI.Sprite(bg1);
      app.stage.addChild(img);

      // 画像が読み込まれたらtrueにする
      is_img = true;
    });

    //  以降ボタン処理
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    // スライド用ボタン処理
    prev.addEventListener('click', () => {
      is_prev = true;
      console.log('prevがクリックされました');
    });

    next.addEventListener('click', () => {
      is_next = true;
      console.log('nextがクリックされました');
    });
    // スライド用ボタン処理終了

    // 画像がクリックされた時の処理（遅延読み込み対策あり）
    if (!is_img) {
      const timeid = setInterval(() => {
        if (is_img) {
          clearInterval(timeid);

          // v7では以下のように書く
          img.eventMode = 'static';
          img.cursor = 'pointer';

          // https://pixijs.com/examples/events/click
          img.on('pointerdown', (e) => {
            console.log('imgがクリックされました', e);

            // https://qiita.com/kerupani129/items/099c7143b59648ce9344
            const points = e.data.getLocalPosition(e.currentTarget);
            onAssetsLoaded(app, points.x, points.y);
          });
        }
        console.log('画像が読み込まれていません');
      }, 100);
    }
  };

  // ここに描画処理を記述
  const draw = () => {
    app.ticker.add(() => {
      if (is_prev) {
        img.x += 10;
        if (img.x > img.width) is_prev = false;
      }

      // 画像読み込み遅延用処理噛まさないとエラー吐く
      if (is_img) {
        img.width = app.screen.width;
        img.height = ratioCalculation(img.width, imgReso.height, imgReso.width);
      }
    });
  };

  setup(); // pixiアプリケーションをセットアップ
  draw(); // pixiアプリケーションを描画
};

// gsapを使ったモーション作成
const motion = (frame) => {
  // ここにモーション処理を記述
  gsap.timeline({ repeat: -1 }).to(frame, {
    count: 1,
    duration: 3,
    ease: 'expo.inOut',
  });
};

const onAssetsLoaded = (app, x, y) => {
  // Build the filter
  const filter = new PIXI.Filter(null, fragment, {
    time: 0,
    speed: 1000,
    amplitude: 4,
    wavelength: 200,
    brightness: 1.4,
    radius: 500,
    center: [x, y],
  });
  //    center: [0, 0],
  //center: [points.x, points.y],

  app.stage.filterArea = app.renderer.screen;
  app.stage.filters = [filter];

  // Listen for animate update.
  let totalTime = 0;
  app.ticker.add((delta) => {
    filter.uniforms.time = totalTime;
    totalTime += delta / 60;
    if (totalTime > 5) totalTime = 0;
  });
};

/*
 * filter定義
  // https://github.com/pixijs/filters/blob/main/filters/shockwave/src/shockwave.frag
  // filterAreaとfilterClampは、pixiアプリケーションのサイズに合わせて自動的に設定される
 */
const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 center;

uniform float amplitude;
uniform float wavelength;
uniform float brightness;
uniform float speed;
uniform float radius;

uniform float time;

const float PI = 3.14159;

void main()
{
    float halfWavelength = wavelength * 0.5 / filterArea.x;
    float maxRadius = radius / filterArea.x;
    float currentRadius = time * speed / filterArea.x;

    float fade = 1.0;

    if (maxRadius > 0.0) {
        if (currentRadius > maxRadius) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);
    }

    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);
    dir.y *= filterArea.y / filterArea.x;
    float dist = length(dir);

    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    vec2 diffUV = normalize(dir);

    float diff = (dist - currentRadius) / halfWavelength;

    float p = 1.0 - pow(abs(diff), 2.0);

    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );
    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );

    vec2 offset = diffUV * powDiff / filterArea.xy;

    // Do clamp :
    vec2 coord = vTextureCoord + offset;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    // No clamp :

    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;

    gl_FragColor = color;
}
`;
