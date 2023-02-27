import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from './Foo.js';

export const App = {
  name: "App",
  setup(props, { emit }){
    return {};
  },
  render(){
    const app = h("div", {}, "App");
    // const foo = h(Foo, {id: "slot-provider"}, h("div", {}, "[slot] element"));

    // 普通插槽 (位置不可指定)
    // const foo = h(Foo, {id: "slot-provider"}, [
    //   h("div", {}, "[slot] element111111111"), 
    //   h("div", {}, "[slot] element222222222")
    // ]);

    // 具名插槽 (位置通过名称key值来指定)
    // const foo = h(Foo, {id: "slot-provider"}, {
    //   header: h("div", {}, "[slot] header"), 
    //   footer: h("div", {}, "[slot] footer")
    // });
    
    // 作用域插槽 (具名插槽基础上，可传递数据)
    const foo = h(Foo, {id: "slot-provider"}, {
      header: ({ age }) => h("div", {}, "[slot] header" + age), 
      footer: (name) => h("div", {}, "[slot] footer" + name),
    });
    return h("div", {}, [app, foo]);
  }
}