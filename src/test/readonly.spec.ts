import { readonly } from '../reactivity/reactive';

describe("readonly", () => {
  it("happy path", () => {
    // TODO readonly 作用：生成的数据不可修改
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  })

  it("warn when set", () => {
    const user = readonly({ age: 10 });
    console.warn = jest.fn();

    user.age = 20;
    expect(console.warn).toBeCalled();
  })
})