import React from "react";
import star from "../../assets/images/star.png";
import halfStar from "../../assets/images/halfStar.png";
import emptyStar from "../../assets/images/emptyStar.png";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <img
          key={i}
          src={star}
          alt="Full Star"
          style={{ width: "20px", height: "20px" }}
        />
      );
    } else if (i === fullStars && decimalPart >= 0.5) {
      stars.push(
        <img
          key={i}
          src={halfStar}
          alt="Half Star"
          style={{ width: "20px", height: "20px" }}
        />
      );
    } else {
      stars.push(
        <img
          key={i}
          src={emptyStar}
          alt="Empty Star"
          style={{ width: "20px", height: "20px" }}
        />
      );
    }
  }

  return <div style={{ display: "flex", flexDirection: "row" }}>{stars}</div>;
};

export default StarRating;
