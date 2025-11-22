import { useEffect, useState, memo, useCallback } from "react";
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
  
  const updateEvents = useCallback((isFirst) => {
    let events = [];
    if (isFirst) {
      events = data.map((item) => ({
        ...item,
        remainingDateUnits: calculateRemainingDateUnits(item?.date),
      }));
    } else {
      setModifiedEvents(prev => prev.map((item) => ({
        ...item,
        remainingDateUnits: calculateRemainingDateUnits(item?.date),
      })));
      return;
    }
    setModifiedEvents(events);
  }, [data]);

  const eachSecondPassed = useCallback(() => {
    updateEvents();
  }, [updateEvents]);

  const { start, reset } = useCountdown(0, eachSecondPassed);

  useEffect(() => {
    if (data === null) return;
    console.log(data);
    start();
    updateEvents(true);

    return () => {
      reset();
    };
  }, [data, start, reset, updateEvents]);

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
