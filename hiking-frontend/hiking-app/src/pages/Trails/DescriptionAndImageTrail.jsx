import React, { useState } from "react";
import "./DescriptionAndImageTrail.scss";

const DescriptionAndImageTrail = ({ trail }) => {
  const [zoomedIn, setZoomedIn] = useState(false);

  if (!trail) {
    return <div>Loading...</div>;
  }

  const cardStyle = {
    backgroundImage: `url(${
      trail.photos && trail.photos.length > 0 ? trail.photos[0] : ""
    })`,
    backgroundRepeat: "no-repeat",
    backgroundSize: zoomedIn ? "cover" : "100% 100%",
    filter: zoomedIn ? "none" : "grayscale(100%)",
    transition: "background-size 0.8s, filter 0.8s",
  };

  return (
    <div
      className="container-of-trail-description-of-single"
      onMouseEnter={() => setZoomedIn(true)}
      onMouseLeave={() => setZoomedIn(false)}
    >
      <div className="card-description-single-trail card0" style={cardStyle}>
        <div className="border">
          <h2>DESCRIPTION</h2>
          <p className="description-of-the-single-trail-image">
            {trail.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionAndImageTrail;
