// 自定义渲染
import { createRenderer } from '../../lib/guide-mini-vue.esm.js';
import { App } from "./App.js";


console.log("[main.js] PIXI: ", PIXI);
// 创建画布
let game = new PIXI.Application({
  width: 500, // 宽
  height: 500, // 高
});
// 渲染画布
document.body.append(game.view);

let renderer = createRenderer({
  createElement,
  patchProp,
  insert,
});

function createElement(type){
  let graph = undefined;
  switch(type){
    case "rect": {
      // 创建矩形
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      graph = rect;
      break;
    }
    default: {
      break;
    }
  }
  return graph;
}

function patchProp(el, key, val){
  el[key] = val;
}

function insert(el, container){
  container.addChild(el);
}

// 渲染
renderer.createApp(App).mount(game.stage);