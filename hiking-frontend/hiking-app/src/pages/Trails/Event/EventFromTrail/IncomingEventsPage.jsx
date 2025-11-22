import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import { parseDateInHoursAndMinutes } from "../utils/dateFormatters.jsx";
import "./styles/incomingEvents.scss";
import NearestEventCard from "../components/NearestEventCard.jsx";
import eventService from "../services/eventService.js";
import ListEventCard from "../components/ListEvents.jsx";
import { EVENT_MODES } from "../const/eventModes.js";
import InputField from "../../../../components/Shared/InputField/InputField.jsx";
import { Button, Modal } from "antd";
// import EventCardItem from "../components/EventCardItem.jsx";
// import CustomModal from "../components/CustomModal.jsx";

const IncomingEventsPage = () => {
  const { trailId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "";
  const userId = useSelector((state) => state.loggedUser)?.user?._id;
  const token = useSelector((state) => state.loggedUser)?.token;
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    title: "",
    description: "",
  });

  const getEventAPIByEventMode = useCallback(() => {
    switch (mode) {
      case EVENT_MODES.PAST:
        return eventService.fetchPastEventsByTrailId(trailId);
      case EVENT_MODES.INCOMING:
        return eventService.fetchIncommingEventsByTrailId(trailId);
      default:
        eventService.fetchEventsByTrailId(trailId);
    }
  }, [mode, trailId]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await getEventAPIByEventMode();
      if (response !== null && response.status === 200) {
        setEvents(response.data);
        console.log(response.data);
        setNearestEvent(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Failed to fetch events");
    }
  }, [getEventAPIByEventMode]);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await eventService.deleteEvent({ eventId, token });
      if (response !== null && response.status === 200) {
        message.success("Event deleted successfully");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      message.error(error.response?.data?.error || "Failed to delete event");
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const response = await eventService.joinEvent({ eventId, userId });
      if (response !== null && response.status === 200) {
        message.success("Joined event successfully");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error joining event:", error);
      message.error("Failed to join event");
    }
  };

  const leaveEvent = async (eventId) => {
    try {
      const response = await eventService.leaveEvent({ eventId, userId });
      if (response !== null && response.status === 200) {
        message.success("Left event successfully");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      message.error("Failed to leave event");
    }
  };

  const onChangeHandler = ({ value, name }) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  useEffect(() => {
    if (trailId === undefined || trailId === null) return;

    fetchEvents();
  }, [trailId, fetchEvents]);

  const getEventById = async (eventId) => {
    try {
      const response = await eventService.getEvent(eventId);

      if (response !== null && response.status === 200) {
        const { title, description, date } = response.data;
        setCurrentEvent(response.data);
        const parsedDate = parseDateInHoursAndMinutes(date);
        setForm({
          ...form,
          title,
          description,
          date: parsedDate.formattedDate,
          time: parsedDate.formattedTime,
        });
      }
    } catch (error) {
      console.error("Error fetching event by ID:", error);
    }
  };

  const updateEvent = async () => {
    try {
      const formattedDateTime = `${form.date} ${form.time}`;
      const eventDateTime = new Date(formattedDateTime);
      const currentDateTime = new Date();

      if (eventDateTime < currentDateTime) {
        message.error("Cannot update event to past time");
        return;
      }

      const response = await eventService.updateEvent({
        eventId: currentEvent._id,
        userId,
        payload: {
          title: form.title,
          description: form.description,
          date: formattedDateTime,
        },
      });

      if (response !== null && response.status === 200) {
        fetchEvents();
        setForm({ date: "", time: "", title: "", description: "" });
        setModalVisible(false);
        message.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      message.error("Failed to update event");
    }
  };

  const onClickUpdate = (eventId) => {
    console.log("onClickUpdate");
    setModalVisible(true);
    getEventById(eventId);
  };

  const handleCancel = () => {
    setCurrentEvent(null);
    setModalVisible(false);
    setForm({ date: "", time: "", title: "", description: "" });
  };

  return (
    <div>
      <Modal
        title="Event Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={updateEvent}>
            Update Event
          </Button>,
        ]}
      >
        <div className="info-of-creating-event">
          <div className="name-of-event-creating">
            <p>TITLE OF EVENT</p>
            <InputField
              value={form?.title || ""}
              onChange={(e) =>
                onChangeHandler({
                  value: e.target.value,
                  name: "title",
                })
              }
            />
            <p>DESCRIPTION</p>
            <InputField
              value={form.description || ""}
              onChange={(e) =>
                onChangeHandler({
                  value: e.target.value,
                  name: "description",
                })
              }
            />
            <p>SET DATE</p>
            <InputField
              type="date"
              value={form?.date || ""}
              onChange={(e) =>
                onChangeHandler({
                  value: e.target.value,
                  name: "date",
                })
              }
            />
            <p>SET TIME</p>
            <InputField
              type="time"
              value={form?.time || ""}
              onChange={(e) =>
                onChangeHandler({
                  value: e.target.value,
                  name: "time",
                })
              }
            />
          </div>
        </div>
      </Modal>
      <div className="nearest-event">
        {mode === EVENT_MODES.INCOMING && (
          <>
            <div className="join-nearest-event-title">
              <h1>NEXT EXPERIENCE AWAITS!</h1>
              <h2>JOIN NEAREST EVENT</h2>
            </div>

            <div style={{ marginTop: "80px" }}>
              <NearestEventCard
                event={nearestEvent}
                userId={userId}
                leave={leaveEvent}
                join={joinEvent}
                handleDeleteEvent={handleDeleteEvent}
                onClickUpdate={onClickUpdate}
              />
            </div>
          </>
        )}
      </div>

      <div className="event-card-container">
        <div className="incoming-events-title">
          <h1>{mode === EVENT_MODES.INCOMING ? "INCOMING" : "PAST"} EVENTS</h1>
        </div>
        <ListEventCard
          userId={userId}
          leaveEvent={leaveEvent}
          joinEvent={joinEvent}
          handleDeleteEvent={handleDeleteEvent}
          onClickUpdate={onClickUpdate}
          data={events}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default IncomingEventsPage;
