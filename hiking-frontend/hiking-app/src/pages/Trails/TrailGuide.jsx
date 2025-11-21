import React from "react";
import "./TrailGuide.scss";
import trailGuider from "./boy.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Button from "../../components/Shared/Button/Button";
import "../../styles/variables.scss";

const TrailGuide = ({ onBookClick }) => {
  const guideData = {
    firstName: "John",
    lastName: "Doe",
    image: trailGuider,
    description:
      "John Doe, an experienced trail guide, brings over a decade of expertise in leading outdoor expeditions. With a passion for nature and a friendly demeanor, he ensures safe, educational, and unforgettable adventures for all, catering to both seasoned hikers and novice explorers alike.",
    nationality: "Albanian",
    languages: ["Albanian", "English"],
  };

  return (
    <div className="trail-guide">
      <div className="guide-header">
        <div className="guide-profile">
          <img className="guide-image" src={guideData.image} alt="Guide" />
          <div className="guide-info">
            <h2>Trail Guide</h2>
            <h3>
              {guideData.firstName} {guideData.lastName}
            </h3>
            <p className="guide-experience">Experience 7 years</p>
          </div>
        </div>
      </div>
      
      <div className="guide-content">
        <div className="guide-details-section">
          <div className="detail-item">
            <span className="detail-label">Nationality</span>
            <span className="detail-value">{guideData.nationality}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Languages</span>
            <span className="detail-value">{guideData.languages.join(", ")}</span>
          </div>
        </div>
        
        <div className="guide-description">
          <p>{guideData.description}</p>
        </div>
        
        <div className="guide-footer">
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebook} className="icon-fb" />
            <FontAwesomeIcon icon={faEnvelope} className="icon-email" />
          </div>
          <div className="button-book-now">
            <Button className="basic-btn green">Book Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailGuide;
