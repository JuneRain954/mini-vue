import { isFunction } from "../../shared/index";
import { h } from "../h";

export function renderSlots(slots, name, data?){
  let slot = slots[name];
  isFunction(slot) && (slot = slot(data));
  return h("div", {}, slot);
}