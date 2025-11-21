import React from "react";
import StarRating from "./StarRating";
import "./DetailsOfTrail.scss";

const DetailsOfTrails = ({ trail, averageRating }) => {
  return (
    <div className="details-of-single-trail">
      <div className="photo-description">
        {/* <p>{trail?.description}</p> */}
        <div className="additional-info-of-trail">
          <div className="info-row">
            <div className="length-of-trails">
              <h1>LENGTH</h1>
              <p>{trail?.length}</p>
            </div>

            <div className="elavation-of-gain">
              <h1>ELAVATION GAIN</h1>
              <p>{trail?.elevationGain}</p>
            </div>

            <div className="trail-difficulty-type">
              <h1>DIFFICULTY</h1>
              <p>{trail?.difficulty}</p>
            </div>
          </div>

          {averageRating > 0 && (
            <div className="average-rating">
              <StarRating rating={averageRating} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsOfTrails;
