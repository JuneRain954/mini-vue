import { h, ref } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: "App",
  render(){
    const child1 = h("div", {}, `count: ${this.count}`);
    const child2 = h("button", { onClick: this.onClick }, "click");
    return h("div", { id: "root" }, [child1, child2]);
  },
  setup(){
    const count = ref(0);
    const onClick = () => { 
      console.log(`count.value: ${count.value}`);
      count.value++ 
    };
    return {
      count,
      onClick
    }
  }
}