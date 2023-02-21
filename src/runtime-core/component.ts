import { isObject } from "../shared/index";

export function createComponentInstance(vnode){
  const component = {
    vnode,
    type: vnode.type,
  };

  return component;
}


export function setupComponent(instance){
  // TODO initProps   
  // TODO initSlots   
  setupStatefulComponent(instance);
}


function setupStatefulComponent(instance){
  const component = instance.type;
  const { setup }  = component;
  if(setup){
    const setupResult = setup();
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