type Resolver<T> = (data: T) => void;
type Rejecter<E extends Error> = (error: E) => void;

export class Observer<T, E extends Error> {
  private subscribers: Array<[Resolver<T>, Rejecter<E>]> = [];

  public subscribe(subscriber: [Resolver<T>, Rejecter<E>]) {
    this.subscribers.push(subscriber);
  }

  public notifySuccess(data: T) {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i];
      if (subscriber === undefined) continue;
      subscriber[0](data);
    }
    this.subscribers = [];
  }

  public notifyError(error: E) {
    for (let i = 0; i < this.subscribers.length; i++) {
      const subscriber = this.subscribers[i];
      if (subscriber === undefined) continue;
      subscriber[1](error);
    }
    this.subscribers = [];
  }
}
