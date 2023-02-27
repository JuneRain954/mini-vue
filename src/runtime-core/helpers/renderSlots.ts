import { isFunction } from "../../shared/index";
import { h } from "../h";
import { Fragment } from "../vnode";

export function renderSlots(slots, name, data?){
  let slot = name ? slots[name] : slots;
  isFunction(slot) && (slot = slot(data));
  return h(Fragment, {}, slot);
}