import {RequireAtLeastOne} from 'type-fest';

export class Heap<Entry> {
  pop(): Entry | undefined {
    if (this.nodes.length === 0) return undefined;

    const returnEntry = this.nodes[0].entry;

    this.nodes[0] = this.nodes[this.nodes.length - 1];
    this.nodes.pop();
    this.bubbleDown(0);

    return returnEntry;
  }

  insert({entry, priority}: {entry: Entry; priority: number}): number {
    this.nodes.push({entry, priority});
    return this.bubbleUp(this.nodes.length - 1);
  }

  update(
    index: number,
    {entry, priority}: RequireAtLeastOne<{entry?: Entry; priority?: number}>
  ): number {
    if (entry !== undefined) {
      this.nodes[index].entry = entry;
    }
    if (priority !== undefined) {
      this.nodes[index].priority = priority;
      return this.bubbleDown(this.bubbleUp(index));
    }
    return index;
  }

  peek(index: number): {entry: Entry; priority: number} {
    return this.nodes[index];
  }

  get length(): number {
    return this.nodes.length;
  }

  private readonly nodes: Array<{
    entry: Entry;
    // Larger number means higher priority.
    priority: number;
  }> = [];

  private bubbleUp(atIndex: number): number {
    if (atIndex === 0) return 0;

    const parentIndex = Math.floor((atIndex - 1) / 2);
    if (this.nodes[parentIndex].priority >= this.nodes[atIndex].priority) {
      return atIndex;
    }

    [this.nodes[parentIndex], this.nodes[atIndex]] = [
      this.nodes[atIndex],
      this.nodes[parentIndex],
    ];
    return this.bubbleUp(parentIndex);
  }

  private bubbleDown(atIndex: number): number {
    const leftIndex = atIndex * 2 + 1;
    // Can't bubble down on a leaf node.
    if (leftIndex >= this.nodes.length) return atIndex;

    const leftEntry = this.nodes[leftIndex].entry;
    const atEntry = this.nodes[atIndex].entry;

    const rightIndex = atIndex * 2 + 2;
    if (rightIndex >= this.nodes.length) {
      // Have only left node.
      if (atEntry >= leftEntry) {
        return atIndex;
      }

      [this.nodes[atIndex], this.nodes[leftIndex]] = [
        this.nodes[leftIndex],
        this.nodes[atIndex],
      ];
      return this.bubbleDown(leftIndex);
    } else {
      // Have both child nodes.
      const rightEntry = this.nodes[rightIndex].entry;

      if (atEntry >= leftEntry && atEntry >= rightEntry) {
        return atIndex;
      }

      if (leftEntry > rightEntry) {
        [this.nodes[atIndex], this.nodes[leftIndex]] = [
          this.nodes[leftIndex],
          this.nodes[atIndex],
        ];
        return this.bubbleDown(leftIndex);
      } else {
        [this.nodes[atIndex], this.nodes[rightIndex]] = [
          this.nodes[rightIndex],
          this.nodes[atIndex],
        ];
        return this.bubbleDown(rightIndex);
      }
    }
  }

  private isLeaf(index: number): boolean {
    // Check if the child is in the array.
    return index * 2 + 1 >= this.nodes.length;
  }
}

export enum InsertResult {
  INSERTED,
  UPDATED,
}

export class UniqueHeap<Key, Value> {
  pop(): KeyValue<Key, Value> | undefined {
    const entry = this.heap.pop();
    if (!entry) return undefined;

    this.indices.delete(entry.key);
    return entry;
  }

  insert({
    key,
    value,
    priority,
  }: {
    key: Key;
    value: Value;
    priority: number;
  }): InsertResult {
    if (this.indices.has(key)) {
      this.update({key, value, priority});
      return InsertResult.UPDATED;
    } else {
      const entry = {key, value};
      this.heap.insert({entry, priority});
      this.indices.set(key, entry);
      return InsertResult.INSERTED;
    }
  }

  update({
    key,
    value,
    priority,
  }: RequireAtLeastOne<
    {
      key: Key;
      value?: Value;
      priority?: number;
    },
    'value' | 'priority'
  >): void {
    const index = this.indices.get(key);
    if (index === undefined) {
      throw new RangeError(`Key ${key} does not exist.`);
    }

    const {entry, priority: oldPriority} = this.heap.peek(index);

    const newIndex = this.heap.update(index, {
      entry: {key, value: value ?? entry.value},
      priority: priority ?? oldPriority,
    });
    this.indices.set(key, newIndex);
  }

  peek(key: Key): {value: Value; priority: number} | undefined {
    const index = this.indices.get(key);
    if (index === undefined) return undefined;

    const node = this.heap.peek(index);
    return {
      value: node.entry.value,
      priority: node.priority,
    };
  }

  get length(): number {
    return this.heap.length;
  }

  private heap: Heap<{key: Key; value: Value}> = new Heap();
  private indices: Map<Key, KeyValue<Key, Value>> = new Map();
}

type KeyValue<Key, Value> = {
  key: Key;
  value: Value;
};
