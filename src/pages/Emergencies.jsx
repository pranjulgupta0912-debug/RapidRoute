
import React from "react";
import {
  Siren,
  MapPin,
  Clock3,
  Ambulance,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function Emergencies({
  emergencies,
  selectedEmergency,
  onSelectEmergency,
}) {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Emergency Management</h1>
          <p>
            Monitor and manage all active emergency incidents.
          </p>
        </div>

        <div className="emergency-count">
          <Siren size={17} />
          {emergencies.length} Active
        </div>
      </div>

      <section className="emergency-stats">

        <div className="emergency-stat">
          <div className="emergency-stat-icon red">
            <Siren size={20} />
          </div>

          <div>
            <span>Total emergencies</span>
            <strong>{emergencies.length}</strong>
          </div>
        </div>

        <div className="emergency-stat">
          <div className="emergency-stat-icon red">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Critical</span>
            <strong>
              {emergencies.filter(
                (e) => e.priority === "CRITICAL"
              ).length}
            </strong>
          </div>
        </div>

        <div className="emergency-stat">
          <div className="emergency-stat-icon amber">
            <Clock3 size={20} />
          </div>

          <div>
            <span>High priority</span>
            <strong>
              {emergencies.filter(
                (e) => e.priority === "HIGH"
              ).length}
            </strong>
          </div>
        </div>

        <div className="emergency-stat">
          <div className="emergency-stat-icon green">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Normal</span>
            <strong>
              {emergencies.filter(
                (e) => e.priority === "NORMAL"
              ).length}
            </strong>
          </div>
        </div>

      </section>

      <div className="panel emergency-list-panel">

        <div className="panel-head">
          <div>
            <h2>Emergency Queue</h2>
            <p>
              Select an emergency to dispatch an ambulance.
            </p>
          </div>
        </div>

        <div className="emergency-table">

          <div className="emergency-table-header">
            <span>Emergency</span>
            <span>Priority</span>
            <span>Location</span>
            <span>Time</span>
            <span>Action</span>
          </div>

          {emergencies.map((emergency) => {

            const selected =
              selectedEmergency === emergency.id;

            return (
              <div
                key={emergency.id}
                className={
                  "emergency-row " +
                  (selected
                    ? "selected-emergency"
                    : "")
                }
                onClick={() =>
                  onSelectEmergency(emergency)
                }
              >

                <div className="emergency-id">

                  <div
                    className={
                      "priority " +
                      emergency.color
                    }
                  />

                  <div>
                    <strong>
                      {emergency.id}
                    </strong>

                    <small>
                      Emergency incident
                    </small>
                  </div>

                </div>

                <div>
                  <span
                    className={
                      "priority-badge " +
                      emergency.color
                    }
                  >
                    {emergency.priority}
                  </span>
                </div>

                <div className="location-cell">

                  <MapPin size={15} />

                  <span>
                    {emergency.location}
                  </span>

                </div>

                <div className="time-cell">

                  <Clock3 size={14} />

                  {emergency.time}

                </div>

                <div>

                  <button
                    className={
                      selected
                        ? "dispatch-btn selected-btn"
                        : "dispatch-btn"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectEmergency(emergency);
                    }}
                  >

                    <Ambulance size={15} />

                    {selected
                      ? "Selected"
                      : "Dispatch"}

                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Emergencies;

