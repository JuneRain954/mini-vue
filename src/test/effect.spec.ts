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
    
    // effect 返回 runner 函数
    it("should return runner when call effect", () => {
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        });
        expect(foo).toBe(11);
        let res = runner();
        expect(res).toBe("foo");
    })

    // effect 的第二个参数 scheduler
    it("scheduler", () => {
        // TODO scheduler 作用：每次变量更新，触发的函数变为 scheduler 而不是给 effect 传递的第一个函数 fn
        let dummy;
        let run: any;
        let runner: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        let obj = reactive({ foo: 1 });
        runner = effect(() => { dummy = obj.foo; }, { scheduler });

        // scheduler 函数没有被调用过
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);

        // scheduler 被调用一次, 且 dummy 值没有更新
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);

        // 执行 run 函数, dummy 的值更新
        run();
        expect(dummy).toBe(2);
    })
})