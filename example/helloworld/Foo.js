import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup(props){
    props.count++;
    console.log("[Foo] props: ", props);
    return {};
  },
  render(){
    return h("div", { id: "foo" }, `foo: ${this.count}`);
  }
}