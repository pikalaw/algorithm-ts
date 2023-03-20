export type Graph<Node> = (parent: Node) => IterableIterator<Node>;
export type EdgeWeight<Node> = (from: Node, to: Node) => number;

export type WeightedGraph<Node> = {
  children: Graph<Node>;
  weights: EdgeWeight<Node>;
};

export type Handler<Node> = (child: Node, parent: Node | undefined) => boolean;

/** Stackless version of depth first search. */
export function dfs<Node>(
  graph: Graph<Node>,
  startNode: Node,
  handler: Handler<Node>
): void {
  // Stop the search if the handler asks for termination.
  if (!handler(startNode, undefined)) return;

  const frames: Array<DfsFrame<Node>> = [
    {
      node: startNode,
      children: graph(startNode),
    },
  ];
  const visited = new Set<Node>();
  visited.add(startNode);

  while (frames.length > 0) {
    const frame = frames[frames.length - 1];
    const node = frame.node;
    const maybeChild = frame.children.next();
    if (maybeChild.done) {
      frames.pop();
      continue;
    }
    const child = maybeChild.value;
    if (visited.has(child)) {
      continue;
    }

    // Stop the search if the handler asks for termination.
    if (!handler(child, node)) return;
    visited.add(child);
    frames.push({
      node: child,
      children: graph(child),
    });
  }
}

type DfsFrame<Node> = {
  node: Node;
  children: IterableIterator<Node>;
};

/** Breadth first search. */
export function bfs<Node>(
  graph: Graph<Node>,
  startNode: Node,
  handler: Handler<Node>
): void {
  // Stop the search if the handler asks for termination.
  if (!handler(startNode, undefined)) return;

  const visited = new Set<Node>();
  visited.add(startNode);

  let head: BfsFrame<Node> | undefined = {node: startNode};
  let tail = head;
  while (head !== undefined) {
    const node = head.node;
    for (const child of graph(node)) {
      if (visited.has(child)) continue;

      // Stop the search if the handler asks for termination.
      if (!handler(child, node)) return;
      visited.add(child);
      tail.next = {node: child};
      tail = tail.next;
    }
    head = head.next;
  }
}

type BfsFrame<Node> = {
  node: Node;
  next?: BfsFrame<Node>;
};

// A* search of the shortest path.
export function shortestPath<Node>({
  graph,
  source,
  target,
  lowerBound,
}: {
  graph: WeightedGraph<Node>;
  source: Node;
  target: Node;
  lowerBound?: EdgeWeight<Node>;
}): {
  path: readonly Node[];
  cost: number;
} {
  const remainingLowerBound = (node: Node): number =>
    lowerBound?.(node, target) ?? 0;
/*
  const heap = new UniqueHeap<Node, number>();
  heap.insert({
    key: source,
    value: 0,
    priority: -remainingLowerBound(source),
  });

  const parents = new Map<Node, Node>();

  while (heap.length > 0) {
    const {key: node, value: costSoFar} = heap.pop()!;
    if (node === target) {
      return {
        path: extractPath(parents, target),
        cost: costSoFar,
      };
    }

    for (const child of graph.children(node)) {
      const newChildCost = costSoFar + graph.weights(node, child);
      const oldChildCost = -(heap.peek(child)?.priority ?? -Infinity);
      if (newChildCost < oldChildCost) {
        heap.insert({
          key: child,
          value: newChildCost,
          priority: -newChildCost - remainingLowerBound(child),
        });
        parents.set(child, node);
      }
    }
  }
*/
  return {path: [], cost: NaN};
}

function extractPath<Node>(
  parents: Map<Node, Node>,
  target: Node
): readonly Node[] {
  const path: Node[] = [target];
  for (;;) {
    const parent = parents.get(path[path.length - 1]);
    if (parent === undefined) break;
    path.push(parent);
  }
  return path.reverse();
}
