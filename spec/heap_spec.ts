import {Heap} from '../src/heap';

describe('heap', () => {
  it('should work with an empty heap', () => {
    const heap = new Heap();
    expect(heap.length).toEqual(0);
    expect(heap.pop()).toBeUndefined();
  });

  it('should work with a heap of one element', () => {
    const heap = new Heap<String>();
    heap.insert({value: 'a', priority: 1});

    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of two elements in wrong order', () => {
    const heap = new Heap<String>();
    heap.insert({value: 'a', priority: 1});
    heap.insert({value: 'b', priority: 2});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of two elements in right order', () => {
    const heap = new Heap<String>();
    heap.insert({value: 'b', priority: 2});
    heap.insert({value: 'a', priority: 1});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('b');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });

  it('should work with a heap of three elements in wrong order', () => {
    const heap = new Heap<String>();
    heap.insert({value: 'a', priority: 1});
    heap.insert({value: 'b', priority: 2});
    heap.insert({value: 'c', priority: 3});

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
    heap.insert({value: 'c', priority: 3});
    heap.insert({value: 'b', priority: 2});
    heap.insert({value: 'a', priority: 1});

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
    heap.insert({value: 'a', priority: 1});
    heap.insert({value: 'a', priority: 1});
    heap.insert({value: 'a', priority: 1});

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
    heap.insert({value: 'a', priority: 1});
    heap.insert({value: 'b', priority: 2});

    expect(heap.pop()).toEqual('b');

    heap.insert({value: 'c', priority: 3});

    expect(heap.length).toEqual(2);
    expect(heap.pop()).toEqual('c');
    expect(heap.length).toEqual(1);
    expect(heap.pop()).toEqual('a');
    expect(heap.length).toEqual(0);
  });
});
