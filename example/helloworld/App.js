import { h } from '../../lib/guide-mini-vue.esm.js';

window.self = null;
export const App = {
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
      `Hello~ ${this.msg}`
    );
  },
  setup(){
    return {
      msg: "mini-vue"
    }
  }
}
