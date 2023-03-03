export class Heap<Value> {
  pop(): Value | undefined {
    if (this.nodes.length === 0) return undefined;

    const returnValue = this.nodes[0].value;

    this.nodes[0] = this.nodes[this.nodes.length - 1];
    this.nodes.pop();
    this.bubbleDown(0);

    return returnValue;
  }

  insert({value, priority}: {value: Value; priority: number}): void {
    this.nodes.push({value, priority});
    this.bubbleUp(this.nodes.length - 1);
  }

  get length(): number {
    return this.nodes.length;
  }

  private readonly nodes: Array<Node<Value>> = [];

  private bubbleUp(atIndex: number): void {
    if (atIndex === 0) return;

    const parentIndex = Math.floor((atIndex - 1) / 2);
    if (this.nodes[parentIndex].value < this.nodes[atIndex].value) {
      [this.nodes[parentIndex], this.nodes[atIndex]] = [
        this.nodes[atIndex],
        this.nodes[parentIndex],
      ];
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(atIndex: number): void {
    const leftIndex = atIndex * 2 + 1;
    // Can't bubble down on a leaf node.
    if (leftIndex >= this.nodes.length) return;

    const leftValue = this.nodes[leftIndex].value;
    const atValue = this.nodes[atIndex].value;

    const rightIndex = atIndex * 2 + 2;
    if (rightIndex >= this.nodes.length) {
      // Have only left node.
      if (leftValue > atValue) {
        [this.nodes[atIndex], this.nodes[leftIndex]] = [
          this.nodes[leftIndex],
          this.nodes[atIndex],
        ];
        this.bubbleDown(leftIndex);
      }
    } else {
      // Have both child nodes.
      const rightValue = this.nodes[rightIndex].value;

      if (atValue >= leftValue && atValue >= rightValue) return;

      if (leftValue > rightValue) {
        [this.nodes[atIndex], this.nodes[leftIndex]] = [
          this.nodes[leftIndex],
          this.nodes[atIndex],
        ];
        this.bubbleDown(leftIndex);
      } else {
        [this.nodes[atIndex], this.nodes[rightIndex]] = [
          this.nodes[rightIndex],
          this.nodes[atIndex],
        ];
        this.bubbleDown(rightIndex);
      }
    }
  }

  private isLeaf(index: number): boolean {
    // Check if the child is in the array.
    return index * 2 + 1 >= this.nodes.length;
  }
}

type Node<Value> = {
  value: Value;
  // Larger number means higher priority.
  priority: number;
};
