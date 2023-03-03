export type Graph<Node> = (parent: Node) => IterableIterator<Node>;
export type EdgeWeight<Node> = (from: Node, to: Node) => number;

export type WeightedGraph<Node> = {
  children: Graph<Node>;
  weights: EdgeWeight<Node>;
};

/** Stackless version of depth first search. */
export function dfs<Node>(
  graph: Graph<Node>,
  startNode: Node,
  handler: (child: Node, parent: Node | undefined) => boolean
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
