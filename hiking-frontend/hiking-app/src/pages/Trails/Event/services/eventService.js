import axios from "axios";
import { config } from "../../../../config";

const BASE_URL = config.BASE_URL;

class EventService {
  fetchEvent() {
    return axios.get(BASE_URL + "/events");
  }

  getEvent(id) {
    return axios.get(`${BASE_URL}/events/${id}`);
  }

  fetchEventsByTrailId(trailId) {
    return axios.get(`${BASE_URL}/trails/${trailId}/events`);
  }

  fetchIncommingEventsByTrailId(trailId) {
    return axios.get(`${BASE_URL}/trails/${trailId}/events?mode=incoming`);
  }

  fetchPastEventsByTrailId(trailId) {
    return axios.get(`${BASE_URL}/trails/${trailId}/events?mode=past`);
  }

  deleteEvent({ eventId, token }) {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
    return axios.delete(`${BASE_URL}/events/${eventId}`, config);
  }

  joinEvent({ eventId, userId }) {
    return axios.post(`${BASE_URL}/events/join/${eventId}/${userId}`);
  }

  leaveEvent({ eventId, userId }) {
    return axios.delete(`${BASE_URL}/events/leave/${eventId}/${userId}`);
  }

  updateEvent({ eventId, userId, payload }) {
    return axios.post(
      `${BASE_URL}/events/${eventId}/creatorId/${userId}`,
      payload
    );
  }
}

const eventService = new EventService();
export default eventService;
