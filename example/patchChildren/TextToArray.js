import { h, ref } from "../../lib/guide-mini-vue.esm.js";

const prevChild = "prevChildren";
const nextChild = [h("div", {}, "A"), h("div", {}, "B")];

export const TextToArray = {
  name: "TextToArray",
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