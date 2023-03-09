import { h, ref } from "../../lib/guide-mini-vue.esm.js";

// 1. 左侧对比
// (a b) c
// (a b) d e
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];
const nextChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "D"}, "D"),
  h("p", {key: "E"}, "E"),
]; */

// 2. 右侧对比
// a (b c)
// d e (b c)
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];
const nextChild = [
  h("p", {key: "D"}, "D"),
  h("p", {key: "E"}, "E"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
]; */

// 3. 新的比老的长
// 3.1 左侧
// (a b)
// (a b) c
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
];
const nextChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
]; */
// 3.2 右侧
// (a b)
// c (a b)
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
];
const nextChild = [
  h("p", {key: "C"}, "C"),
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
]; */


// 4. 老的比新的长
// 4.1 左侧 > 右侧
// (a b) c
// (a b)
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];
const nextChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
]; */

// 4.2 右侧
// a (b c)
// (b c)
const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];
const nextChild = [
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];

export const ArrayToArray = {
  name: "ArrayToArray",
  render(){
    const targetChild = this.isChange ? nextChild : prevChild;
    return h("div", {}, targetChild);
  },
  setup(){
    let isChange = ref(false);
    window.isChange = isChange;
    return { isChange };
  }
}