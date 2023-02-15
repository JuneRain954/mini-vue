import { effect } from '../reactivity/effect';
import { reactive } from '../reactivity/reactive';
import { ref, isRef, unRef, proxyRefs } from '../reactivity/ref';

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  })

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    })
    expect(dummy).toBe(1);
    expect(calls).toBe(1);

    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);

    // 赋值相同值，不会触发依赖
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  })

  it("should make nested properties reactive", () => {
    const a = ref({ count: 1});
    let dummy;
    effect(() => {
      dummy = a.value.count;
    })

    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  })

  it("isRef", () => {
    const a = ref(1);
    const b = 1;
    const c = reactive({ age: 10 });

    expect(isRef(a)).toBe(true);
    expect(isRef(b)).toBe(false);
    expect(isRef(c)).toBe(false);
  })

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  })

  it("proxyRefs", () => {
    // TODO proxyRefs 功能的作用：访问 a 的效果等于访问 a.value
    const user = { age: ref(10), name: "jack"};
    const proxyUser = proxyRefs(user);

    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("jack");

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);


    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  })
})