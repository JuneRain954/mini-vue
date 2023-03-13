export enum DATA_TYPE{
  String = "[object String]",
  Object = "[object Object]",
  Array = "[object Array]",
  Function = "[object Function]",
}

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

export function isString(data){
  return getDataType(data) === DATA_TYPE.String;
}

/**
 * 判断数据是否是对象类型的数据
 * @param data 目标数据
 * @returns 
 */
export function isObject(data){
  return getDataType(data) === DATA_TYPE.Object;
}


/**
 * 获取数据是否是数组类型的数据
 * @param data 目标数据
 * @returns 
 */
export function isArray(data){
  return getDataType(data) === DATA_TYPE.Array;
}

/**
 * 判断数据是否是函数类型的数据 
 * @param data 目标数据
 * @returns 
 */
export function isFunction(data){
  return getDataType(data) === DATA_TYPE.Function;
}

/**
 * 获取数据的类型 
 * @param data 目标对象
 * @returns 
 */
export function getDataType(data){
  return Object.prototype.toString.call(data);
}


/**
 * 判断对象是否含有给定的 属性  
 * @param target 目标对象
 * @param key 属性名
 * @returns 
 */
export function hasOwnProperty(target, key){
  target = target || {};
  return Reflect.has(target, key);
}

/**
 *  删除目标对象的给定属性
 * @param target 目标对象
 * @param key 给定的属性名 
 * @returns 
 */
export function deleteProperty(target, key){
  return Reflect.deleteProperty(target, key);
}


/**
 * 输出 on + Event 形式的事件名，如：onAdd 
 * @param str 字符串
 * @returns 
 */
export function toHandlerKey(str: string){
  const evtName = camelize(str);
  return str ? `on${capitalize(evtName)}` : "";
}

/**
 * 将字符串的首字符大写  
 * @param event 事件名
 * @returns 
 */
function capitalize(event){
  return event[0].toUpperCase() + event.slice(1);
}


/**
 * 烤肉串形式的字符串转变为驼峰命名形式的字符串 如：add-foo => addFoo 
 * @param event 事件名
 * @returns 
 */
function camelize(event){
  const reg = /-(\w)/g; 
  const handler = (fullMatch, groupMatch) => (groupMatch ? groupMatch.toUpperCase() : "");
  const res = event.replace(reg, handler);
  return res;
}


/**
 * 获取最长递增子序列
 * @param arr 数组
 * @returns 最长递增子序列数组
 */
export function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
          j = result[result.length - 1];
          if (arr[j] < arrI) {
              p[i] = j;
              result.push(i);
              continue;
          }
          u = 0;
          v = result.length - 1;
          while (u < v) {
              c = (u + v) >> 1;
              if (arr[result[c]] < arrI) {
                  u = c + 1;
              }
              else {
                  v = c;
              }
          }
          if (arrI < arr[result[u]]) {
              if (u > 0) {
                  p[i] = result[u - 1];
              }
              result[u] = i;
          }
      }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
      result[u] = v;
      v = p[v];
  }
  return result;
}

/**
 * 二分法寻找对比值的下标
 * @param arr 目标数组
 * @param value 对比值
 * @returns 下标
 */
export function binarySearch(arr, value){
  let beginIdx = 0;
  let tailIdx = arr.length - 1;
  let midIdx, targetIdx;
  while(beginIdx <= tailIdx){
    midIdx = Math.floor((beginIdx + tailIdx) / 2);
    const midVal = arr[midIdx];
    if(midVal === value){
      targetIdx = midVal;
      break;
    }
    (midVal > value) ? (tailIdx = midIdx - 1) : (beginIdx = midIdx + 1);
  }
  return targetIdx;
}