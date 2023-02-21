import { isArray, isObject, isString } from '../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container){
  // TODO 因为参数container暂时没有用到，该情况下使用 rollup 打包会导致打包后的函数不传递该参数，所以需要收到clg一下
  console.log(`[renderer.ts] container: ${container}`);
  patch(vnode, container);
}

function patch(vnode, container){
  // TODO 判断 vnode 类型 => component or element ?
  isString(vnode.type) && processElement(vnode, container);
  isObject(vnode.type) && processComponent(vnode, container);
}

function processElement(vnode, container){
  // 挂载元素
  mountElement(vnode, container);
}

function mountElement(vnode, container){
  const el = document.createElement(vnode.type);

  // TODO 处理 children (String || Array)
  const { children, props} = vnode;
  if(isString(children)){
    el.textContent = children;
  }else if(isArray(children)){
    mountChildren(vnode, el);
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
      el.setAttribute(key, val);
    }
  }


  container.insertBefore(el, null);
}


function mountChildren(vnode, container){
 vnode.children.forEach(v => patch(v, container));
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