import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  render(){
    // 返回UI
    return h("div", `Hello~ ${this.msg}`);
  },
  setup(){
    return {
      msg: "mini-vue"
    }
  }
}
