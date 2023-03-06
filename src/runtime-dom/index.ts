import { createRenderer } from '../runtime-core/index';
import { isArray } from "../shared/index";


const NULL_OR_UNDEFINED = Symbol("__v_null_or_undefined");

/**
 * 创建元素 
 * @param type 元素类型
 * @returns 
 */
function createElement(type){
  return document.createElement(type);
}

/**
 * 解析元素的属性 
 * @param el 元素
 * @param props 元素的属性 
 */
function patchProp(el, key, oldVal, val){
    if(isArray(val)){
      if(key === "class"){
        const value = val.join(" ");
        el.setAttribute(key, value)
      }
    }else{
      if(isOn(key)){
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
      }else{
        isNullOrUndefined(val) ? el.removeAttribute(key) : el.setAttribute(key, val);
      }
    }
}


/**
 * 判断是否规范的事件名 
 * @param key 事件名
 * @returns 
 */
function isOn(key){
  return /^on[A-Z]/.test(key);
}

/**
 * 插入元素 
 * @param el 元素
 * @param container 包裹元素的容器
 */
function insert(el, container){
  container.insertBefore(el, null);
}

// 创建渲染器
const renderer: any = createRenderer({ createElement, patchProp, insert });

export function createApp(...args){
  return renderer.createApp(...args);
}

/**
 *  判断目标值是否为 null 或 undefined
 * @param val 目标值
 * @returns 
 */
function isNullOrUndefined(val){
  return (val ?? NULL_OR_UNDEFINED) == NULL_OR_UNDEFINED;
}

export * from "../runtime-core/index";