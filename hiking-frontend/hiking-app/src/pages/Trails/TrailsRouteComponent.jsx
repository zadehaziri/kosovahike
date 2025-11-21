import React, { useMemo } from "react";
import { AverageRatingComponent } from "./AverageRatingComponent";

import "./TrailsRouteComponent.scss";

const TrailRouteComponent = ({ trail }) => {
  const mapUrl = useMemo(() => {
    if (!trail) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(
      trail.name + ", " + trail.location
    )}&output=embed`;
  }, [trail]);

  return (
    <div className="trailspage-trail">
      {/* <h2>Route:</h2> */}
      {mapUrl && (
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="map"
        ></iframe>
      )}

      <div></div>
    </div>
  );
};

export default TrailRouteComponent;
