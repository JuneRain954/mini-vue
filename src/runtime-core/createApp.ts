import { render } from './renderer';
import { createVNode } from './vnode';

export function createApp(rootComponent){
  return {
    mount(rootContainer){
      // component => vnode
      const vnode = createVNode(rootComponent);
      render(null, vnode, rootContainer, null);
    }
  }
}