/**
 * 判断数据是否是复杂数据类型 
 * @param data 目标数据
 * @returns 
 */
export function isComplexData(data){
  return isObject(data) || isArray(data);
}

/**
 * 对比两个数据是否一致 
 * @param v1 数据1
 * @param v2 数据2
 * @returns 
 */
export function isEqual(v1, v2){
  return Object.is(v1, v2);
}

/**
 * 判断数据是否是对象类型的数据
 * @param data 目标数据
 * @returns 
 */
export function isObject(data){
  return getDataType(data) === "[object Object]";
}


/**
 * 获取数据是否是数组类型的数据
 * @param data 目标数据
 * @returns 
 */
export function isArray(data){
  return getDataType(data) === "[object Array]";
}


/**
 * 获取数据的类型 
 * @param data 目标对象
 * @returns 
 */
export function getDataType(data){
  return Object.prototype.toString.call(data);
}