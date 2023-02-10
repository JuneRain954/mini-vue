import { reactive } from "../reactivity/reactive";
import { effect, stop } from "../reactivity/effect";

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

    // effect 的 scheduler 功能
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

    // effect 的 stop 功能
    it("stop", () => {
        // TODO stop 函数的作用：停止触发指定的依赖函数。即目标数据更新时，不再触发指定的依赖函数
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });

        // obj.prop 值更新，dummy 的值相应更新
        obj.prop++;
        expect(dummy).toBe(2);

        // 调用 stop 函数，obj.prop 值更新，dummy 的值不会更新
        stop(runner);
        obj.prop++;
        expect(dummy).toBe(2);

        // 直接调用 runner 函数，更新 dummy 的值
        runner();
        expect(dummy).toBe(3);
    })

    // effect 的  onStop 功能
    it("onStop", () => {
        let dummy;
        let obj = reactive({ foo: 1 });
        const onStop = jest.fn();
        const runner = effect(() => { dummy = obj.foo; }, { onStop });

        // stop 函数执行一次，onStop 函数相应执行一次
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})