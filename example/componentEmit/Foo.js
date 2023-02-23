import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  name: "Foo",
  render(){
    const btn = h("button", { onClick: this.emitAdd }, "emitAdd");
    const foo = h("p", {}, "foo");
    return h("div", {}, [btn, foo]);
  },
  setup(props, { emit }){
    const emitAdd = () => {
      console.log("[Foo] emitAdd function");
      emit("add", {txt: "hhhhhhh"}, [1, 2]);
      emit("add-foo", 1, 2, 3, 4);
    };
    
    return {
      emitAdd,
    };
  }
}