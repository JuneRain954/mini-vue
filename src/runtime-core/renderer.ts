import { effect } from '../reactivity/effect';
import { binarySearch, deleteProperty, getSequence, hasOwnProperty, isArray } from '../shared/index';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { Fragment, Text } from './vnode';


const ARRAY_INITIAL_VALUE = Infinity; 

export function createRenderer(options){
  const { 
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(prevVNode, vnode, container, parentComponent, anchor){
    patch(prevVNode, vnode, container, parentComponent, anchor);
  }

  function patch(prevVNode, vnode, container, parentComponent, anchor){
    // TODO 判断 vnode 类型 => component or element ?
    const { type, shapeFlag } = vnode;
    switch(type){
      case Fragment: {
        processFragment(prevVNode, vnode, container, parentComponent, anchor);
        break;
      }
      case Text: {
        processText(vnode, container);
        break;
      }
      default: {
        if(shapeFlag & ShapeFlags.ELEMENT) processElement(prevVNode, vnode, container, parentComponent, anchor);
        if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) processComponent(vnode, container, parentComponent, anchor);
        break;
      }
    }
  }

  function processFragment(prevVNode, vnode, container, parentComponent, anchor){
    mountChildren(prevVNode, vnode.children, container, parentComponent, anchor);
  }

  function processText(vnode, container){
    const { children } = vnode;
    const el = document.createTextNode(children);
    vnode.el = el;
    container.insertBefore(el, null);
  }

  function processElement(prevVNode, vnode, container, parentComponent, anchor){
    if(!prevVNode){
      // 挂载元素
      mountElement(prevVNode, vnode, container, parentComponent, anchor);
    }else{
      // 更新元素
      patchElement(prevVNode, vnode, container, parentComponent, anchor);
    }
  }

  function patchElement(prevVNode, vnode, container, parentComponent, anchor){
    console.log("patchElement: ", prevVNode, vnode);
    // 更新 props
    const oldProps = prevVNode.props || {};
    const newProps = vnode.props || {};
    const el = (vnode.el = prevVNode.el);
    patchProps(el, oldProps, newProps);
    // 更新 children
    patchChildren(prevVNode, vnode, el, parentComponent, anchor);
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

  function patchChildren(prevVNode, vnode, container, parentComponent, anchor){
    const { shapeFlag: prevShapeFlag, children: prevChildren } = prevVNode;
    const { shapeFlag: nextShapeFlag, children: nextChildren } = vnode;
    if(nextShapeFlag & ShapeFlags.TEXT_CHILDREN){
      if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
        unmountChildren(prevChildren);
      }
      if(prevChildren != nextChildren){
        hostSetElementText(container, nextChildren);
      }
    }else if(nextShapeFlag & ShapeFlags.ARRAY_CHILDREN){
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
        hostSetElementText(container, "");
        mountChildren(null, vnode.children, container, parentComponent, anchor);
      }else if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
        // Array(旧) ==> Array(新)
        patchKeyedChildren(prevChildren, nextChildren, container, parentComponent, anchor);
      }
    }
  }


  function patchKeyedChildren(prevChildren, nextChildren, container, parentComponent, anchor){
    let e1 = prevChildren.length - 1;
    let e2 = nextChildren.length - 1;
    let i = 0;
    // 左侧对比
    while(i <= e1 && i <= e2){
      const prevItem = prevChildren[i];
      const nextItem = nextChildren[i];
      if(!isSameNodeType(prevItem, nextItem)) break;
      patch(prevItem, nextItem, container, parentComponent, anchor);
      i++;
    }
    // 右侧对比
    while(e1 >= i && e2 >= i){
      const prevItem = prevChildren[e1];
      const nextItem = nextChildren[e2];
      if(!isSameNodeType(prevItem, nextItem)) break;
      patch(prevItem, nextItem, container, parentComponent, anchor);
      e1--;
      e2--;
    }
    
    if(i > e1){
      if(i <= e2){
        // 新的比老的多 => 创建
        const nextPos = e2 + 1;
        const anchor = nextPos < nextChildren.length ? nextChildren[nextPos].el : null;
        while(i <= e2){
          patch(null, nextChildren[i], container, parentComponent, anchor);
          i++;
        }
      }
    }else if(i > e2){
      // 老的比新的多
      const dirtyChildren = prevChildren.slice(i, e1 + 1);
      unmountChildren(dirtyChildren);
    }else{
      // 中间部分对比 ( i <= e1 && i <= e2 )
      // 遍历新数组，建立 key - index 的映射
      let keyToIndexMap = new Map();
      for(let j = i; j <= e2; j++){
        const key = nextChildren[j].key;
        keyToIndexMap.set(key, j);
      }
      // 遍历旧数组，逐一对比旧节点在新数组中是否存在
      let updatableCount = e2 - i + 1;
      let hasBeenPatched = 0;
      let newIndexToOldIndexMap = getNewIndexToOldIndexMap(updatableCount);
      for(let j = i; j <= e1; j++){
        // 节点更新数量大于等于可更新数量
        if(hasBeenPatched >= updatableCount){
          hostRemove(prevChildren[j].el);
          continue;
        }
        const key = prevChildren[j].key;
        let targetIdx = keyToIndexMap.get(key);
        if(targetIdx == undefined){
          // 映射中找不到则遍历新数组逐个对比
          for(let k = i; k <= e2; k++){
            if(!isSameNodeType(prevChildren[j], nextChildren[k])) continue;
            targetIdx = k;
            break;
          }
        }
        // 更新或删除元素
        if(targetIdx != undefined){
          patch(prevChildren[j], nextChildren[targetIdx], container, parentComponent, null)
          hasBeenPatched++;
          newIndexToOldIndexMap[targetIdx - i] = j;
        }else{
          hostRemove(prevChildren[j].el);
        }
      }
      // 移动或创建元素
      const indexSequence = getSequence(newIndexToOldIndexMap);
      const len = newIndexToOldIndexMap.length - 1;
      for(let k = len; k >= 0; k--) {
        const index = newIndexToOldIndexMap[k];
        const baseIdx = i + k;
        const el = nextChildren[baseIdx].el;
        const anchor = (baseIdx + 1) < nextChildren.length ? nextChildren[baseIdx + 1].el : null;
        if(index === ARRAY_INITIAL_VALUE){
          patch(null, nextChildren[baseIdx], container, parentComponent, anchor);
        }else{
          let isExist = binarySearch(indexSequence, k);
          if(isExist != undefined) continue;
          hostInsert(el, container, anchor);
        }
      }
    }
  }

  function getNewIndexToOldIndexMap(length, initialValue = ARRAY_INITIAL_VALUE){
    let arr = new Array(length);
    for(let i = 0; i < length; i++){
      arr[i] = initialValue;
    }
    return arr;
  }



  function isSameNodeType(vnode1, vnode2){
    return (vnode1.type === vnode2.type) && (vnode1.key === vnode2.key);
  }

  function unmountChildren(children){
    children = isArray(children) ? children : [children];
    children.forEach(vnode => hostRemove(vnode.el));
  }

  function mountElement(prevVNode, vnode, container, parentComponent, anchor){
    // 创建 element
    const el = hostCreateElement(vnode.type);
    // const el = document.createElement(vnode.type);
    vnode.el = el;

    // TODO 处理 children (String || Array)
    const { children, props, shapeFlag } = vnode;
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
      el.textContent = children;
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
      mountChildren(prevVNode, vnode.children, el, parentComponent, anchor);
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
    hostInsert(el, container, anchor);
    // container.insertBefore(el, null);
  }


  function mountChildren(prevVNode, children, container, parentComponent, anchor){
    children.forEach(v => patch(prevVNode, v, container, parentComponent, anchor));
  }

  function processComponent(vnode, container, parentComponent, anchor){
    // 挂载组件
    mountComponent(vnode, container, parentComponent, anchor);
  }

  function mountComponent(vnode, container, parentComponent, anchor){
    const instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container, anchor);
  }

  function setupRenderEffect(instance, vnode, container, anchor){
    effect(() => {
      if(!instance.isMounted){
        // 初始化
        const proxy = instance.proxy;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance, anchor);
        vnode.el = subTree.el;
        instance.isMounted = true;
      }else{
        // 更新
        const proxy = instance.proxy;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance, anchor);
        vnode.el = subTree.el;
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}