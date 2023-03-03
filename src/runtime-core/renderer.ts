import { effect } from '../reactivity/effect';
import { isArray } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(prevVNode, vnode, container, parentComponent){
  patch(prevVNode, vnode, container, parentComponent);
}

function patch(prevVNode, vnode, container, parentComponent){
  // TODO 判断 vnode 类型 => component or element ?
  const { type, shapeFlag } = vnode;
  switch(type){
    case Fragment: {
      procrssFragment(prevVNode, vnode, container, parentComponent);
      break;
    }
    case Text: {
      procrssText(vnode, container);
      break;
    }
    default: {
      if(shapeFlag & ShapeFlags.ELEMENT) processElement(prevVNode, vnode, container, parentComponent);
      if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) processComponent(vnode, container, parentComponent);
      break;
    }
  }
}

function procrssFragment(prevVNode, vnode, container, parentComponent){
  mountChildren(prevVNode, vnode, container, parentComponent);
}

function procrssText(vnode, container){
  const { children } = vnode;
  const el = document.createTextNode(children);
  vnode.el = el;
  container.insertBefore(el, null);
}

function processElement(prevVNode, vnode, container, parentComponent){
  if(!prevVNode){
    // 挂载元素
    mountElement(prevVNode, vnode, container, parentComponent);
  }else{
    // 更新元素
    patchElement(prevVNode, vnode, container);
  }
}

function patchElement(prevVNode, vnode, container){
  console.log("patchElement: ", prevVNode, vnode);
}

function mountElement(prevVNode, vnode, container, parentComponent){
  const el = document.createElement(vnode.type);
  vnode.el = el;

  // TODO 处理 children (String || Array)
  const { children, props, shapeFlag } = vnode;
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
    el.textContent = children;
  }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
    mountChildren(prevVNode, vnode, el, parentComponent);
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


function mountChildren(prevVNode, vnode, container, parentComponent){
 vnode.children.forEach(v => patch(prevVNode, v, container, parentComponent));
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
  effect(() => {
    if(!instance.isMounted){
      const proxy = instance.proxy;
      const subTree = (instance.subTree = instance.render.call(proxy));
      patch(null, subTree, container, instance);
      vnode.el = subTree.el;
      instance.isMounted = true;
    }else{
      const proxy = instance.proxy;
      const subTree = instance.render.call(proxy);
      const prevSubTree = instance.subTree;
      instance.subTree = subTree;
      patch(prevSubTree, subTree, container, instance);
      vnode.el = subTree.el;
    }
  })
}