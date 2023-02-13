// reactivity核心逻辑实现
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';


export enum ReactiveFlags{
	IS_REACTIVE = "__v_is_reactive",
	IS_READONLY = "__v_is_readonly",
}

/**
 *  生成响应式数据 
 * @param rawData 数据对象
 * @returns 
 */
export function reactive(rawData) {
	return createActiveData(rawData, mutableHandlers);
}


/**
 * 生成只读的数据 
 * @param rawData 数据对象
 * @returns 
 */
export function readonly(rawData) {
	return createActiveData(rawData, readonlyHandlers);
}

/**
 *	生成仅表层只读的数据(嵌套的复杂类型数据可修改) 
 * @param rawData 数据对象
 * @returns 
 */
export function shallowReadonly(rawData){
	return createActiveData(rawData, shallowReadonlyHandlers);
}

/**
 * 生成响应式/只读数据 
 * @param rawData 需要处理的数据对象
 * @param baseHandlers 数据的拦截处理逻辑 
 * @returns 
 */
function createActiveData(rawData, baseHandlers){
	return new Proxy(rawData, baseHandlers);
}

/**
 * 判断数据是否响应式数据 
 * @param data 目标对象 
 * @returns 
 */
export function isReactive(data){
	return !!data[ReactiveFlags.IS_REACTIVE];
}


/**
 * 判断数据是否只读 
 * @param data 目的对象
 * @returns 
 */
export function isReadonly(data){
	return !!data[ReactiveFlags.IS_READONLY];
}