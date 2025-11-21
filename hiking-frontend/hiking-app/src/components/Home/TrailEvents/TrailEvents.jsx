import React, { useState, useEffect } from 'react'
import SubTitle from '../../Shared/Subtitle/SubTitle';
import Button from '../../Shared/Button/Button';
import EventCard from './EventCard';
import './trailEvents.scss';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { config } from '../../../config';

const TrailEvents = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [transition, setTransition] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.BASE_URL}/events`);
                const allEvents = response.data;
                allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
                const currentDate = new Date();
                const nearestEvents = allEvents.filter(event => new Date(event.date) >= currentDate).slice(0, 4);
    
                if (nearestEvents.length === 0 && allEvents.length > 0) {
                    nearestEvents.push(allEvents[0]);
                }
    
                if (nearestEvents.length > 0) {
                    const trailRequests = nearestEvents.map(event => 
                        axios.get(`${config.BASE_URL}/trails/${event.trail}`).catch(() => null)
                    );
    
                    const trailResponses = await Promise.all(trailRequests);
                    const trailsData = trailResponses.map(response => response?.data || null);
                    const eventsWithTrailData = nearestEvents.map((event, index) => ({
                        ...event,
                        trailData: trailsData[index]
                    }));
    
                    setEvents(eventsWithTrailData);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchEvents();
    }, []);
    

    const handleBulletClick = (index) => {
        if (index === currentSlide || index >= events.length) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setTransition(false); 
        }, 300); 
    };

    const handlePrev = () => {
        if (events.length <= 2) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(prevSlide => {
                const newSlide = prevSlide - 2;
                return newSlide < 0 ? Math.max(0, events.length - (events.length % 2 === 0 ? 2 : 1)) : newSlide;
            });
            setTransition(false);
        }, 300);
    };

    const handleNext = () => {
        if (events.length <= 2) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(prevSlide => {
                const maxSlide = Math.max(0, events.length - 2);
                const newSlide = prevSlide + 2;
                return newSlide > maxSlide ? 0 : newSlide;
            });
            setTransition(false);
        }, 300);
    };

    const handleJoinUs = () => {
        navigate("/events");
    };

    const formatDuration = (minutes) => {
        const hours = Math.round(minutes / 60);
        return `${hours}`;
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    

  if (loading) {
    return (
      <div className='trail-event-container'>
        <div className='main-container'>
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className='trail-event-container'>
        <div className='main-container'>
          <div className='no-events'>
            <h2 className='events-title'>Upcoming events</h2>
            <p className='events-desc'>No upcoming events at the moment. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='trail-event-container'>
        <div className='main-container'>
            <div className='trail-event-content'>
                <div className='left-te-content'>
                    {events.length > 2 && (
                        <div className='slider-arrows'>
                            <button className='arrow-btn prev' onClick={handlePrev} aria-label="Previous events">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button className='arrow-btn next' onClick={handleNext} aria-label="Next events">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className={`all-events ${transition ? 'slider-fade-out' : ''}`}>
                        {events?.slice(currentSlide, currentSlide + 2)?.map((event) => (
                            <EventCard 
                                key={event._id}
                                eventId={event._id}
                                attendees={event.attendees || []}
                                img={event.trailData?.photos?.[0] || 'https://via.placeholder.com/400x300?text=Trail+Image'}
                                duration={{
                                    count: formatDuration(event.duration || 0),
                                    desc: "Hours"
                                }}
                                size={{
                                    count: event.attendees?.length || 0,
                                    desc: "Group Size"
                                }}
                                difficulty={{
                                    count: event.trailData?.difficulty || 'N/A',
                                    desc: "Difficulty"
                                }}
                                details={{
                                    name: event.title || 'Untitled Event',
                                    desc: event.description || 'No description available.',
                                    location: event.trailData?.location || 'Location TBD',
                                    date: formatDate(event.date)
                                }}
                                link={handleJoinUs}
                                onJoinSuccess={() => {
                                    // Refresh events after join
                                    const fetchEvents = async () => {
                                        try {
                                            const response = await axios.get(`${config.BASE_URL}/events`);
                                            const allEvents = response.data;
                                            allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                                    
                                            const currentDate = new Date();
                                            const nearestEvents = allEvents.filter(event => new Date(event.date) >= currentDate).slice(0, 4);
                                    
                                            if (nearestEvents.length === 0 && allEvents.length > 0) {
                                                nearestEvents.push(allEvents[0]);
                                            }
                                    
                                            if (nearestEvents.length > 0) {
                                                const trailRequests = nearestEvents.map(event => 
                                                    axios.get(`${config.BASE_URL}/trails/${event.trail}`).catch(() => null)
                                                );
                                    
                                                const trailResponses = await Promise.all(trailRequests);
                                                const trailsData = trailResponses.map(response => response?.data || null);
                                                const eventsWithTrailData = nearestEvents.map((event, index) => ({
                                                    ...event,
                                                    trailData: trailsData[index]
                                                }));
                                    
                                                setEvents(eventsWithTrailData);
                                            }
                                        } catch (error) {
                                            console.error('Error refreshing events:', error);
                                        }
                                    };
                                    fetchEvents();
                                }}
                            />
                        ))}
                    </div>
                    {events.length > 2 && (
                        <div className='events-pagination'>
                            <button 
                                className='pagination-btn prev' 
                                onClick={handlePrev}
                                disabled={currentSlide === 0}
                                aria-label="Previous page"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <div className='pagination-dots'>
                                {Array.from({ length: Math.ceil(events.length / 2) }).map((_, index) => {
                                    const pageStart = index * 2;
                                    const isActive = currentSlide >= pageStart && currentSlide < pageStart + 2;
                                    return (
                                        <button
                                            key={index}
                                            className={`pagination-dot ${isActive ? 'active' : ''}`}
                                            onClick={() => handleBulletClick(pageStart)}
                                            aria-label={`Go to page ${index + 1}`}
                                        />
                                    );
                                })}
                            </div>
                            <button 
                                className='pagination-btn next' 
                                onClick={handleNext}
                                disabled={currentSlide >= Math.max(0, events.length - 2)}
                                aria-label="Next page"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <div className='right-te-content'>
                    <h2 className='events-title'>Upcoming events</h2>
                    <SubTitle
                        text="Explore the unexplored world"
                        afterLine={true}
                    />
                    <p className='events-desc'>
                        Join us for upcoming trail events to explore diverse landscapes, conquer challenging terrains, and create lasting memories in the heart of nature with like-minded adventurers. 
                    </p>
                    <p className='events-cta-text'>
                        Discover all our exciting hiking adventures and find the perfect trail event for you. Whether you're a beginner or an experienced hiker, we have something for everyone. Browse through our complete list of events and join the community of passionate outdoor enthusiasts!
                    </p>
                    <Button
                        className="basic-btn green"
                        type="button"
                        onClick={() => handleJoinUs()}
                    >
                        Join us now
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TrailEvents;