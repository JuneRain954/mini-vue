import { h } from "../../lib/guide-mini-vue.esm.js"
import {TextToText} from './TextToText.js';
import {TextToArray} from './TextToArray.js';
import {ArrayToText} from './ArrayToText.js';
import {ArrayToArray} from './ArrayToArray.js';

export const App = {
  name: "App",
  render(){
    return h("div", {tId: 1}, [
      h("p", {}, "主页"),

      // children: Array => Text
      // h(ArrayToText),
      // children: Text => Text
      // h(TextToText),
      // children: Text => Array
      // h(TextToArray),
      // children: Array => Array
      h(ArrayToArray),
    ]);
  },
  setup(){
    return {};
  }
}