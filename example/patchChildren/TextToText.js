import { h, ref } from "../../lib/guide-mini-vue.esm.js";

const prevChild = "prevChildren";
const nextChild = "nextChildren";

export const TextToText = {
  name: "TextToText",
  render(){
    const self = this;
    const targetChild = self.isChange ? nextChild : prevChild;
    return h("div", {}, targetChild);
  },
  setup(){
    const isChange = ref(false);
    window.isChange = isChange;
    return { isChange };
  }
}