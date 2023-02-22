import { isArray, isString } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";

export function createVNode(type, props?, children?){
  const vnode = {
    el: null,
    type,
    props,
    children,
    shapeFlag: null,
  };
  getShapeFlags(vnode);
  
  return vnode;
}

function getShapeFlags(vnode){
  const { type, children } = vnode;
  // 根据自身类型 (赋值)
  vnode.shapeFlag = isString(type) ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
  // 根据 children 的类型 (修改)
  isString(children) && (vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN);
  isArray(children) && (vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN);
}