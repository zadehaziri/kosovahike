import { useState } from "react";
import "./ExtraInformations.scss";

const ExtraInformations = ({ trail }) => {
  const [status] = useState(true);
  const [hovered, setHovered] = useState(false);

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    let result = `${hours} hours`;
    if (minutes !== 0) {
      result += ` ${minutes} minutes`;
    }
    return result;
  };

  const calculateCalories = () => {
    let calories = 0;
    const baseCaloriesPerHour = 300;

    const difficultyCaloriesMap = {
      easy: 50,
      moderate: 100,
      hard: 200,
    };

    calories += difficultyCaloriesMap[trail?.difficulty] || 0;

    const durationInHours = trail?.duration / 60;
    calories += durationInHours * baseCaloriesPerHour;

    return parseFloat(calories.toFixed(2)).toString();
  };

  const difficultyColorMap = {
    easy: "green",
    moderate: "yellow",
    hard: "red",
  };

  const handleHover = () => {
    setHovered(!hovered);
  };

  const renderDifficultyCircle = () => {
    const difficultyColor = difficultyColorMap[trail?.difficulty];

    return (
      <div className={`difficulty-circle ${difficultyColor}`}>
        <div className="inner-circle"></div>
      </div>
    );
  };

  return (
    <div className="extra-information-of-trail">
      <div className="data-of-trail-single">
        <div className="route-type">
          {/* <div className="paragraph-one">
            <h3>ROUTE TYPE</h3>
          </div>
          <div className="paragraph-two">
            <p>{trail?.routeType}</p>
          </div> */}
        </div>

        <div className="length">
          <div className="paragraph-one">
            <h3>LENGTH</h3>
          </div>
          <div className="paragraph-two">
            <p>{trail?.length}</p>
          </div>
        </div>
        <div className="duration">
          <div className="paragraph-one">
            <h3>DURATION</h3>
          </div>
          <div className="paragraph-two">
            <p>{formatDuration(trail?.duration)}</p>
          </div>
        </div>
        <div className="calories-burned">
          <div className="paragraph-one">
            <h3>CALORIES BURNED</h3>
          </div>
          <div className="paragraph-two">
            <p>{calculateCalories()} kcal</p>
          </div>
        </div>

        <div className="status">
          <div className="paragraph-one">
            <h3>Status</h3>
          </div>
          <div className="paragraph-two">
            <p className="status">{status ? "ACTIVE" : "PASSIVE"}</p>
          </div>
        </div>
      </div>

      <div className="difficulty">
        <div
          className={`progress-container ${
            difficultyColorMap[trail?.difficulty]
          }`}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          <svg className="progress-svg" viewBox="0 0 100 100">
            <circle className="progress-circle" cx="50" cy="50" r="40"></circle>
            <circle
              className={`progress-circle-filled ${hovered ? "hovered" : ""}`}
              cx="50"
              cy="50"
              r="40"
              strokeDasharray="251.2"
              strokeDashoffset="251.2"
            ></circle>
          </svg>
          <p>{trail?.difficulty.toUpperCase()}</p>
        </div>
      </div>

      {/* <div className="difficulty">
        <div className="show-icon-of-difficilty">
          {renderDifficultyCircle()}
        </div>
        <p>{trail?.difficulty.toUpperCase()}</p>
      </div> */}
    </div>
  );
};

export default ExtraInformations;
