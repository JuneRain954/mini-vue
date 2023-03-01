import { isFunction } from "../shared/index";
import { getCurrentInstance } from "./component";

export function provide(key, val){
  let instance = getCurrentInstance() as any;
  if(instance){
    let { provides, parent } = instance;
    let parentProvides = parent ? parent.provides : null;
    if(provides === parentProvides) {
      // 把父组件的 provides 作为当前子组件 provides 的原型
      instance.provides = Object.create(parentProvides);
    }
    instance.provides[key] = val;
  }
}


export function inject(key, defaultVal){
  let instance: any = getCurrentInstance();
  // 获取父组件里提供的数据
  let res = instance ? instance.parent.provides[key] : undefined;
  if(!res){
    res = isFunction(defaultVal) ? defaultVal() : defaultVal;
  }
  return res;
}

