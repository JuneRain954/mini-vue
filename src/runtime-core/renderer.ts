import { isArray } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(vnode, container, parentComponent){
  // TODO 因为参数container暂时没有用到，该情况下使用 rollup 打包会导致打包后的函数不传递该参数，所以需要收到clg一下
  console.log(`[renderer.ts] container: ${container}`);
  patch(vnode, container, parentComponent);
}

function patch(vnode, container, parentComponent){
  // TODO 判断 vnode 类型 => component or element ?
  const { type, shapeFlag } = vnode;
  switch(type){
    case Fragment: {
      procrssFragment(vnode, container, parentComponent);
      break;
    }
    case Text: {
      procrssText(vnode, container);
      break;
    }
    default: {
      if(shapeFlag & ShapeFlags.ELEMENT) processElement(vnode, container, parentComponent);
      if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) processComponent(vnode, container, parentComponent);
      break;
    }
  }
}

function procrssFragment(vnode, container, parentComponent){
  mountChildren(vnode, container, parentComponent);
}

function procrssText(vnode, container){
  const { children } = vnode;
  const el = document.createTextNode(children);
  vnode.el = el;
  container.insertBefore(el, null);
}

function processElement(vnode, container, parentComponent){
  // 挂载元素
  mountElement(vnode, container, parentComponent);
}

function mountElement(vnode, container, parentComponent){
  const el = document.createElement(vnode.type);
  vnode.el = el;

  // TODO 处理 children (String || Array)
  const { children, props, shapeFlag } = vnode;
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
    el.textContent = children;
  }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
    mountChildren(vnode, el, parentComponent);
  }

  // 处理 props 
  for(let key in props){
    const val = props[key];
    if(isArray(val)){
      if(key === "class"){
        const value = val.join(" ");
        el.setAttribute(key, value)
      }
    }else{
      if(isOn(key)){
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
      }else{
        el.setAttribute(key, val);
      }
    }
  }

  container.insertBefore(el, null);
}

function isOn(key){
  return /^on[A-Z]/.test(key);
}


function mountChildren(vnode, container, parentComponent){
 vnode.children.forEach(v => patch(v, container, parentComponent));
}

function processComponent(vnode, container, parentComponent){
  // 挂载组件
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(vnode, container, parentComponent){
  const instance = createComponentInstance(vnode, parentComponent);
  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance, vnode, container){
  const proxy = instance.proxy;
  const subTree = instance.render.call(proxy);
  patch(subTree, container, instance);
  vnode.el = subTree.el;
}