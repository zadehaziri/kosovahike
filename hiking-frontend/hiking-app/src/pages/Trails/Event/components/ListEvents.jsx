import { useEffect, useState, memo } from "react";
import { useCountdown } from "../hooks/CountDowntimer";
import EventCardItem from "../components/EventCardItem";
import { calculateRemainingDateUnits } from "../utils/dateFormatters";

const ListEventCard = ({
  data,
  userId,
  leaveEvent,
  joinEvent,
  handleDeleteEvent,
  onClickUpdate,
  mode = "",
}) => {
  const [modifiedEvents, setModifiedEvents] = useState([]);
  const eachSecondPassed = () => {
    updateEvents();
  };
  const { start, reset } = useCountdown(0, eachSecondPassed);

  const updateEvents = (isFirst) => {
    let events = [];
    if (isFirst) {
      events = data.map((item) => ({
        ...item,
        remainingDateUnits: calculateRemainingDateUnits(item?.date),
      }));
    } else {
      events = modifiedEvents.map((item) => ({
        ...item,
        remainingDateUnits: calculateRemainingDateUnits(item?.date),
      }));
    }
    setModifiedEvents(events);
  };

  useEffect(() => {
    if (data === null) return;
    console.log(data);
    start();
    updateEvents(true);

    return () => {
      reset();
    };
  }, [data]);

  return (
    <>
      {modifiedEvents !== null &&
        modifiedEvents.map((event) => (
          <EventCardItem
            mode={mode}
            event={event}
            userId={userId}
            key={event._id}
            leave={leaveEvent}
            join={joinEvent}
            handleDeleteEvent={handleDeleteEvent}
            onClickUpdate={onClickUpdate}
          />
        ))}
    </>
  );
};

export default memo(ListEventCard);
