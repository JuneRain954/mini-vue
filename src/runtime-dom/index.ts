import { createRenderer } from '../runtime-core/index';
import { isArray } from "../shared/index";

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
function patchProp(el, key, val){
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
        el.setAttribute(key, val);
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


export * from "../runtime-core/index";