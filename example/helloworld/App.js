import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  render(){
    // 返回UI
    return h("div", {id: "root", class: ["red", "blue"]}, [
      h("div", {id: "r1"}, "h1~ "),
      h("div", {id: "r2"}, "mini-vue"),
    ]);
    // return h("div", {id: "root", class: ["red", "blue"]}, `Hello~ ${this.msg}`);
  },
  setup(){
    return {
      msg: "mini-vue"
    }
  }
}
