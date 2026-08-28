
import React, { useState } from "react";
import {
  MapPin,
  Hospital,
  Navigation,
  Route as RouteIcon,
  Ambulance,
  Search,
} from "lucide-react";

function RoutePlanner({
  nodes = {},
  dijkstra,
  cityGraph,
}) {
  const [source, setSource] = useState("A");
  const [destination, setDestination] = useState("E");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const findRoute = () => {
    setRunning(true);

    setTimeout(() => {
      if (dijkstra && cityGraph) {
        const shortestPath = dijkstra(
          cityGraph,
          source,
          destination
        );

        setResult(shortestPath);
      }

      setRunning(false);
    }, 500);
  };

  const locations = Object.entries(nodes).filter(
    ([id]) => id !== destination
  );

  return (
    <div className="page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Route Planner</h1>
          <p>
            Calculate the fastest emergency route using Dijkstra's algorithm.
          </p>
        </div>

        <span className="algo">
          Dijkstra
        </span>
      </div>


      {/* ROUTE FORM */}
      <div className="panel route-planner-card">

        <div className="panel-head">
          <div>
            <h2>Plan Emergency Route</h2>
            <p>
              Select an ambulance location and destination.
            </p>
          </div>

          <RouteIcon size={20} />
        </div>


        <div className="planner-form">

          {/* SOURCE */}
          <div className="planner-field">

            <label>
              <Ambulance size={15} />
              Ambulance location
            </label>

            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setResult(null);
              }}
            >
              {locations.map(([id, node]) => (
                <option
                  key={id}
                  value={id}
                >
                  {id} — {node.name}
                </option>
              ))}
            </select>

          </div>


          <div className="planner-arrow">
            →
          </div>


          {/* DESTINATION */}
          <div className="planner-field">

            <label>
              <Hospital size={15} />
              Destination
            </label>

            <div className="planner-destination">
              <Hospital size={17} />
              City Hospital
            </div>

          </div>


          {/* BUTTON */}
          <button
            className="run-btn planner-button"
            onClick={findRoute}
            disabled={running}
          >
            <Search size={15} />

            {running
              ? "Calculating..."
              : "Find fastest route"}
          </button>

        </div>

      </div>


      {/* RESULT */}
      {result && result.path && result.path.length > 0 && (

        <div className="panel route-result-panel">

          <div className="panel-head">
            <div>
              <h2>Route Found</h2>
              <p>
                Optimal path calculated successfully.
              </p>
            </div>

            <span className="route-success">
              Optimal
            </span>
          </div>


          <div className="route-result-content">

            <div className="route-result-box">

              <span>Shortest route</span>

              <strong>
                {result.path.join(" → ")}
              </strong>

            </div>


            <div className="route-result-box">

              <span>Total distance</span>

              <strong>
                {result.distance} km
              </strong>

            </div>


            <div className="route-result-box">

              <span>Algorithm</span>

              <strong>
                Dijkstra
              </strong>

            </div>

          </div>


          {/* ROUTE STEPS */}
          <div className="route-steps">

            <h3>Route sequence</h3>

            {result.path.map((nodeId, index) => (

              <div
                className="route-step"
                key={`${nodeId}-${index}`}
              >

                <div className="route-step-number">
                  {index + 1}
                </div>

                <div className="route-step-content">

                  <strong>
                    {nodeId}
                  </strong>

                  <span>
                    {nodes[nodeId]?.name || "Location"}
                  </span>

                </div>

                {index < result.path.length - 1 && (
                  <Navigation
                    size={15}
                    className="step-arrow"
                  />
                )}

              </div>

            ))}

          </div>

        </div>

      )}


      {/* EMPTY STATE */}
      {!result && (

        <div className="panel route-empty">

          <div className="route-empty-icon">
            <MapPin size={28} />
          </div>

          <h2>No route calculated</h2>

          <p>
            Select an ambulance location and click
            <strong> Find fastest route </strong>
            to calculate the optimal path.
          </p>

        </div>

      )}

    </div>
  );
}

export default RoutePlanner;

