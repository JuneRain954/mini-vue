import { isArray, isFunction } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";

export function initSlots(instance, rawSlots){
  // instance.slots = isArray(rawSlots) ? rawSlots : [rawSlots];
  const needHandleSlot = (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN);
  needHandleSlot ? normalizeObjectSlot(instance, rawSlots) : normalizeSlotValue(rawSlots);
}

function normalizeObjectSlot(instance, rawSlots){
  for(const key in rawSlots){
    let slot = rawSlots[key];
    instance.slots[key] = getSlotValue(slot);
  }
}

function getSlotValue(slot: any){
  return isFunction(slot) ? normalizeFunctionSlot(slot) : normalizeSlotValue(slot);
}

function normalizeFunctionSlot(slot: Function){
  return function(props){
    const slotValue = slot(props);
    return normalizeSlotValue(slotValue);
  }
}

function normalizeSlotValue(value){
  return isArray(value) ? value : [value];
}