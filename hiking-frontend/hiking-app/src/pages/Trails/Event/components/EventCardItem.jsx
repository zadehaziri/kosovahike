import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  calculateRemainingDateUnits,
  //   carendarUnits,
} from "../utils/dateFormatters";
import moment from "moment";
import { isUserAlreadyJoined } from "../utils/isUserAlreadyJoined";
import EventButtons from "./EventButtons";
import { EVENT_MODES } from "../const/eventModes";

const EventCardItem = ({
  event,
  userId,
  leave,
  join,
  handleDeleteEvent,
  onClickUpdate,
  mode,
}) => {
  const parsedDate = moment(event?.date)?.format("h:mm A");
  const eventDate = moment(event?.date).format("DD/MM/YYYY");
  const isUserJoined = isUserAlreadyJoined(event.attendees, userId);
  const isCreator = event.creator && event.creator._id === userId;
  const calculatedDateUnits = event?.remainingDateUnits
    ? event?.remainingDateUnits
    : calculateRemainingDateUnits(event.date);

  return (
    <div className="event-card">
      <div className="card-of-date-and-time-events">
        <div className="date-and-time-incoming">
          <p>{eventDate}</p>
          <p className="event-time-incoming">{parsedDate}</p>
        </div>

        <div className="attendees-events-incoming">
          <p>{event.attendees.length}</p>
          <FontAwesomeIcon icon={faPerson} />
        </div>
      </div>
      {mode !== undefined && mode === EVENT_MODES.INCOMING && (
        <div className="event-countdown-incoming-events">
          <div className="count-down-days-incoming-events">
            <p className="event-countdown-ss-incoming-events">
              {calculatedDateUnits?.days}
            </p>
            <p className="text-of-days-hours-incoming-events">DAYS</p>
          </div>
          <div className="count-down-hours-incoming-events">
            <p className="event-countdown-ss-incoming-events">
              {calculatedDateUnits?.hours}
            </p>
            <p className="text-of-days-hours-incoming-events">HOURS</p>
          </div>
          <div className="count-down-minutes-incoming-events">
            <p className="event-countdown-ss-incoming-events">
              {calculatedDateUnits?.minutes}
            </p>
            <p className="text-of-days-hours-incoming-events">MINUTES</p>
          </div>
          <div className="count-down-minutes-incoming-events">
            <p className="event-countdown-ss-incoming-events">
              {calculatedDateUnits?.seconds}
            </p>
            <p className="text-of-days-hours-incoming-events">SECONDS</p>
          </div>
        </div>
      )}
      <p className="event-title-incoming-events">{event.title}</p>
      <div className="event-creator-incoming">
        <div className="organizer-icon">
          <div className="icon-of-organizer">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h2 style={{ fontSize: "20px" }}>ORGANIZER </h2>
        </div>

        <div className="organizer-details">
          <p>
            {event.creator?.firstName} {event.creator?.lastName}
          </p>
        </div>
      </div>
      <div
        className="event-attendees"
        style={{
          maxHeight: "50px",
          minHeight: "50px",
          overflowY: "auto",
          padding: "10px",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "#9bc19b #f1f1f1",
        }}
      >
        {event.attendees.map((attendeeItem, index) => (
          <span key={index}>
            {index + 1}. {attendeeItem.firstName} {attendeeItem.lastName}
          </span>
        ))}
      </div>

      <div className="btn-container-incoming-events">
        <EventButtons
          join={() => join(event._id)}
          leave={() => leave(event._id)}
          update={() => {
            onClickUpdate(event._id);
          }}
          handleDeleteEvent={() => {
            console.log("handleDeleteEvent");
            handleDeleteEvent(event._id);
          }}
          isUserJoined={isUserJoined}
          isCreator={isCreator}
        />
      </div>
    </div>
  );
};

export default memo(EventCardItem);
