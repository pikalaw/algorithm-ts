import {WeightedGraph} from './graph';

export function shortestPath<Node>(
  graph: WeightedGraph<Node>,
  {source, target}: {source: Node; target: Node}
): {
  path: readonly Node[];
  cost: number;
} {
  return {
    path: [],
    cost: 0,
  };
}
