
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Ambulances from "./pages/Ambulances";
import Hospitals from "./pages/Hospitals";
import RoutePlanner from "./pages/RoutePlanner";
import {
  Ambulance,
  Bell,
  Hospital,
  MapPin,
  Navigation,
  Route,
  RouteIcon,
  Siren,
  Activity,
  Clock3,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route as RouterRoute,
  Link,
  useLocation,
} from "react-router-dom";

import { cityGraph } from "./data/cityGraph";
import { dijkstra } from "./algorithms/dijkstra";
import Emergencies from "./pages/Emergencies";
import "./styles.css";


// =====================================================
// CITY NODES
// =====================================================

const nodes = {
  A: { x: 12, y: 62, name: "Sector 1" },
  B: { x: 31, y: 30, name: "Sector 2" },
  C: { x: 51, y: 55, name: "Sector 3" },
  D: { x: 72, y: 27, name: "Sector 4" },
  E: { x: 88, y: 57, name: "City Hospital" },
  F: { x: 48, y: 82, name: "Sector 5" },
};


// =====================================================
// CITY EDGES
// =====================================================

const edges = [
  ["A", "B", 4],
  ["A", "F", 3],
  ["B", "C", 2],
  ["B", "D", 5],
  ["C", "D", 3],
  ["C", "E", 5],
  ["C", "F", 2],
  ["D", "E", 2],
  ["F", "E", 6],
];


// =====================================================
// EMERGENCIES
// =====================================================

const initialEmergencies = [
  {
    id: "E101",
    priority: "CRITICAL",
    location: "Sector 1",
    locationNode: "A",
    time: "2 min ago",
    color: "red",
  },
  {
    id: "E102",
    priority: "HIGH",
    location: "Sector 5",
    locationNode: "F",
    time: "5 min ago",
    color: "amber",
  },
  {
    id: "E103",
    priority: "NORMAL",
    location: "Sector 3",
    locationNode: "C",
    time: "8 min ago",
    color: "green",
  },
];



// =====================================================
// HOSPITALS
// =====================================================




// =====================================================
// DASHBOARD
// =====================================================

function Dashboard({
  emergencies = [],
  ambulances = [],
  hospitals = [],
  selectedEmergency,
  onSelectEmergency,
  source,
  setSource,
  result,
  setResult,
  running,
  findFastestRoute,
  assignedAmbulance,
}) {

  const availableAmbulances =
    ambulances.filter(
      (ambulance) =>
        ambulance.status === "Available"
    ).length;

  const hospitalsOnline =
    hospitals.filter(
      (hospital) =>
        hospital.status === "Online"
    ).length;


  const pathEdges = new Set(
    result.path
      .slice(0, -1)
      .map(
        (node, index) =>
          [
            node,
            result.path[index + 1],
          ]
            .sort()
            .join("-")
      )
  );


  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <header>

        <div>

          <h1>
            Emergency Command Center
          </h1>

          <p>
            Monitor incidents and optimize
            ambulance response.
          </p>

        </div>

        <div className="header-right">

          <button className="icon">
            <Bell size={19} />
          </button>

          <div className="admin">

            <div className="avatar">
              AD
            </div>

            <span>
              Admin
            </span>

          </div>

        </div>

      </header>


      {/* =========================================
          STATS
      ========================================= */}

      <section className="stats">

        <div className="stat">

          <div className="stat-icon red">
            <Siren />
          </div>

          <div>

            <span>
              Active emergencies
            </span>

            <b>
              {emergencies.length}
            </b>

          </div>

        </div>


        <div className="stat">

          <div className="stat-icon green">
            <Ambulance />
          </div>

          <div>

            <span>
              Available ambulances
            </span>

            <b>
              {availableAmbulances}
            </b>

          </div>

        </div>


        <div className="stat">

          <div className="stat-icon blue">
            <Hospital />
          </div>

          <div>

            <span>
              Hospitals online
            </span>

            <b>
              {hospitalsOnline}
            </b>

          </div>

        </div>


        <div className="stat">

          <div className="stat-icon amber">
            <Clock3 />
          </div>

          <div>

            <span>
              Avg. response
            </span>

            <b>
              11 min
            </b>

          </div>

        </div>

      </section>


      {/* =========================================
          MAP + EMERGENCY QUEUE
      ========================================= */}

      <section className="grid">


        {/* MAP */}

        <div className="panel map-panel">

          <div className="panel-head">

            <div>

              <h2>
                Live City Network
              </h2>

              <p>
                Weighted road graph
              </p>

            </div>

            <span className="badge">
              ● LIVE
            </span>

          </div>


          <div className="map">

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              {edges.map(
                ([a, b, weight]) => {

                  const key =
                    [a, b]
                      .sort()
                      .join("-");

                  return (
                    <g key={key}>

                      <line
                        className={
                          pathEdges.has(key)
                            ? "road selected-road"
                            : "road"
                        }
                        x1={nodes[a].x}
                        y1={nodes[a].y}
                        x2={nodes[b].x}
                        y2={nodes[b].y}
                      />

                      <text
                        className="weight"
                        x={
                          (nodes[a].x +
                            nodes[b].x) /
                          2
                        }
                        y={
                          (nodes[a].y +
                            nodes[b].y) /
                            2 -
                          2
                        }
                      >
                        {weight} km
                      </text>

                    </g>
                  );
                }
              )}

            </svg>


            {Object.entries(nodes).map(
              ([id, node]) => (

                <button
                  key={id}
                  className={
                    "node " +
                    (
                      result.path.includes(id)
                        ? "path-node"
                        : ""
                    )
                  }
                  style={{
                    left:
                      node.x + "%",
                    top:
                      node.y + "%",
                  }}
                  onClick={() => {

                    setSource(id);

                    setResult({
                      path: [],
                      distance: null,
                    });

                  }}
                >

                  <span>

                    {
                      id === "E"
                        ? "🏥"
                        : id === "A"
                        ? "🚑"
                        : "●"
                    }

                  </span>

                  <small>
                    {node.name}
                  </small>

                </button>

              )
            )}


            <div className="map-legend">

              <span>
                <i className="dot path" />
                Optimal route
              </span>

              <span>
                <i className="dot" />
                Road network
              </span>

            </div>

          </div>

        </div>


        {/* EMERGENCY QUEUE */}

        <div className="panel emergency-panel">

          <div className="panel-head">

            <div>

              <h2>
                Emergency Queue
              </h2>

              <p>
                Priority-based dispatch
              </p>

            </div>

          </div>


          {emergencies.map(
            (emergency) => (

              <button
                key={emergency.id}
                onClick={() =>
                  onSelectEmergency(
                    emergency
                  )
                }
                className={
                  "incident " +
                  (
                    selectedEmergency ===
                    emergency.id
                      ? "selected"
                      : ""
                  )
                }
              >

                <div
                  className={
                    "priority " +
                    emergency.color
                  }
                />


                <div className="incident-main">

                  <b>

                    {emergency.id}

                    <span>
                      {emergency.priority}
                    </span>

                  </b>


                  <small>

                    <MapPin size={13} />

                    {emergency.location}

                    {" · "}

                    {emergency.time}

                  </small>

                </div>


                <Navigation size={17} />

              </button>

            )
          )}


          <Link
            to="/emergencies"
            className="view-all"
          >
            View all emergencies →
          </Link>

        </div>

      </section>


      {/* =========================================
          ROUTE + FLEET
      ========================================= */}

      <section className="bottom-grid">


        {/* ROUTE */}

        <div className="panel route-panel">

          <div className="panel-head">

            <div>

              <h2>
                Optimal Route Calculator
              </h2>

              <p>
                Dijkstra's shortest path
                algorithm
              </p>

            </div>

            <span className="algo">
              Dijkstra
            </span>

          </div>


          <div className="route-controls">

            <label>

              Ambulance location

              <select
                value={source}
                onChange={(e) => {

                  setSource(
                    e.target.value
                  );

                  setResult({
                    path: [],
                    distance: null,
                  });

                }}
              >

                {Object.entries(nodes)
                  .filter(
                    ([id]) =>
                      id !== "E"
                  )
                  .map(
                    ([id, node]) => (

                      <option
                        key={id}
                        value={id}
                      >
                        {id} — {node.name}
                      </option>

                    )
                  )}

              </select>

            </label>


            <div className="arrow">
              →
            </div>


            <label>

              Destination

              <div className="destination">

                <Hospital size={17} />

                City Hospital

              </div>

            </label>


            <button
              className="run-btn"
              onClick={findFastestRoute}
              disabled={running}
            >

              {
                running
                  ? "Calculating…"
                  : "Find fastest route"
              }

            </button>

          </div>


          <div className="result">

            <div>

              <span>
                Shortest route
              </span>

              <strong>

                {
                  result.path.length > 0
                    ? result.path.join(" → ")
                    : 'Click "Find fastest route"'
                }

              </strong>

            </div>


            <div>

              <span>
                Total distance
              </span>

              <strong>

                {
                  result.distance !== null
                    ? `${result.distance} km`
                    : "--"
                }

              </strong>

            </div>


            <div>

              <span>
                Algorithm
              </span>

              <strong>
                O((V+E) log V)
              </strong>

            </div>

          </div>

        </div>


        {/* FLEET */}

        <div className="panel fleet-panel">

          <div className="panel-head">

            <div>

              <h2>
                Fleet Status
              </h2>

              <p>
                Nearby ambulances
              </p>

            </div>

          </div>


          {ambulances.map(
            (ambulance) => {

              const assigned =
                assignedAmbulance?.id ===
                ambulance.id;

              return (

                <div
                  className="fleet"
                  key={ambulance.id}
                >

                  <div className="fleet-icon">

                    <Ambulance size={17} />

                  </div>


                  <div>

                    <b>
                      {ambulance.id}
                    </b>

                    <small>
                      {ambulance.distance}
                      {" km from incident"}
                    </small>

                  </div>


                  <span
                    className={
                      ambulance.status === "Busy"
                        ? "busy"
                        : "available"
                    }
                  >

                    {
                      assigned
                        ? "Assigned"
                        : ambulance.status
                    }

                  </span>

                </div>

              );

            }
          )}


          {assignedAmbulance && (

            <div
              style={{
                margin: "10px 17px",
                padding: "10px",
                borderRadius: "8px",
                background: "#ecfdf5",
                color: "#15803d",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >

              🚑 {assignedAmbulance.id}
              {" assigned to "}
              {selectedEmergency}

            </div>

          )}

        </div>

      </section>


      <footer>
        RapidRoute • DSA-powered emergency response prototype
        • Graph + Dijkstra + Priority Queue
      </footer>

    </>
  );
}


// =====================================================
// MAIN APP
// =====================================================

function App() {

  const [emergencies] =
    useState(initialEmergencies);

  const [ambulances, setAmbulances] =
    useState([
      {
        id: "A-04",
        distance: 2.1,
        status: "Available",
      },
      {
        id: "A-07",
        distance: 3.4,
        status: "Available",
      },
      {
        id: "A-02",
        distance: 5.8,
        status: "Busy",
      },
    ]);

    const [hospitals, setHospitals] = useState([
  {
    id: "H-01",
    name: "City Hospital",
    location: "Sector 4",
    beds: 18,
    status: "Online",
  },
  {
    id: "H-02",
    name: "Metro Care Hospital",
    location: "Sector 2",
    beds: 12,
    status: "Online",
  },
  {
    id: "H-03",
    name: "LifeLine Hospital",
    location: "Sector 5",
    beds: 7,
    status: "Online",
  },
  {
    id: "H-04",
    name: "Central Medical Center",
    location: "Sector 3",
    beds: 0,
    status: "Offline",
  },
]);
  const [selectedEmergency, setSelectedEmergency] =
    useState("E101");

  const [source, setSource] =
    useState("A");

  const [assignedAmbulance, setAssignedAmbulance] =
    useState(null);

  const [running, setRunning] =
    useState(false);

  const [result, setResult] =
    useState({
      path: [],
      distance: null,
    });


  // ===================================================
  // EMERGENCY SELECTION + AMBULANCE ASSIGNMENT
  // ===================================================

  const handleEmergencyClick = (emergency) => {

    setSelectedEmergency(
      emergency.id
    );

    setSource(
      emergency.locationNode
    );

    setResult({
      path: [],
      distance: null,
    });


    const available =
      ambulances.filter(
        (ambulance) =>
          ambulance.status === "Available"
      );


    if (available.length === 0) {

      setAssignedAmbulance(null);

      alert(
        "No ambulance is currently available."
      );

      return;
    }


    const nearest =
      available.reduce(
        (nearestAmbulance, ambulance) =>
          ambulance.distance <
          nearestAmbulance.distance
            ? ambulance
            : nearestAmbulance
      );


    setAssignedAmbulance(nearest);


    setAmbulances(
      (current) =>
        current.map(
          (ambulance) =>
            ambulance.id === nearest.id
              ? {
                  ...ambulance,
                  status: "Busy",
                }
              : ambulance
        )
    );

  };


  // ===================================================
  // DIJKSTRA
  // ===================================================

  const findFastestRoute = () => {

    setRunning(true);

    setTimeout(() => {

      const shortestPath =
        dijkstra(
          cityGraph,
          source,
          "E"
        );

      setResult(
        shortestPath
      );

      setRunning(false);

    }, 500);

  };


  return (

    <div className="app">

      {/* ===========================================
          SIDEBAR
      =========================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="logo">
            ✚
          </div>

          <div>

            <b>
              RapidRoute
            </b>

            <span>
              Emergency Response
            </span>

          </div>

        </div>


        <nav>

          <Link
            to="/"
            className=
              "nav-link"
            
          >
            <Activity size={18} />
            Dashboard
          </Link>


          <Link
            to="/emergencies"
            className="nav-link"
          >

            <Siren size={18} />

            Emergencies

            <em>
              {emergencies.length}
            </em>

          </Link>


        <Link to="/ambulances" className="nav-link">
  <Ambulance size={18} />
  Ambulances
</Link>


         <Link to="/hospitals" className="nav-link">
  <Hospital size={18}/>
  Hospitals
</Link>


     <Link
  to="/route-planner"
  className="nav-link"
>
  <Route size={18} />
  Route Planner
</Link>

        </nav>


        <div className="side-card">

          <span>
            System status
          </span>

          <strong>
            <i />
            All systems operational
          </strong>

        </div>

      </aside>


      {/* ===========================================
          CONTENT
      =========================================== */}

      <main>

        <Routes>

          <RouterRoute
            path="/"
            element={
              <Dashboard
                emergencies={emergencies}
                ambulances={ambulances}
                 hospitals={hospitals}
                selectedEmergency={
                  selectedEmergency
                }
                onSelectEmergency={
                  handleEmergencyClick
                }
                source={source}
                setSource={setSource}
                result={result}
                setResult={setResult}
                running={running}
                findFastestRoute={
                  findFastestRoute
                }
                assignedAmbulance={
                  assignedAmbulance
                }
              />
            }
          />


          <RouterRoute
            path="/emergencies"
            element={
              <Emergencies
                emergencies={emergencies}
                selectedEmergency={
                  selectedEmergency
                }
                onSelectEmergency={
                  handleEmergencyClick
                }
              />
            }
          />

          <RouterRoute
  path="/ambulances"
  element={
    <Ambulances
      ambulances={ambulances}
      emergencies={emergencies}
      assignedAmbulance={assignedAmbulance}
      onAssign={handleEmergencyClick}
      onRelease={(ambulanceId) => {
        setAmbulances((current) =>
          current.map((ambulance) =>
            ambulance.id === ambulanceId
              ? {
                  ...ambulance,
                  status: "Available",
                }
              : ambulance
          )
        );

        setAssignedAmbulance(null);
      }}
    />
  }
/>

<RouterRoute
  path="/hospitals"
  element={
    <Hospitals
      hospitals={hospitals}
    />
  }
/>
<RouterRoute
  path="/route-planner"
  element={
    <RoutePlanner
      nodes={nodes}
      dijkstra={dijkstra}
      cityGraph={cityGraph}
    />
  }
/>

        </Routes>

      </main>

    </div>

  );
}


// =====================================================
// START APP
// =====================================================

createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
