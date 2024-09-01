import type UserWheels from "@/models/UserWheels";
import type Wheel from "@/models/Wheel";

import { createBucketListWheel, createSampleUserWheels } from "./factory";
import Store from "./Store";
import { generateUniqueId } from "./utils/stringUtils";

const LOCAL_STORAGE_KEY = "TikamLahUserData";
export const USER_WHEELS_STORE = Symbol("UserWheelsStore");

type PriorityCallback = {
  priority: number;
  callback: (wheel: Wheel, index: number) => void;
};

export default class UserWheelsStore extends Store<UserWheels> {
  constructor() {
    super();
    this.saveToLocalStorage(this.state);
    this.addedCallbacks = [];
    this.updatedCallbacks = [];
    this.removedCallbacks = [];
  }

  private addedCallbacks: PriorityCallback[];
  private updatedCallbacks: PriorityCallback[];
  private removedCallbacks: PriorityCallback[];

  protected initializeData(): UserWheels {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    let data: UserWheels;
    if (json) {
      data = JSON.parse(json) as UserWheels;
      this.assignChoiceIdIfNotPresent(data);
      this.removeCurrentWheelIndexIfPresent(data);
    } else {
      const sampleUserWheelsData: UserWheels = createSampleUserWheels();
      const json = JSON.stringify(sampleUserWheelsData);
      // todo use async
      localStorage.setItem(LOCAL_STORAGE_KEY, json);

      data = sampleUserWheelsData;
    }
    return data;
  }

  public addWheel() {
    const newWheel = createBucketListWheel();
    this.state.wheels.push(newWheel);
    this.saveToLocalStorage(this.state);

    const index = this.state.wheels.indexOf(newWheel);
    this.invokeAddedCallbacks(newWheel, index);
  }

  public updateWheel(id: string, updatedWheel: Wheel): void {
    const foundWheel = this.state.wheels.find((w) => w.id === id);
    if (foundWheel) {
      const index = this.state.wheels.indexOf(foundWheel);
      this.state.wheels[index] = updatedWheel;
      this.saveToLocalStorage(this.state);
      this.invokeUpdatedCallbacks(updatedWheel, index);
    }
  }

  public removeWheel(id: string): void {
    const wheelToRemove = this.state.wheels.find((w) => w.id === id);
    if (wheelToRemove) {
      const index = this.state.wheels.indexOf(wheelToRemove);
      this.state.wheels.splice(index, 1);
      this.saveToLocalStorage(this.state);
      this.invokeRemovedCallbacks(wheelToRemove, index);
    }
  }

  public addAddedCallback(
    callback: (wheel: Wheel, index: number) => void,
    priority = 0
  ) {
    this.addedCallbacks.push({ priority, callback });
  }

  public removeAddedCallback(callback: (wheel: Wheel, index: number) => void) {
    const found = this.addedCallbacks.find((c) => c.callback === callback);
    if (found) {
      const index = this.addedCallbacks.indexOf(found);
      this.addedCallbacks.splice(index, 1);
    }
  }

  public addUpdateCallback(
    callback: (wheel: Wheel, index: number) => void,
    priority = 0
  ) {
    this.updatedCallbacks.push({ priority, callback });
  }

  public removeUpdateCallback(callback: (wheel: Wheel, index: number) => void) {
    const found = this.updatedCallbacks.find((c) => c.callback === callback);
    if (found) {
      const index = this.updatedCallbacks.indexOf(found);
      this.updatedCallbacks.splice(index, 1);
    }
  }

  public addRemoveCallback(
    callback: (wheel: Wheel, index: number) => void,
    priority = 0
  ) {
    this.removedCallbacks.push({ priority, callback });
  }

  public removeRemoveCallback(callback: (wheel: Wheel, index: number) => void) {
    const found = this.removedCallbacks.find((c) => c.callback === callback);
    if (found) {
      const index = this.removedCallbacks.indexOf(found);
      this.removedCallbacks.splice(index, 1);
    }
  }

  private saveToLocalStorage(data: UserWheels) {
    const json = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, json);
  }

  private assignChoiceIdIfNotPresent(data: UserWheels) {
    if (data?.wheels) {
      data.wheels.forEach((w) => {
        w.choices.forEach((c) => {
          if (!c.id) {
            c.id = generateUniqueId();
          }
        });
      });
    }
  }

  private removeCurrentWheelIndexIfPresent(data: object) {
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (data as any).currentWheelIndex === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (data as any).currentWheelIndex;
      }
    }
  }

  private invokeAddedCallbacks(addedWheel: Wheel, index: number) {
    this.addedCallbacks
      .sort((a, b) => a.priority - b.priority)
      .forEach((pcb) => pcb.callback(addedWheel, index));
  }

  private invokeUpdatedCallbacks(updatedWheel: Wheel, index: number) {
    this.updatedCallbacks
      .sort((a, b) => a.priority - b.priority)
      .forEach((pcb) => pcb.callback(updatedWheel, index));
  }

  private invokeRemovedCallbacks(removedWheel: Wheel, index: number) {
    this.removedCallbacks
      .sort((a, b) => a.priority - b.priority)
      .forEach((pcb) => pcb.callback(removedWheel, index));
  }
}
