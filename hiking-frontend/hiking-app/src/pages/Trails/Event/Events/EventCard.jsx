import React from "react";
import Button from "../../../components/Shared/Button/Button";
import "./eventCard.scss";

const EventCard = ({ event }) => {
  const {
    title,
    date,
    time,
    location,
    description,
    organizer,
    difficulty,
    type,
    cost,
    contact,
    groupSize,
    joinedNames,
  } = event;

  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Location: {location}</p>
      <p>Description: {description}</p>
      <p>Organizer: {organizer}</p>
      {difficulty && <p>Difficulty: {difficulty}</p>}
      {type && <p>Type: {type}</p>}
      {cost && <p>Cost: {cost}</p>}
      {contact && <p>Contact: {contact}</p>}
      {groupSize && <p>Group Size: {groupSize}</p>}
      {joinedNames && Array.isArray(joinedNames) && joinedNames.length > 0 && (
        <div className="event-card__details">
          <p>Joined Participants:</p>
          <ul>
            {joinedNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
      <Button className="event-card__button">Join</Button>
    </div>
  );
};

export default EventCard;
