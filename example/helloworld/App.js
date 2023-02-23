import { h } from '../../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';

window.self = null;
export const App = {
  name: "App",
  render(){
    window.self = this;
    // 返回UI
    // return h("div", {id: "root", class: ["red", "blue"]}, [
    //   h("div", {id: "r1"}, "h1~ "),
    //   h("div", {id: "r2"}, "mini-vue"),
    // ]);
    return h(
      "div", 
      {
        id: "root", 
        class: ["red", "blue"], 
        onClick: () => console.log("onClick"),
        onMousedown(){
          console.log("onMousedown");
        }
      },
      [
        h("div", { id: "test" }, "hi!!"),
        h(Foo, { count: 1 }, "yo~")
      ]
    );
  },
  setup(){
    return {
      msg: "mini-vue"
    }
  }
}
