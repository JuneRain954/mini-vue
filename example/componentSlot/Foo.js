import { createTextVnode, h, renderSlots } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: "Foo",
  render(){
    const foo = h("p", {}, "foo");
    // return h("div", {id: "slot-accepter"}, [foo, renderSlots(this.$slots)]);
    
    // 使用具名插槽 (提供名字以确定插入的位置)
    // return h("div", {id: "slot-accepter"}, [
    //   renderSlots(this.$slots, "header"),
    //   foo,
    //   renderSlots(this.$slots, "footer")
    // ]);

    // 使用作用域插槽 (具名插槽的基础上，可提供参数)
    // return h("div", {id: "slot-accepter"}, [
    //   renderSlots(this.$slots, "header", { age: 18 }),
    //   foo,
    //   renderSlots(this.$slots, "footer", "---Hello~")
    // ]);
  
    // 文本节点与普通节点混用
    const txt = createTextVnode("This is an Text node");
    return h("div", {id: "slot-accepter"}, [
      renderSlots(this.$slots, "header", { age: 18 }),
      txt,
      foo,
      renderSlots(this.$slots, "footer", "---Hello~")
    ]);
  },
  setup(props, { emit }){
    return {};
  }
}