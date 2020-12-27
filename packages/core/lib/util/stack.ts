import { InvalidOperationError } from "../errors";
import { InvalidStateError } from "../errors/invalid-state-error";

class StackElement<T> {
  constructor(
    public readonly value: T,
    public prev: StackElement<T> | null = null,
    public next: StackElement<T> | null = null
  ) {}
}

class DummyStackElement extends StackElement<any> {
  constructor() {
    super(null);
  }
}

export class Stack<T> {
  private dummy: StackElement<any> = new DummyStackElement();
  private head: StackElement<T> = this.dummy;

  public isEmpty(): boolean {
    return this.head === this.dummy;
  }

  public isNotEmpty(): boolean {
    return this.head !== this.dummy;
  }

  public push(element: T) {
    const next = new StackElement(element, this.head, null);
    this.head.next = next;
    this.head = next;
  }

  public pushAll(elements: Array<T>) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element === undefined) {
        throw new InvalidStateError(
          "Array of eleements contains holes or/and undefined values"
        );
      }
      this.push(element);
    }
  }

  public peek(): T {
    if (this.isEmpty()) {
      throw new InvalidOperationError("Try peek of empty stack.");
    }
    return this.head.value;
  }

  public pop(): T {
    if (this.isEmpty()) {
      throw new InvalidOperationError("Try pop of empty stack.");
    }
    const prev = this.head.prev;
    if (prev === null) {
      throw new InvalidStateError(
        "Stack contains invalid reference at the head."
      );
    }
    const head = this.head;
    this.head.prev = null;
    prev.next = null;
    this.head = prev;
    return head.value;
  }
}
