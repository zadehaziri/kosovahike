import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, Modal, Button, message } from "antd";
import "./EventCalendarComponent.scss";
import axios from "axios";
import InputField from "../../components/Shared/InputField/InputField";
import IncomingEventsPage from "./Event/EventFromTrail/IncomingEventsPage";
import moment from "moment/moment";
import { updateEvents } from "../../redux/users/loggedUserSlice";
import { useDispatch } from "react-redux";
import { config } from "../../../config";

const EventCalendarComponent = ({ trail }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [modalTime, setModalTime] = useState(null);
  const [mode, setMode] = useState("month");
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.loggedUser)?.user?._id;
  const token = useSelector((state) => state.loggedUser)?.token;

  useEffect(() => {
    fetchEvents();
  }, []);

  const BASE_URL = config.BASE_URL;

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/events`);
      const fetchedEvents = response.data;
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Failed to fetch events");
    }
  };

  const createEventAPI = async (payload) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/events/trailId/${trail._id}/creatorId/${userId}`,
        payload
      );
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  const createEvent = async () => {
    try {
      const times = modalTime.split(":");
      const hours = parseInt(times[0]);
      const minutes = parseInt(times[1]);
      const currentDate = new Date(selectedDate);

      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      const formattedDate = currentDate.toISOString();

      const payload = {
        title: modalTitle,
        description: modalDescription,
        date: formattedDate,
        creatorId: userId,
      };

      const response = await createEventAPI(payload);
      const createdEvent = response.data;
      setEvents({ ...events, [selectedDate]: createdEvent });
      const eventId = createEvent._id;
      dispatch(updateEvents({ eventId, isAddingJoining: true }));
      message.success("Event created successfully.");
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("Failed to create event");
    } finally {
      setModalVisible(false);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      console.log("Deleting event with ID:", eventId);

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      await axios.delete(`${BASE_URL}/events/${eventId}`, config);

      const updatedEvents = { ...events };
      delete updatedEvents[selectedDate];
      setEvents(updatedEvents);

      setSelectedDate(null);
      setModalVisible(false);

      message.success("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error);
      message.error(error.response?.data?.error || "Failed to delete event");
    }
  };

  const onPanelChange = (value, mode) => {
    console.log("On panel change");
    console.log(mode);
    setMode(mode);
  };

  const handleDateClick = (value) => {
    console.log("handle click", value);
    const date = value.format("YYYY-MM-DD");
    setSelectedDate(date);
    const event = events[date] || { title: "", description: "", time: null };
    setModalTitle(event.title);
    setModalDescription(event.description);
    setModalTime(event.time);
    setModalVisible(true);
  };

  const handleCancel = () => {
    console.log("Events:", events);
    if (events[selectedDate]) {
      const eventId = events[selectedDate]._id;
      console.log("Event ID:", eventId);
      if (!eventId) {
        console.error("Event ID not found.");
      }
      deleteEvent(eventId);
    } else {
      console.error("Event not found for the selected date.");
    }
    setSelectedDate(null);
    setModalVisible(false);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  return (
    <div>
      <Calendar
        fullscreen={false}
        mode={mode}
        onPanelChange={onPanelChange}
        onSelect={handleDateClick}
        disabledDate={disabledDate}
      />
      <Modal
        title="Event Details"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          selectedDate && events[selectedDate] ? (
            <Button
              key="delete"
              className="basic-btn green"
              onClick={deleteEvent}
            >
              Delete Event
            </Button>
          ) : null,
          <Button key="save" type="primary" onClick={createEvent}>
            {events[selectedDate] ? "Update Event" : "Create Event"}
          </Button>,
        ]}
      >
        <div className="info-of-creating-event">
          <div className="name-of-event-creating">
            <p>TITLE OF EVENT</p>
            <InputField
              value={modalTitle || ""}
              onChange={(e) => setModalTitle(e.target.value)}
            />
            <p>DESCRIPTION</p>
            <InputField
              value={modalDescription || ""}
              onChange={(e) => setModalDescription(e.target.value)}
            />
            <p>SET TIME</p>
            <InputField
              type="time"
              value={modalTime || ""}
              onChange={(e) => setModalTime(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <IncomingEventsPage
        trail={trail}
        events={events}
        deleteEvent={deleteEvent}
      />
    </div>
  );
};

export default EventCalendarComponent;
