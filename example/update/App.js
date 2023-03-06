import { h, ref } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  name: "App",
  render(){
    const child1 = h("div", {}, `count: ${this.count}`);
    const child2 = h("button", { onClick: this.onClick }, "click");
    const child3 = h("button", { onClick: this.onChangePropsDemo1 }, "值修改");
    const child4 = h("button", { onClick: this.onChangePropsDemo2 }, "值改为undefined");
    const child5 = h("button", { onClick: this.onChangePropsDemo3 }, "值删除");

    return h("div", { id: "root", ...this.props }, [child1, child2, child3, child4, child5]);
  },
  setup(){
    const count = ref(0);
    const onClick = () => { 
      console.log(`count.value: ${count.value}`);
      count.value++ 
    };
    const props = ref({ foo: "foo", bar: "bar" });
    const onChangePropsDemo1 = () => { props.value.foo = "new-foo" };
    const onChangePropsDemo2 = () => { props.value.foo = undefined };
    const onChangePropsDemo3 = () => { props.value = { foo: "foo" }};
    
    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    }
  }
}