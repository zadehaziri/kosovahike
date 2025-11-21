import React, { useState, useEffect } from 'react';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { App } from 'antd';
import axios from 'axios';
import { config } from '../../../config';
import Button from '../../Shared/Button/Button';
import { isUserAlreadyJoined } from '../../../pages/Trails/Event/utils/isUserAlreadyJoined';
import './eventCard.scss';

const EventCard = ({ img, duration, size, difficulty, details, link, eventId, attendees, onJoinSuccess }) => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const loggedUser = useSelector((state) => state.loggedUser)?.user;
  const userId = loggedUser?._id;
  const token = useSelector((state) => state.loggedUser)?.token;
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // Check if user is already joined - using same logic as backend
  useEffect(() => {
    if (userId && attendees && Array.isArray(attendees)) {
      // Backend checks: attendee._id?.toString() === userIdObject.toString()
      const currentUserId = userId.toString();
      const userJoined = attendees.some(attendee => {
        // Handle different formats: ObjectId, String, or nested _id
        let attendeeId = null;

        if (attendee._id) {
          // If _id exists, convert to string
          attendeeId = attendee._id.toString();
        } else if (typeof attendee === 'string') {
          // If attendee is directly a string (ID)
          attendeeId = attendee;
        } else if (attendee && typeof attendee === 'object') {
          // Try to find any ID field
          attendeeId = attendee.id?.toString() || attendee.toString();
        }

        return attendeeId === currentUserId;
      });

      console.log('Checking if user joined:', {
        userId: currentUserId,
        attendees,
        userJoined
      });

      setIsJoined(userJoined);
    } else {
      setIsJoined(false);
    }
  }, [userId, attendees]);

  const handleJoinEvent = async (e) => {
    e.stopPropagation(); // Prevent card click

    if (!token || !userId) {
      message.warning('Please login to join events');
      navigate('/login');
      return;
    }

    if (!eventId) {
      message.error('Event ID is missing');
      return;
    }

    // Check if already joined before making API call
    if (isJoined) {
      message.info('You are already attending this event');
      return;
    }

    try {
      setIsJoining(true);

      console.log('Joining event:', {
        eventId,
        userId,
        userIdType: typeof userId,
        baseUrl: config.BASE_URL,
        attendees,
        userFromStore: loggedUser
      });

      const response = await axios.post(`${config.BASE_URL}/events/join/${eventId}/${userId}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Join response:', response);

      if (response.status === 200) {
        setIsJoined(true);
        message.success('Successfully joined the event!');
        // Update size count
        if (onJoinSuccess) {
          onJoinSuccess();
        }
      }
    } catch (error) {
      console.error('Error joining event:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Unknown error';

        console.log('Error status:', status, 'Error message:', errorMessage);

        if (status === 403) {
          // User is already joined - update state and show info message
          setIsJoined(true);
          message.info(errorMessage || 'You are already attending this event');
          // Refresh events to get updated data
          setTimeout(() => {
            if (onJoinSuccess) {
              onJoinSuccess();
            }
          }, 500);
        } else if (status === 404) {
          // Check if it's user not found or event not found
          if (errorMessage.toLowerCase().includes('user not found')) {
            message.error('User not found. Please logout and login again to refresh your session.');
            // Optionally redirect to login after a delay
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else {
            message.error('Event not found');
          }
        } else if (status === 401) {
          message.warning('Please login to join events');
          navigate('/login');
        } else if (status === 500) {
          message.error('Server error. Please try again later.');
          console.error('Server error details:', error.response.data);
        } else {
          message.error(errorMessage || 'Failed to join event. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        message.error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        console.error('Unexpected error:', error);
        message.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleCardClick = () => {
    if (link) {
      link();
    }
  };

  return (
    <div className='single-event' onClick={handleCardClick}>
      <div className='event-img-container'>
        <img
          className='event-img'
          src={img}
          alt="event"
        />
        <div className='event--date'>
          {details?.date}
        </div>
      </div>
      <div className='event-info-box'>
        <div className='event-info'>
          <span className='info-count'>{duration.count}</span>
          <span className='info-desc'>{duration?.desc}</span>
        </div>
        <div className='event-info'>
          <span className='info-count'>{size.count}</span>
          <span className='info-desc'>{size.desc}</span>
        </div>
        <div className='event-info'>
          <span className='info-count'>{difficulty.count}</span>
          <span className='info-desc'>{difficulty.desc}</span>
        </div>
      </div>
      <div className='event-details'>
        <h4 className='event--title'>
          {details?.name}
        </h4>
        <p className='event--desc'>
          {details?.desc}
        </p>
        <div className='event--location'>
          <FontAwesomeIcon icon={faMapLocationDot} />
          <span className='event-location-name'>{details?.location}</span>
        </div>
        <div className='event-join-button'>
          <Button
            className={`basic-btn ${isJoined ? 'joined' : 'green'}`}
            type="button"
            onClick={handleJoinEvent}
            disabled={isJoining || isJoined}
            style={{
              cursor: isJoined ? 'not-allowed' : 'pointer',
              opacity: isJoined ? 0.7 : 1
            }}
          >
            {isJoining ? 'Joining...' : isJoined ? 'Joined' : 'Join Event'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EventCard