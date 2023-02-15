import { ReactiveEffect } from "./effect";

class ComputedImpl{
  #dirty: boolean = true;
  #value: any = null;
  #effect: any = null;
  #scheduler: any = null;
  constructor(getter){
    this.#scheduler = () => { (!this.#dirty) && (this.#dirty = true); }
    this.#effect = new ReactiveEffect(getter, { scheduler: this.#scheduler.bind(this) });
  }
  get value(){
    if(this.#dirty){
      this.#value = this.#effect.run();
      this.#dirty = false;
    }
    return this.#value;
  }
}

export function computed(fn){
  return new ComputedImpl(fn);
}