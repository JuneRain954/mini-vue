import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container){
  // TODO 因为参数container暂时没有用到，该情况下使用 rollup 打包会导致打包后的函数不传递该参数，所以需要收到clg一下
  console.log(`[renderer.ts] container: ${container}`);
  patch(vnode, container);
}

function patch(vnode, container){
  // TODO 判断 vnode 类型 => component or element ?
  // 处理组件类型
  processComponent(vnode, container);
}

function processComponent(vnode, container){
  // 挂载组件
  mountComponent(vnode, container);
}

function mountComponent(vnode, container){
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container){
  const subTree = instance.render();
  patch(subTree, container);
}