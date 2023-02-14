import { effect } from '../reactivity/effect';
import { ref } from '../reactivity/ref';

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
})