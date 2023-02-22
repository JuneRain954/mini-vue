const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
}

export const PublicInstanceProxyHandlers = {
    get({_: instance}, key){
      let res;
      const { setupState } = instance;
      if(Reflect.has(setupState, key)){
        res = setupState[key];
      }
      if(Reflect.has(publicPropertiesMap, key)){
        res = publicPropertiesMap[key](instance);
      }
      return res;
    }
}