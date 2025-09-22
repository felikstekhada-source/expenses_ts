export class Observer {
  private observers: Observers = {};
  constructor() {}

 public subscribe(eventNames: EventType[], cb: (payload?: any) => void) {
    eventNames.forEach((eventName) => {
      if (!this.observers[eventName]) this.observers[eventName] = [];
      this.observers[eventName].push(cb);
    });
  }


  public notify(eventName: EventType) {
    this.observers[eventName]?.forEach((fn) => fn());
  }
}

type Observers = Record<string, Array<(payload?: any) => void>>;

export type EventType = "expenseAdded" | "expenseRemoved";
