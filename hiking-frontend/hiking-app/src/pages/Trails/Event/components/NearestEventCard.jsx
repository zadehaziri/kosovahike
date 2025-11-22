import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import {
  calculateRemainingDateUnits,
  carendarUnits,
} from "../utils/dateFormatters";
import { isUserAlreadyJoined } from "../utils/isUserAlreadyJoined";
import EventButtons from "./EventButtons";
import { useCountdown } from "../hooks/CountDowntimer";

const NearestEventCard = ({
  event,
  userId,
  leave,
  join,
  handleDeleteEvent,
  onClickUpdate,
}) => {
  const [remainingUnits, setRemainingUnits] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [calendarUnits, setCalendarUnits] = useState({
    months: "",
    hours: "",
    days: "",
  });

  const updateUnits = useCallback(() => {
    if (event && event.date) {
      setRemainingUnits(calculateRemainingDateUnits(event.date));
      setCalendarUnits(carendarUnits(event.date));
    }
  }, [event]);

  const eachSecondPassed = useCallback(() => {
    updateUnits();
  }, [updateUnits]);

  const { start, reset } = useCountdown(60, eachSecondPassed);

  useEffect(() => {
    start();

    return () => {
      reset();
    };
  }, [start, reset]);

  useEffect(() => {
    if (event) {
      updateUnits();
    }
  }, [event, updateUnits]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const durationDate = moment(event.date).add(event.trail.duration, "minutes");

  return (
    <div className="event-card-nearest-event">
      <div className="event-date-time-day-month">
        <div className="time-start-event">
          <div className="event-time-start">
            <p className="start-time"> Start</p>
            <p className="start-time-number">
              {moment(event.date)?.format("h:mm A")}
            </p>
          </div>
        </div>

        <div className="date-month-and-day">
          <p className="event-month-month">{calendarUnits?.months}</p>
          <p className="event-month-calendar">
            {moment(event.date).format("DD")}
          </p>

          <p className="event-month-week">{calendarUnits?.days}</p>
        </div>

        <div className="event-time-start">
          <p className="start-time-end">End</p>
          <p className="start-time-number">{durationDate.format("h:mm A")}</p>
        </div>
      </div>
      <div className="event-countdown">
        <div className="count-down-days">
          <div className="countdown-border">
            {remainingUnits?.days}
            <p className="text-of-days-hours">DAYS</p>
          </div>
        </div>
        <div className="count-down-hours">
          <div className="countdown-border">
            {remainingUnits?.hours}
            <p className="text-of-days-hours">HOURS</p>
          </div>
        </div>
        <div className="count-down-minutes">
          <span className="countdown-border">
            {remainingUnits?.minutes}
            <p className="text-of-days-hours">MINUTES</p>
          </span>
        </div>
        <div className="count-down-seconds">
          <span className="countdown-border">
            {remainingUnits?.seconds}
            <p className="text-of-days-hours">SECONDS</p>
          </span>
        </div>
      </div>
      <div className="event-title-nearest-div">
        <p className="event-title-nearest">{event?.title}</p>
      </div>
      <div className="second-section-nearest">
        <p className="event-description">Description: {event?.description}</p>
        <div className="organizer-and-attendees">
          <div className="organizer-info">
            <p className="event-creator">ORGANIZER</p>
            <p>{event?.creator?.firstName + " " + event?.creator?.lastName}</p>
          </div>
          <div className="attendees-info">
            <p className="event-attendees">ATTENDESS</p>
            <p>{event.attendees.length}</p>
          </div>
        </div>
      </div>
      {event?.attendees && event?.attendees?.length > 0 && (
        <div className="event-attendees">
          {event.attendees.map((attendeeItem, index) => (
            <span key={index}>
              {attendeeItem.firstName + " " + attendeeItem.lastName}
            </span>
          ))}
          <div className="btn-container-incoming-events">
            <EventButtons
              join={() => join(event._id)}
              leave={() => leave(event._id)}
              update={() => {
                onClickUpdate(event._id);
              }}
              handleDeleteEvent={() => {
                handleDeleteEvent(event._id);
              }}
              isUserJoined={isUserAlreadyJoined(event.attendees, userId)}
              isCreator={userId === event.creator?._id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NearestEventCard;
