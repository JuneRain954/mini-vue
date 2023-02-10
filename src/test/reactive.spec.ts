import { reactive, isReactive } from "../reactivity/reactive";

describe("reactive", () => {
    it("happy path", () => {
        const original = { foo: 1 };
        const observe = reactive(original);
        expect(observe).not.toBe(original);
        expect(observe.foo).toBe(1);

        // 给定数据是否时响应式的
        expect(isReactive(observe)).toBe(true);
        expect(isReactive(original)).toBe(false);
    })

})