const cityGraph = {
  A: [
    { node: "B", distance: 4 },
    { node: "F", distance: 3 }
  ],

  B: [
    { node: "A", distance: 4 },
    { node: "C", distance: 2 },
    { node: "D", distance: 5 }
  ],

  C: [
    { node: "B", distance: 2 },
    { node: "D", distance: 3 },
    { node: "E", distance: 5 },
    { node: "F", distance: 2 }
  ],

  D: [
    { node: "B", distance: 5 },
    { node: "C", distance: 3 },
    { node: "E", distance: 2 }
  ],

  E: [
    { node: "C", distance: 5 },
    { node: "D", distance: 2 },
    { node: "F", distance: 6 }
  ],

  F: [
    { node: "A", distance: 3 },
    { node: "C", distance: 2 },
    { node: "E", distance: 6 }
  ]
};

export { cityGraph };