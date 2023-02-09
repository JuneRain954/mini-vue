import { reactive } from "../reactivity/reactive";
import { effect } from "../reactivity/effect";

describe("effect", () => {
    // 测试点
    it("happy path", () => {
        const user = reactive({ age: 10 });
        let nextAge = -1;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);
        user.age++;
        expect(nextAge).toBe(12);
    })
})