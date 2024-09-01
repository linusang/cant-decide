export const EVENT_STORE = Symbol("EventStore");

type Handler = (message?: unknown) => Promise<void>;
type Store<TEventName extends string> = Record<TEventName, Set<Handler>>;

export default class EventStore<TEventName extends string> {
  public readonly subscribers: Partial<Store<TEventName>> = {};

  public subscribe(eventName: TEventName, handler: Handler) {
    if (eventName in this.subscribers) {
      this.subscribers[eventName]?.add(handler);
    } else {
      this.subscribers[eventName] = new Set([handler]);
    }
  }

  public unsubscribe(eventName: TEventName, handler: Handler) {
    const handlers = this.subscribers[eventName] as Set<Handler>;
    if (handlers && handlers.size > 0) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        delete this.subscribers[eventName];
      }
    } else {
      console.error(`EventName: '${eventName}' not found to unsubscribe!`);
    }
  }

  public async publish(eventName: TEventName, message?: unknown) {
    const callbacks = this.subscribers[eventName] as Set<Handler>;
    if (callbacks && callbacks.size > 0) {
      await Promise.all(Array.from(callbacks).map((cb) => cb(message)));
    } else {
      console.error(`EventName: '${eventName}' not found to publish!`);
    }
  }

  public removeEvent(eventName: TEventName) {
    delete this.subscribers[eventName];
  }
}
