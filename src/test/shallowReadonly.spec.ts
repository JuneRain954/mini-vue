import { isReadonly, shallowReadonly } from "../reactivity/reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({n: {foo: 1}});
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  })

  it("should warn when set", () => {
    const user = shallowReadonly({ age: 10 , name: [{txt: "jack"}]});
    console.warn = jest.fn();

    user.age = 20;
    expect(console.warn).toHaveBeenCalled();
  })
})