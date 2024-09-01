import { beforeEach, describe, expect, it } from "vitest";

import EventStore from "./EventStore";

type TestEvent = "some-event";

describe("EventStore", () => {
  let eventStore: EventStore<TestEvent>;
  beforeEach(() => {
    eventStore = new EventStore();
  });

  it("subscribers should be initialized when instantiated", () => {
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).length).toBe(0);
  });

  it("should be added to subscribers when subcribe() is called", () => {
    eventStore.subscribe("some-event", (_) => Promise.resolve());
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).length).toBe(1);
    expect("some-event" in subscribers).toBeTruthy();
  });

  it("should contain 2 callbacks when same eventName is registered twice", () => {
    eventStore.subscribe("some-event", (_) => Promise.resolve());
    eventStore.subscribe("some-event", (_) => Promise.resolve());
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).length).toBe(1);
    expect("some-event" in subscribers).toBeTruthy();
    expect(subscribers["some-event"]!.size).toBe(2);
  });

  it("should contain 1 callback when same callback is registered twice", () => {
    const callback = (_: unknown) => Promise.resolve();
    eventStore.subscribe("some-event", callback);
    eventStore.subscribe("some-event", callback);
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).length).toBe(1);
    expect("some-event" in subscribers).toBeTruthy();
    expect(subscribers["some-event"]!.size).toBe(1);
  });

  // it("callback should be invoked when published is called", () => {
  //   const obj = {
  //     callback: () => Promise.resolve(),
  //   };
  //   const callbackSpy = spyOn(obj, "callback");
  //   eventStore.subscribe("some-event", obj.callback);
  //   eventStore.publish("some-event");
  //   expect(callbackSpy).toBeCalled();
  // });

  // it("multiple callbacks should be invoked when published is called on same event", () => {
  //   const obj1 = {
  //     callback: () => Promise.resolve(),
  //   };
  //   const obj2 = {
  //     callback: () => Promise.resolve(),
  //   };
  //   const callbackSpy1 = spyOn(obj1, "callback");
  //   const callbackSpy2 = spyOn(obj2, "callback");
  //   eventStore.subscribe("some-event", obj1.callback);
  //   eventStore.subscribe("some-event", obj2.callback);
  //   eventStore.publish("some-event");
  //   expect(callbackSpy1).toBeCalled();
  //   expect(callbackSpy2).toBeCalled();
  // });

  it("callback should be removed when unsubscribe is called", () => {
    const callback = () => Promise.resolve();
    eventStore.subscribe("some-event", callback);
    eventStore.unsubscribe("some-event", callback);
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).length).toBe(0);
  });

  it("should remove event when removeEvent is called", () => {
    const callback = () => Promise.resolve();
    eventStore.subscribe("some-event", callback);
    eventStore.removeEvent("some-event");
    const subscribers = eventStore.subscribers;
    expect(Object.keys(subscribers).includes("some-event")).toBeFalsy();
  });
});
