import { hasOwnProperty } from '../shared/index';

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
}

export const PublicInstanceProxyHandlers = {
    get({_: instance}, key){
      let res;
      const { setupState, props } = instance;
      if(hasOwnProperty(setupState, key)){
        res = setupState[key];
      }
      if(hasOwnProperty(props, key)){
        res = props[key];
      }
      if(hasOwnProperty(publicPropertiesMap, key)){
        res = publicPropertiesMap[key](instance);
      }
      return res;
    }
}
