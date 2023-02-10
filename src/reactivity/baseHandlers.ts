import { track, trigger } from '../reactivity/effect';


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