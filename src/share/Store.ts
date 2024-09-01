import { reactive, readonly } from "vue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default abstract class Store<T extends Record<string, any>> {
  protected state: T;

  constructor() {
    const data = this.initializeData();
    this.state = reactive(data) as T;
  }

  protected abstract initializeData(): T;

  public getState(): T {
    return readonly(this.state) as T;
  }
}
