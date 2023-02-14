let targetMap = new Map();  // 存放所有响应式对象
let activeEffect;   // 当前需要被收集的依赖

class reactiveEffect {
  _fn = function () { };
  _scheduler: any = null;
  _onStop: any = null;
  _deps = new Set();
  active = true;
  constructor(fn: any, options: any) {
    this._fn = fn;
    this._scheduler = options?.scheduler;
    this._onStop = options?.onStop;
  }

  run() {
    activeEffect = this;
    const res = this._fn();
    activeEffect = null;
    return res;
  }
  stop(){
    if(this.active){
      cleanupEffect(this);
      this._onStop && this._onStop();
      this.active = false;
    }
  }  
}

/**
 *  清除给定的依赖函数 
 * @param effect 目标依赖函数
 */
function cleanupEffect(effect){
  effect._deps.forEach((dep: any) => {
    dep.delete(effect);
  })
}

/**
 *  收集响应式函数 
 * @param fn 目标函数
 */
export function effect(fn, options?) {
  let _effect = new reactiveEffect(fn, options);
  _effect.run();
  let runner: any = _effect.run.bind(_effect);
  runner._effect = _effect;
  return runner;
}

/**
 *  停止触发指定的依赖函数 
 * @param runner 目标依赖函数 
 */
export function stop(runner){
  runner._effect.stop();
} 

/**
 *  收集依赖 
 * @param target 传递过来的参数对象
 * @param key 对象对应的key
 * @returns 
 */
export function track(target, key) {
  if (!activeEffect) return;
  // 每个 target 对应一个 map
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 每个属性对应一个依赖集合
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  // 把每个依赖事件收集起来
  trackEffects(dep);
}


/**
 * 收集依赖事件 
 * @param dep 存放依赖的集合
 */
export function trackEffects(dep){
  if(!activeEffect) return;
  dep.add(activeEffect);
  // 反向收集
  activeEffect._deps.add(dep);
}

/**
 * 触发依赖
 * @param target 传递过来的参数对象 
 * @param key   更新的key
 */
export function trigger(target, key) {
  // 获取 target 对应的 map
  let depsMap = targetMap.get(target);
  if(!depsMap) return;
  // 获取 key 对应的事件依赖集合
  let dep = depsMap.get(key);
  // 触发依赖
  triggerEffects(dep);
}

/**
 * 触发依赖事件 
 * @param dep 存放依赖的集合
 */
export function triggerEffects(dep){
  // 触发收集的所有依赖事件
  dep.forEach(effect => {
    effect._scheduler ? effect._scheduler() : effect.run();
  });
   
}