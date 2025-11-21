import React from "react";
import Weather from "../weather/Weather";
import TrailGuide from "../Trails/TrailGuide";
// import TrailRouteComponent from "./TrailsRouteComponent";
// import TestComponent from "../../components/TestComponent";
// import DescriptionAndImageTrail from "./DescriptionAndImageTrail";
// import DescriptionSection from "./DescriptionSection";
// import DescriptionAndImageTrail from "./DescriptionAndImageTrail";

import ExtraInformations from "./ExtraInformations";
import "./OnTopDescription.scss";

const OnTopDescription = ({ trail }) => {
  return (
    <div className="on-top-description-weather">
      <div className="weather-and-extra-informations">
        <Weather />
        <ExtraInformations trail={trail} />
        <TrailGuide />
      </div>
    </div>
  );
};

export default OnTopDescription;
