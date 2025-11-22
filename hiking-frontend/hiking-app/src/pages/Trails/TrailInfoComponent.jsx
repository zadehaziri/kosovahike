import React from "react";
import EventCalendarComponent from "./EventCalendarComponent";
import "./TrailInfoComponent.scss";
import InfoOfCommingAndPastEvents from "./InfoOfCommingAndPastEvents";

const TrailInfoComponent = ({ location, trail }) => {
  return (
    <div className="trailspage-info">
      <div className="trailspage-event">
        <div className="info-box">
          <EventCalendarComponent trail={trail} />
        </div>
      </div>
      <div className="title-pick-date">
        <h1 className="title-pick-the-date">SELECT A DATE</h1>
        <p className="or-text">or</p>
        <h3 className="join-the-date">JOIN IN ON THE FUN</h3>
      </div>
      <InfoOfCommingAndPastEvents trail={trail} />
    </div>
  );
};

export default TrailInfoComponent;
