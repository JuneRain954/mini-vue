let targetMap = new Map();
let activeEffect;

class reactiveEffect{
    _fn = function(){};
    constructor(fn){
        this._fn = fn;
    }
    
    run(){
        activeEffect = this;
        this._fn();
        activeEffect = null;
    }
}

/**
 *  收集响应式函数 
 * @param fn 目标函数
 */
export function effect(fn){
    let _effect = new reactiveEffect(fn);
    _effect.run();
}


/**
 *  收集依赖 
 * @param target 传递过来的参数对象
 * @param key 对象对应的key
 * @returns 
 */
export function track(target, key){
    if(!activeEffect) return;
    // 每个 target 对应一个 map
    let depsMap = targetMap.get(target);
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    // 每个属性对应一个集合
    let dep = depsMap.get(key);
    if(!dep){
        dep = new Set();
        depsMap.set(key, dep);
    } 
    dep.add(activeEffect);
}


/**
 * 触发依赖
 * @param target 传递过来的参数对象 
 * @param key   更新的key
 */
export function trigger(target, key){
    // 获取对应的 target
    let depsMap = targetMap.get(target);
    // 获取对应的事件数组
    let dep = depsMap.get(key);
    // 触发依赖
    dep.forEach(effect => {
        effect.run();
    });
}