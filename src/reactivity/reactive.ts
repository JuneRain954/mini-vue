// reactivity核心逻辑实现
import { mutableHandlers, readonlyHandlers } from './baseHandlers';

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


function createActiveData(rawData, baseHandlers){
	return new Proxy(rawData, baseHandlers);
}