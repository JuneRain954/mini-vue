import { effect } from '../reactivity/effect';
import { deleteProperty, hasOwnProperty } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';

export function createRenderer(options){
  const { 
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options;

  function render(prevVNode, vnode, container, parentComponent){
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
    // 更新 props
    const oldProps = prevVNode.props || {};
    const newProps = vnode.props || {};
    const el = (vnode.el = prevVNode.el);
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps){
    // 更新
    for (const key in newProps) {
      let oldVal = oldProps[key];
      let newVal = newProps[key];
      if(newVal != oldVal){
        hostPatchProp(el, key, oldVal, newVal);
        deleteProperty(oldProps, key);
      }
    }
    // 删除
    for(const key in oldProps){
      if(!hasOwnProperty(newProps, key)){
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }

  function mountElement(prevVNode, vnode, container, parentComponent){
    // 创建 element
    const el = hostCreateElement(vnode.type);
    // const el = document.createElement(vnode.type);
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
      hostPatchProp(el, key, null, val);

      // if(isArray(val)){
      //   if(key === "class"){
      //     const value = val.join(" ");
      //     el.setAttribute(key, value)
      //   }
      // }else{
      //   if(isOn(key)){
      //     const event = key.slice(2).toLowerCase();
      //     el.addEventListener(event, val);
      //   }else{
      //     el.setAttribute(key, val);
      //   }
      // }
    }

    // 插入 element
    hostInsert(el, container);
    // container.insertBefore(el, null);
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
        // 初始化
        const proxy = instance.proxy;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        vnode.el = subTree.el;
        instance.isMounted = true;
      }else{
        // 更新
        const proxy = instance.proxy;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
        vnode.el = subTree.el;
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}