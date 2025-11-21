import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import "./TrailsDetailsComponent.scss";
// import { AverageRatingComponent } from "./AverageRatingComponent";

const TrailDetailsComponent = ({ trail, averageRating }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const elementsToFade = document.querySelectorAll(
        ".title-of-trail, .text-of-subtitle, .trail-line-one, .trail-line-two"
      );

      const opacity = 1 - scrollPosition / 300;

      elementsToFade.forEach((element) => {
        element.style.opacity = opacity;
      });

      if (scrollPosition > 200) {
        setIsFading(true);
      } else {
        setIsFading(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`trailspage-main-image-single-trail ${
        isFading ? "fade-out" : ""
      }`}
      style={{
        backgroundImage: trail?.photos && trail.photos.length > 0
          ? `linear-gradient(to bottom, transparent 0%, rgba(11, 29, 38, 0.4) 60%, rgba(11, 29, 38, 0.95) 100%), url(${trail.photos[0]})`
          : 'linear-gradient(135deg, rgba(11, 29, 38, 0.95) 0%, rgba(20, 57, 75, 0.9) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 className="title-of-trail">{trail?.name?.toUpperCase() || 'TRAIL'}</h1>

      <div className="title-section">
        <div className="trail-line-one"> </div>

        <h3 className="text-of-subtitle">GET LOST IN THE BEAUTY OF NATURE</h3>
        
        <div className="trail-line-two"> </div>
      </div>

      <div className="photo-description">
        {trail?.description && (
          <p>{trail.description}</p>
        )}
      </div>
    </div>
  );
};

export default TrailDetailsComponent;
