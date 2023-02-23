import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from './Foo.js';

export const App = {
  name: "App",
  render(){
    return h("div", {}, [
      h(Foo, { 
        onAdd: (...data) => { console.log("[App] on Add function~", ...data); },
        onAddFoo(...args){
          console.log(`[App] AddFoo`, ...args);
        },
      })
    ]);
  },
  setup(props){
    return {};
  }
}