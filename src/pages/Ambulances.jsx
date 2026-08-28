
import React from "react";
import {
  Ambulance,
  MapPin,
  Activity,
  CheckCircle,
  Clock3,
} from "lucide-react";

function Ambulances({
  ambulances = [],
  assignedAmbulance = null,
  onAssign = () => {},
  onRelease = () => {},
}) {
  const available = ambulances.filter(
    (ambulance) => ambulance.status === "Available"
  ).length;

  const busy = ambulances.filter(
    (ambulance) => ambulance.status === "Busy"
  ).length;

  return (
    <div className="page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Ambulance Fleet</h1>
          <p>
            Monitor ambulance availability and dispatch status.
          </p>
        </div>

        <div className="fleet-live">
          <span></span>
          Fleet Live
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <section className="ambulance-stats">

        <div className="ambulance-stat">
          <div className="ambulance-stat-icon blue">
            <Ambulance size={20} />
          </div>

          <div>
            <span>Total ambulances</span>
            <strong>{ambulances.length}</strong>
          </div>
        </div>

        <div className="ambulance-stat">
          <div className="ambulance-stat-icon green">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Available</span>
            <strong>{available}</strong>
          </div>
        </div>

        <div className="ambulance-stat">
          <div className="ambulance-stat-icon amber">
            <Activity size={20} />
          </div>

          <div>
            <span>Busy</span>
            <strong>{busy}</strong>
          </div>
        </div>

        <div className="ambulance-stat">
          <div className="ambulance-stat-icon red">
            <Clock3 size={20} />
          </div>

          <div>
            <span>On response</span>
            <strong>{busy}</strong>
          </div>
        </div>

      </section>

      {/* FLEET */}
      <div className="panel ambulance-panel">

        <div className="panel-head">
          <div>
            <h2>Ambulance Fleet</h2>
            <p>
              Current ambulance locations and assignments.
            </p>
          </div>
        </div>

        <div className="ambulance-table">

          {/* TABLE HEADER */}
          <div className="ambulance-table-header">
            <span>Ambulance</span>
            <span>Status</span>
            <span>Distance</span>
            <span>Assignment</span>
            <span>Action</span>
          </div>

          {/* AMBULANCES */}
          {ambulances.map((ambulance) => {

            const assigned =
              assignedAmbulance?.id === ambulance.id;

            return (
              <div
                className="ambulance-row"
                key={ambulance.id}
              >

                {/* NAME */}
                <div className="ambulance-name">

                  <div className="ambulance-icon">
                    <Ambulance size={18} />
                  </div>

                  <div>
                    <strong>{ambulance.id}</strong>
                    <small>Emergency Unit</small>
                  </div>

                </div>

                {/* STATUS */}
                <div>

                  <span
                    className={
                      ambulance.status === "Busy"
                        ? "fleet-status busy-status"
                        : "fleet-status available-status"
                    }
                  >
                    <i></i>

                    {assigned
                      ? "Assigned"
                      : ambulance.status}
                  </span>

                </div>

                {/* DISTANCE */}
                <div className="distance-cell">

                  <MapPin size={15} />

                  <span>
                    {ambulance.distance} km
                  </span>

                </div>

                {/* ASSIGNMENT */}
                <div className="assignment-cell">

                  {assigned ? (
                    <span>
                      Assigned to emergency
                    </span>
                  ) : ambulance.status === "Busy" ? (
                    <span>
                      In response
                    </span>
                  ) : (
                    <span className="not-assigned">
                      No active assignment
                    </span>
                  )}

                </div>

                {/* ACTION */}
                <div>

                  {assigned ? (

                    <button
                      className="release-btn"
                      onClick={() =>
                        onRelease(ambulance.id)
                      }
                    >
                      Release
                    </button>

                  ) : ambulance.status === "Available" ? (

                    <button
                      className="assign-btn"
                      onClick={() =>
                        onAssign(ambulance)
                      }
                    >
                      Assign
                    </button>

                  ) : (

                    <span className="response-label">
                      Responding
                    </span>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* NEAREST AMBULANCE */}
      {available > 0 && (
        <div className="nearest-card">

          <div className="nearest-icon">
            <Ambulance size={19} />
          </div>

          <div>
            <strong>
              Nearest available ambulance
            </strong>

            <p>
              {
                [...ambulances]
                  .filter(
                    (a) =>
                      a.status === "Available"
                  )
                  .sort(
                    (a, b) =>
                      a.distance - b.distance
                  )[0]?.id
              }{" "}
              is closest to the current emergency.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

/* THIS IS THE IMPORTANT LINE */
export default Ambulances;

