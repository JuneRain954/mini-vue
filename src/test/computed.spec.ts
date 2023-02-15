import { computed } from "../reactivity/computed";
import { reactive } from "../reactivity/reactive"

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 1 });
    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(1);
  })

  it("should compute lazily", () => {
    const value = reactive({ foo: 1});
    const getter = jest.fn(() => {
      return value.foo;
    })
    const cValue = computed(getter);

    // 懒更新
    expect(getter).not.toHaveBeenCalled();

    // 首次访问时进行更新
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    
    // 依赖值未发生变化，不更新
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // 依赖值 value.foo 发生变化，但未进行访问目标值 cValue.value, 不进行更新
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // 依赖值 value.foo 发生变化，且进行访问目标值 cValue.value，进行更新
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // 依赖值未发生变化，不更新
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  })
})