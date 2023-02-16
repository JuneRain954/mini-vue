
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
