// reactivity核心逻辑实现
import { track, trigger } from "./effect";

export function reactive(rawData) {
    return new Proxy(rawData, {
        get(target, key) {
            // 依赖收集
            track(target, key);
            let res = Reflect.get(target, key);
            return res;
        },
        set(target, key, newVal) {
            let res = Reflect.set(target, key, newVal);
            // 依赖触发
            trigger(target, key);
            return res;
        }
    })
}