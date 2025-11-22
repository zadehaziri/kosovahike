import React, { useState, useEffect, useMemo, useCallback } from "react";
import { App } from "antd";
import { useSelector } from "react-redux";
import { MdOutlineSearch } from "react-icons/md";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaMountain } from "react-icons/fa";
import "./styles/events.scss";
import EventButtons from "../components/EventButtons.jsx";
import eventService from "../services/eventService.js";
import { Modal, Button } from "antd";
import InputField from "../../../../components/Shared/InputField/InputField.jsx";
import { parseDateInHoursAndMinutes } from "../utils/dateFormatters.jsx";
import { isUserAlreadyJoined } from "../utils/isUserAlreadyJoined";
import ChatHelper from "../../../../components/ChatHelper/chathelper";

const EventsPage = () => {
  const { message } = App.useApp();
  const userId = useSelector((state) => state.loggedUser)?.user?._id;
  const token = useSelector((state) => state.loggedUser)?.token;
  const userRole = useSelector((state) => state.loggedUser)?.user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, upcoming, past
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;
  const [form, setForm] = useState({
    date: "",
    time: "",
    title: "",
    description: "",
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.fetchEvent();

      if (response !== null && response.status === 200) {
        const sortedEvents = response.data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again later.");
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    let filtered = events;

    // Filter by type (upcoming/past)
    const now = new Date();
    if (filterType === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= now);
    } else if (filterType === "past") {
      filtered = filtered.filter((event) => new Date(event.date) < now);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.trail?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, filterType, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to join event";
      if (error.response?.status === 403) {
        message.info(errorMsg);
      } else {
        message.error(errorMsg);
      }
      fetchEvents(); // Refresh to update join status
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
      message.error(error.response?.data?.error || "Failed to leave event");
    }
  };

  const onChangeHandler = ({ value, name }) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

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
      message.error("Failed to fetch event details");
    }
  };

  const updateEvent = async () => {
    try {
      if (!form.title || !form.description || !form.date || !form.time) {
        message.warning("Please fill in all fields");
        return;
      }

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
        setCurrentEvent(null);
        message.success("Event updated successfully");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      message.error(error.response?.data?.error || "Failed to update event");
    }
  };

  const onClickUpdate = (eventId) => {
    setModalVisible(true);
    getEventById(eventId);
  };

  const handleCancel = () => {
    setCurrentEvent(null);
    setModalVisible(false);
    setForm({ date: "", time: "", title: "", description: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="error-container">
          <p>{error}</p>
          <Button onClick={fetchEvents} type="primary" style={{ marginTop: "1rem" }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="events-header-content">
          <h1 className="events-page-title">
            Upcoming <span>Events</span>
          </h1>
          <p className="events-page-subtitle">
            Join fellow hikers on amazing adventures and explore the beauty of nature together
          </p>
        </div>
      </div>

      <div className="events-filters">
        <div className="events-search">
          <MdOutlineSearch className="search-icon" />
          <input
            type="text"
            className="events-search-input"
            placeholder="Search events by title, location, or trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="events-filter-buttons">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All Events
          </button>
          <button
            className={`filter-btn ${filterType === "upcoming" ? "active" : ""}`}
            onClick={() => setFilterType("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filterType === "past" ? "active" : ""}`}
            onClick={() => setFilterType("past")}
          >
            Past
          </button>
        </div>
      </div>

      <div className="events-main">
        {filteredEvents.length === 0 ? (
          <div className="empty-events">
            <FaCalendarAlt className="empty-icon" />
            <h2>No events found</h2>
            <p>
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "There are no events available at the moment. Check back later!"}
            </p>
          </div>
        ) : (
          <>
            <div className="events-grid">
              {currentEvents.map((event, index) => (
                <div key={event._id || index} className="event-card-modern">
                  <div className="event-card-header">
                    <div className="event-date-badge">
                      <FaCalendarAlt />
                      <div>
                        <span className="event-date">{formatDate(event.date)}</span>
                        <span className="event-time">{formatTime(event.date)}</span>
                      </div>
                    </div>
                    {isEventUpcoming(event.date) && (
                      <span className="event-status-badge upcoming">Upcoming</span>
                    )}
                    {!isEventUpcoming(event.date) && (
                      <span className="event-status-badge past">Past</span>
                    )}
                  </div>

                  <div className="event-image-container">
                    {event.trail?.photos && event.trail.photos.length > 0 ? (
                      <img
                        src={event.trail.photos[0]}
                        alt={event.title || "Event"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x220?text=Event+Image";
                          e.target.style.display = "block";
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(20, 57, 75, 0.5) 0%, rgba(11, 29, 38, 0.7) 100%)'
                      }}>
                        <FaMountain style={{ fontSize: '3rem', color: 'rgba(67, 129, 92, 0.3)' }} />
                      </div>
                    )}
                  </div>

                  <div className="event-card-content">
                    <h3 className="event-card-title">{event.title || "Untitled Event"}</h3>
                    <p className="event-card-description">
                      {event.description || "No description available"}
                    </p>

                    <div className="event-card-info">
                      <div className="event-info-item">
                        <FaMapMarkerAlt />
                        <span>{event.location || event.trail?.location || "Location TBD"}</span>
                      </div>
                      {event.trail && (
                        <div className="event-info-item">
                          <FaMountain />
                          <span>{event.trail.name}</span>
                        </div>
                      )}
                      <div className="event-info-item">
                        <FaUsers />
                        <span>
                          {event.attendees?.length || 0} / {event.maxAttendees || "∞"} attendees
                        </span>
                      </div>
                      {event.duration && (
                        <div className="event-info-item">
                          <FaClock />
                          <span>{event.duration} hours</span>
                        </div>
                      )}
                    </div>

                    {event.trail && (
                      <div className="event-trail-details">
                        <span className="trail-difficulty">{event.trail.difficulty}</span>
                        {event.trail.length && <span className="trail-length">{event.trail.length}</span>}
                      </div>
                    )}
                  </div>

                  <div className="event-card-actions">
                    <EventButtons
                      join={() => joinEvent(event._id)}
                      leave={() => leaveEvent(event._id)}
                      update={() => onClickUpdate(event._id)}
                      handleDeleteEvent={() => handleDeleteEvent(event._id)}
                      isUserJoined={isUserAlreadyJoined(event.attendees || [], userId)}
                      isCreator={event.creator && event.creator._id === userId}
                      isAdmin={isAdmin}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="events-pagination">
                <button
                  className="pagination-btn prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="pagination-btn next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        title="Update Event"
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
      <ChatHelper />
    </div>
  );
};

export default EventsPage;
