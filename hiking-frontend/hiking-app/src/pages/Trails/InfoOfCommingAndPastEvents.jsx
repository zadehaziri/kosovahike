import "./InfoOfCommingAndPastEvents.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const InfoOfCommingAndPastEvents = ({ trail }) => {
  if (trail === undefined || trail === null) {
    return <div>Loading...</div>;
  }

  return (
    <section className="page-contain-of-events">
      <Link
        to={"/incoming-events/" + trail._id + "?mode=incoming"}
        className="data-card"
      >
        <h3>25</h3>
        <div style={{ maxHeight: "150px", minHeight: "150px" }}>
          <h4>INCOMMING EVENTS</h4>
          <p className="paragraph">Be part of the next events!</p>
        </div>

        <p className="link-text">
          View the next events
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "10px" }} />
        </p>
      </Link>

      <Link
        to={"/incoming-events/" + trail._id + "?mode=past"}
        className="data-card"
      >
        <h3>49</h3>
        <div style={{ maxHeight: "150px", minHeight: "150px" }}>
          <h4>PAST EVENTS</h4>
          <p className="paragraph">See all past events and user experience!</p>
        </div>
        <p className="link-text">
          View past events
          <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "10px" }} />
        </p>
      </Link>
    </section>
  );
};

export default InfoOfCommingAndPastEvents;
