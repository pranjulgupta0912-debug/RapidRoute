export function dijkstra(graph, start, destination) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  // Set initial distances
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  // Distance from starting point to itself
  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    let currentNode = null;

    // Find the unvisited node with the smallest distance
    for (const node in graph) {
      if (
        !visited.has(node) &&
        (
          currentNode === null ||
          distances[node] < distances[currentNode]
        )
      ) {
        currentNode = node;
      }
    }

    // Stop if no reachable node remains
    if (
      currentNode === null ||
      distances[currentNode] === Infinity
    ) {
      break;
    }

    visited.add(currentNode);

    // Check all connected nodes
    for (const neighbor of graph[currentNode]) {
      const neighborNode = neighbor.node;

      const newDistance =
        distances[currentNode] + neighbor.distance;

      // If this route is shorter, update it
      if (newDistance < distances[neighborNode]) {
        distances[neighborNode] = newDistance;
        previous[neighborNode] = currentNode;
      }
    }
  }

  // Build shortest path
  const path = [];
  let current = destination;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  // Destination cannot be reached
  if (path[0] !== start) {
    return {
      distance: Infinity,
      path: []
    };
  }

  return {
    distance: distances[destination],
    path: path
  };
}