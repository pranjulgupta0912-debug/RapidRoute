import { cityGraph } from "./data/cityGraph";
import { dijkstra } from "./algorithms/dijkstra";

const result = dijkstra(cityGraph, "A", "E");

console.log(result);