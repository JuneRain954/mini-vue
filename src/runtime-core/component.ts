import { isObject } from "../shared/index";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initProps } from './componentProps';
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";

export function createComponentInstance(vnode){
  const component = {
    vnode,
    type: vnode.type,
    steupState: null,
    proxy: null,
    props: {},
    emit: () => {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}


export function setupComponent(instance){
  // initProps   
  initProps(instance, instance.vnode.props);
  // TODO initSlots   

  setupStatefulComponent(instance);
}


function setupStatefulComponent(instance){
  const component = instance.type;
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers);
  const { setup }  = component;
  if(setup){
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
    handleSetupResult(instance, setupResult);
  }
}


function handleSetupResult(instance, setupResult){
 // TODO 处理 function 类型的参数

 // 处理 Object 类型的参数
 if(isObject(setupResult)){
  instance.setupState = setupResult;
 }
 finishComponentSetup(instance);
}

function finishComponentSetup(instance){
  const component = instance.type;
  if(component.render){
    instance.render = component.render;
  }

}