import {  trackEffects, triggerEffects } from '../reactivity/effect';
import { isComplexData, isEqual } from '../shared';
import { reactive } from './reactive';

class RefImpl{
  #value: any = null;
  #dep = new Set();
  #rawVal: any = null;
  constructor(val){
    this.#value = createValue(val);
    this.#rawVal = val;
  }
  get value(){
    // 收集依赖
    trackEffects(this.#dep);
    return this.#value;
  }
  set value(newVal){
    if(isEqual(this.#rawVal, newVal)) return;
    this.#value = createValue(newVal);
    this.#rawVal = newVal;
    // 触发依赖
    triggerEffects(this.#dep);
  }
}

/**
 * 创建响应式数据
 * @param val 目标数据
 * @returns 
 */
function createValue(val){
  return isComplexData(val) ? reactive(val) : val;
}

/**
 * 生成响应式简单类型的数据 
 * @param data 目标数据
 * @returns 
 */
export function ref(data){
  return new RefImpl(data);
}