export type PriorityQueue<Node> = {
  insert(newElement: Node, priority: number): void;
  pop(): Node | undefined;
  get length(): number;
};

export class ArrayPriorityQueue<Node> implements PriorityQueue<Node> {
  constructor(initialSize = 0) {
    this.orderedElements = new Array(initialSize);
  }

  insert(newElement: Node, priority: number): void {
    this.orderedElements.push({element: newElement, priority: priority});
  }

  pop(): Node | undefined {
    return this.orderedElements.pop()?.element;
  }

  get length(): number {
    return this.orderedElements.length;
  }

  private readonly orderedElements: Array<{
    element: Node;
    // Larger number means higher priority.
    priority: number;
  }>;
}
