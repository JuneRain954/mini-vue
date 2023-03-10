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
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
];
const nextChild = [
  h("p", {key: "B"}, "B"),
  h("p", {key: "C"}, "C"),
]; */


// 5. 中间对比
// 5.1 删除老的 (节点在老的里面存在，新的里面不存在)
// a b (c d) f g
// a b (e c) f g
// D 节点在新的里面不存在，需删除；C节点的 props 发生变化，需更新
/* const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C", id: "prevId"}, "C"),
  h("p", {key: "D"}, "D"),
  h("p", {key: "F"}, "F"),
  h("p", {key: "G"}, "G"),
];
const nextChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "E"}, "E"),
  h("p", {key: "C", id: "nextId"}, "C"),
  h("p", {key: "F"}, "F"),
  h("p", {key: "G"}, "G"),
]; */

// 5.1.1 老的比新的多(多余旧节点直接删除)
// a b (c e d) f g
// a b (e c) f g
const prevChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "C", id: "prevId"}, "C"),
  h("p", {key: "E"}, "E"),
  h("p", {key: "D"}, "D"),
  h("p", {key: "F"}, "F"),
  h("p", {key: "G"}, "G"),
];
const nextChild = [
  h("p", {key: "A"}, "A"),
  h("p", {key: "B"}, "B"),
  h("p", {key: "E"}, "E"),
  h("p", {key: "C", id: "nextId"}, "C"),
  h("p", {key: "F"}, "F"),
  h("p", {key: "G"}, "G"),
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