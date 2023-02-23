import { toHandlerKey } from '../shared/index';

export function emit(instance, event, ...args){
  const evtName = toHandlerKey(event);
  const { props } = instance;
  const handler =  props[evtName];
  handler && handler(...args);
}
