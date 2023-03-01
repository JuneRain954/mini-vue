import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js';

export const Provider = {
  name: "Provider",
  render(){
    const child = h("div", {}, "Provider");
    return h("div", {}, [child, h(InterLayer)]);
    // return h("div", {}, [h(Consumer)]);
  },
  setup(){
    // 给子组件提供数据
    provide("foo", "fooVal");
    provide("bar", "barVal");
  }
}

const InterLayer = {
  name: "InterLayer",
  render(){
    const child = h("div", {}, `InterLayer>>${this.foo}`);
    return h("div", {}, [child, h(Consumer)]);
  },
  setup(){
    provide("foo", "InterLayerFoo");
    const foo = inject("foo");
    return { foo };
  }
}

const Consumer = {
  name: "Consumer",
  render(){
    return h("div", {}, `[Consumer]  -- ${this.foo} -- ${this.bar}; defaultValue: ${this.fo} == ${this.ba}`);
  },
  setup(){
    // 获取父组件提供的数据
    const foo = inject("foo");
    const bar = inject("bar");

    // 可提供默认值
    const fo = inject("fo", "defaultFo");
    const ba = inject("ba", () => "defaultBa");

    return {
      foo,
      bar,
      fo,
      ba,
    }
  }
}