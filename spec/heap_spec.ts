import {Heap, UniqueHeap} from '../src/heap';

describe('heap', () => {
  it('should work with an empty heap', () => {
    const heap = new Heap();
    expect(heap.length).toEqual(0);
    expect(heap.pop()).toBeUndefined();
  });

  it('should work with a heap of one element', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});

    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of two elements in wrong order', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'b', priority: 2});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of two elements in right order', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'a', priority: 1});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of three elements in wrong order', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'c', priority: 3});

    expect(heap.length).toEqual(3);
    expect(heap.pop()).toEqual('c');
    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of three elements in right order', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'c', priority: 3});
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'a', priority: 1});

    expect(heap.length).toEqual(3);
    expect(heap.pop()).toEqual('c');
    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of repeated elements', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'a', priority: 1});

    expect(heap.length).toEqual(3);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work after pop', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'b', priority: 2});

    expect(heap.pop()).toEqual('b');

    heap.insert({entry: 'c', priority: 3});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('c');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work for peeking largest element', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'c', priority: 3});

    const index = heap.insert({entry: 'd', priority: 4});
    const node = heap.peek(index);

    expect(node.entry).toEqual('d');
  });

  it('should work for peeking smallest element', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'c', priority: 3});
    heap.insert({entry: 'd', priority: 4});

    const index = heap.insert({entry: 'a', priority: 1});
    const node = heap.peek(index);

    expect(node.entry).toEqual('a');
  });

  it('should work for peeking middle element', () => {
    const heap = new Heap<String>();
    heap.insert({entry: 'a', priority: 1});
    heap.insert({entry: 'b', priority: 2});
    heap.insert({entry: 'c', priority: 3});
    heap.insert({entry: 'e', priority: 5});

    const index = heap.insert({entry: 'd', priority: 4});
    const node = heap.peek(index);

    expect(node.entry).toEqual('d');
  });
});

describe('unique heap', () => {
  it('should work with an empty heap', () => {
    const heap = new UniqueHeap();
    expect(heap.length).toEqual(0);
    expect(heap.pop()).toBeUndefined();
  });

  it('should pop with a heap of one element', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});

    expect(heap.length).toEqual(1);

    const entry = heap.pop();

    expect(entry).toEqual({key: 'a', value: 10});
  });

  it('should pop with a heap of multiple element', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.insert({key: 'b', value: 20, priority: 2});
    heap.insert({key: 'c', value: 30, priority: 3});

    expect(heap.length).toEqual(3);

    let entry = heap.pop();

    expect(entry).toEqual({key: 'c', value: 30});
    expect(heap.length).toEqual(2);

    entry = heap.pop();

    expect(entry).toEqual({key: 'b', value: 20});
    expect(heap.length).toEqual(1);

    entry = heap.pop();

    expect(entry).toEqual({key: 'a', value: 10});
    expect(heap.length).toEqual(0);
  });

  it('should update with new value', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.update({key: 'a', value: 20});
    const entry = heap.pop();

    expect(heap.length).toEqual(0);
    expect(entry).toEqual({key: 'a', value: 20});
  });

  it('should update with new priority', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.insert({key: 'b', value: 20, priority: 2});
    heap.update({key: 'a', priority: 99});
    const entry = heap.pop();

    expect(heap.length).toEqual(1);
    expect(entry).toEqual({key: 'a', value: 20});
  });

  it('should update with new value and priority', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.insert({key: 'b', value: 20, priority: 2});
    heap.update({key: 'a', value: 30, priority: 99});
    const entry = heap.pop();

    expect(heap.length).toEqual(1);
    expect(entry).toEqual({key: 'a', value: 30});
  });

  it('should insert with same key but new value and priority', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.insert({key: 'b', value: 20, priority: 2});
    heap.insert({key: 'a', value: 30, priority: 99});
    const entry = heap.pop();

    expect(heap.length).toEqual(1);
    expect(entry).toEqual({key: 'a', value: 30});
  });

  it('should peek with multiple entries', () => {
    const heap = new UniqueHeap();
    heap.insert({key: 'a', value: 10, priority: 1});
    heap.insert({key: 'b', value: 20, priority: 2});
    heap.insert({key: 'c', value: 30, priority: 3});

    expect(heap.peek('a')).toEqual({value: 10, priority: 1});
    expect(heap.peek('b')).toEqual({value: 20, priority: 2});
    expect(heap.peek('c')).toEqual({value: 30, priority: 3});
  });

  it('should return undefined for peek of unknown key', () => {
    const heap = new UniqueHeap();
    expect(heap.peek('unknown')).toBeUndefined();
  });
});
