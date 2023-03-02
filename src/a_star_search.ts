import {WeightedGraph} from './graph';

export function shortestPath<Node>(
  graph: WeightedGraph<Node>,
  {source, target}: {source: Node; target: Node}
): readonly Node[] {
  return [];
}
