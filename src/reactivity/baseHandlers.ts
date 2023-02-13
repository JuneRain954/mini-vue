import { track, trigger } from '../reactivity/effect';
import { isComplexData } from '../shared';
import { ReactiveFlags, readonly } from './reactive';
import { reactive } from './reactive';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

/**
 * 生成 getter  
 * @param isReadonly 是否只读
 * @returns 
 */
function createGetter(isReadonly = false){
	return function get(target, key){
			// 依赖收集
			(!isReadonly) && track(target, key);
			let res = Reflect.get(target, key);

      // 数据的特征判断
      if(key === ReactiveFlags.IS_REACTIVE){
        res = !isReadonly;
      }
      if(key === ReactiveFlags.IS_READONLY){
        res = isReadonly;
      }

      // 嵌套复杂类型数据处理
      isComplexData(res) && (res = isReadonly ? readonly(res) : reactive(res));

			return res;
	}	
}

/**
 * 生成 setter
 * @returns 
 */
function createSetter(){
	return function set(target, key, newVal){
			let res = Reflect.set(target, key, newVal);
			// 依赖触发
			trigger(target, key);
			return res;	
	}	
}


export const mutableHandlers = {
		get,
		set,
}

export const readonlyHandlers = {
		get: readonlyGet,
		set(target, key, newVal){
      console.warn(`can not set ${key}`);
			return true;	
		}	
}