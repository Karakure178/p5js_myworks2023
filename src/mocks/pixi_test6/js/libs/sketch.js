import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';
import { map } from './utils/map';
let is_prev = false;
let is_next = false;

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let img; // 画像を格納する変数
  let is_img = false;

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
    console.log(app.screen.width, app.screen.height);

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
      setTimeout(() => {
        is_prev = false;
      }, 1000);
    });

    next.addEventListener('click', () => {
      is_next = true;
      console.log('nextがクリックされました');
      setTimeout(() => {
        is_next = false;
      }, 10000);
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
      // 画像を動かす処理/GLSLでやるから結局いらない
      // if (is_prev) {
      //   img.x += 10;
      //   if (img.x > img.width) is_prev = false;
      // }

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

  // 画像を動かす用のfilter
  const filter2 = new PIXI.Filter(null, fragment2, {
    dispFactor: 0.0,
    dpr: 0.1,
    disp: PIXI.Texture.from('https://pixijs.com/assets/perlin.jpg'),
    texture1: PIXI.Texture.from('../../mocks/pixi_test5/images/test1.png'),
    texture2: PIXI.Texture.from('../../mocks/pixi_test5/images/test2.png'),
    angle1: 0.0,
    angle2: 0.0,
    intensity1: 0.3,
    intensity2: 0.3,
    res: [app.screen.width, app.screen.height, 1.0, 1.0],
  });

  app.stage.filterArea = app.renderer.screen;
  app.stage.filters = [filter2, filter]; // 重ねたい順番に記述

  // Listen for animate update.
  let totalTime = 0;
  app.ticker.add((delta) => {
    filter.uniforms.time = totalTime;
    if (is_next) {
      if (totalTime < 5) {
        const time = map(totalTime, 0, 5, 0.0, 1.0);
        filter2.uniforms.dispFactor = time;
      } else {
        const time = map(totalTime, 5, 10, 1.0, 0.0);
        filter2.uniforms.dispFactor = time;
      }
      totalTime += delta / 60;
    } else {
      filter2.uniforms.dispFactor = 0;
      totalTime = 0;
    }

    // if (totalTime > 5) totalTime = 0;
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

const sample_frag = `
varying vec2 vTextureCoord;

uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;

float PI = 3.14159265358979;

void main() {
  vec2 uv = vTextureCoord;
  vec4 tex = texture2D(u_tex, uv);

  gl_FragColor = tex;
}
`;

// 画像を動かす用のフラグメントシェーダー
const fragment2 = `
  varying vec2 vTextureCoord;

  uniform float dispFactor; // bool = trueなら動く
  uniform float dpr;
  uniform sampler2D disp;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float angle1;
  uniform float angle2;
  uniform float intensity1;
  uniform float intensity2;
  uniform vec4 res;

  float PI = 3.14159265358979;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 vUv = vTextureCoord;
  vec4 disp = texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);

  vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;
  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);

  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);

  vec4 _texture1 = texture2D(texture1, distortedPosition1);
  vec4 _texture2 = texture2D(texture2, distortedPosition2);

  gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;
