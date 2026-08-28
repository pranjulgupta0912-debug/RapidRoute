
import React from "react";
import {
  Hospital,
  MapPin,
  Phone,
  Activity,
  Bed,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function Hospitals({ hospitals = [] }) {
  const online = hospitals.filter(
    (hospital) => hospital.status === "Online"
  ).length;

  const offline = hospitals.filter(
    (hospital) => hospital.status === "Offline"
  ).length;

  const totalBeds = hospitals.reduce(
    (total, hospital) => total + (hospital.beds || 0),
    0
  );

  return (
    <div className="page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Hospital Network</h1>
          <p>
            Monitor hospitals, emergency capacity and availability.
          </p>
        </div>

        <div className="hospital-live">
          <span></span>
          Network Live
        </div>
      </div>


      {/* SUMMARY CARDS */}
      <section className="hospital-stats">

        <div className="hospital-stat">
          <div className="hospital-stat-icon blue">
            <Hospital size={20} />
          </div>

          <div>
            <span>Total hospitals</span>
            <strong>{hospitals.length}</strong>
          </div>
        </div>


        <div className="hospital-stat">
          <div className="hospital-stat-icon green">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Online</span>
            <strong>{online}</strong>
          </div>
        </div>


        <div className="hospital-stat">
          <div className="hospital-stat-icon red">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>Offline</span>
            <strong>{offline}</strong>
          </div>
        </div>


        <div className="hospital-stat">
          <div className="hospital-stat-icon amber">
            <Bed size={20} />
          </div>

          <div>
            <span>Available beds</span>
            <strong>{totalBeds}</strong>
          </div>
        </div>

      </section>


      {/* HOSPITAL LIST */}
      <div className="panel hospital-panel">

        <div className="panel-head">
          <div>
            <h2>Hospital Network</h2>
            <p>
              Current hospital status and emergency capacity.
            </p>
          </div>
        </div>


        <div className="hospital-table">

          {/* HEADER */}
          <div className="hospital-table-header">
            <span>Hospital</span>
            <span>Status</span>
            <span>Location</span>
            <span>Beds</span>
            <span>Emergency</span>
          </div>


          {/* HOSPITALS */}
          {hospitals.map((hospital) => (

            <div
              className="hospital-row"
              key={hospital.id}
            >

              {/* NAME */}
              <div className="hospital-name">

                <div className="hospital-icon">
                  <Hospital size={18} />
                </div>

                <div>
                  <strong>
                    {hospital.name}
                  </strong>

                  <small>
                    {hospital.id}
                  </small>
                </div>

              </div>


              {/* STATUS */}
              <div>

                <span
                  className={
                    hospital.status === "Online"
                      ? "hospital-status online-status"
                      : "hospital-status offline-status"
                  }
                >
                  <i></i>

                  {hospital.status}
                </span>

              </div>


              {/* LOCATION */}
              <div className="hospital-location">

                <MapPin size={15} />

                {hospital.location}

              </div>


              {/* BEDS */}
              <div className="bed-cell">

                <Bed size={15} />

                <span>
                  {hospital.beds}
                </span>

              </div>


              {/* EMERGENCY */}
              <div>

                {hospital.status === "Online" ? (

                  <span className="emergency-ready">
                    <Activity size={14} />
                    Emergency Ready
                  </span>

                ) : (

                  <span className="emergency-unavailable">
                    Unavailable
                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* NETWORK MESSAGE */}
      {online > 0 && (
        <div className="hospital-info">

          <div className="hospital-info-icon">
            <Hospital size={19} />
          </div>

          <div>
            <strong>
              Hospital network operational
            </strong>

            <p>
              {online} hospital{online !== 1 ? "s" : ""} currently
              available for emergency admissions.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

export default Hospitals;

