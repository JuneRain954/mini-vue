import { isObject } from "../shared/index";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from './componentProps';
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initSlots } from './componentSlots';
import { proxyRefs } from "../reactivity/ref";

let currentInstance = null;

export function createComponentInstance(vnode, parent){
  const component = {
    vnode,
    type: vnode.type,
    setupState: null,
    proxy: null,
    props: {},
    provides: parent ? parent.provides : {},
    parent,
    emit: () => {},
    slots: {},
    isMounted: false,
    subTree: {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}


export function setupComponent(instance){
  // initProps   
  initProps(instance, instance.vnode.props);
  // initSlots   
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}


function setupStatefulComponent(instance){
  const component = instance.type;
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers);
  const { setup }  = component;
  if(setup){
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}


function handleSetupResult(instance, setupResult){
 // TODO 处理 function 类型的参数

 // 处理 Object 类型的参数
 if(isObject(setupResult)){
  instance.setupState = proxyRefs(setupResult);
 }
 finishComponentSetup(instance);
}

function finishComponentSetup(instance){
  const component = instance.type;
  if(component.render){
    instance.render = component.render;
  }

}

function setCurrentInstance(instance){
  currentInstance = instance;
}

export function getCurrentInstance(){
  return currentInstance;
}