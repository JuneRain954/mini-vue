import { reactive, isReactive, isProxy } from "../reactivity/reactive";

describe("reactive", () => {
    it("happy path", () => {
        const original = { foo: 1 };
        const observe = reactive(original);
        expect(observe).not.toBe(original);
        expect(observe.foo).toBe(1);

        // 给定数据是否时响应式的
        expect(isReactive(observe)).toBe(true);
        expect(isReactive(original)).toBe(false);

        expect(isProxy(observe)).toBe(true);
    })

    // 嵌套数据的响应式/只读
    it("nested reactive", () => {
      const original = {
        nested: { foo: 1 },
        array: [{bar: 2}],
      };
      const observe = reactive(original);

      // 嵌套的复杂类型数据也是响应式的
      expect(isReactive(observe.nested)).toBe(true);
      expect(isReactive(observe.array)).toBe(true);
      expect(isReactive(observe.array[0])).toBe(true);
    })

})