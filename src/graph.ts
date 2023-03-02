export type GraphChildren<Node> = (parent: Node) => readonly Node[];
export type EdgeWeight<Node> = (from: Node, to: Node) => number;

export type WeightedGraph<Node> = {
  children: GraphChildren<Node>;
  weights: EdgeWeight<Node>;
};
