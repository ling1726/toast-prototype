// TODO use a priority queue
export class Queue<T> {
  arr: T[];

  constructor() {
    this.arr = [];
  }

  enqueue(item: T) {
    this.arr.push(item);
  }

  dequeue() {
    if (this.arr.length) {
      return this.arr.shift();
    }

    throw new Error('Queue is empty');
  }

  get size() {
    return this.arr.length;
  }
}