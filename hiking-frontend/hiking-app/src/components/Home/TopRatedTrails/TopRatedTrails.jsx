import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './topRatedTrails.scss';
import { config } from '../../../config';
import TopRatedTrailCard from './TopRatedTrailCard';
import Button from '../../Shared/Button/Button';
import { useNavigate } from 'react-router';

const TopRatedTrails = () => {
    const navigate = useNavigate();
    const [topRatedTrails, setTopRatedTrails] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [transition, setTransition] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRatedTrails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.BASE_URL}/trails`);
                const trails = response.data || [];
                
                if (trails.length === 0) {
                    setTopRatedTrails([]);
                    setLoading(false);
                    return;
                }

                // Calculate average rating for each trail
                trails.forEach(trail => {
                    if (trail.reviews && trail.reviews.length > 0) {
                        const totalRating = trail.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
                        const averageRating = totalRating / trail.reviews.length;
                        trail.averageRating = averageRating;
                    } else {
                        trail.averageRating = 0;
                    }
                });

                // Sort trails: trails with reviews first (by rating), then trails without reviews
                const sortedTrails = [...trails].sort((a, b) => {
                    // If both have reviews, sort by rating
                    if (a.reviews?.length > 0 && b.reviews?.length > 0) {
                        return b.averageRating - a.averageRating;
                    }
                    // If only one has reviews, prioritize it
                    if (a.reviews?.length > 0 && (!b.reviews || b.reviews.length === 0)) {
                        return -1;
                    }
                    if (b.reviews?.length > 0 && (!a.reviews || a.reviews.length === 0)) {
                        return 1;
                    }
                    // If neither has reviews, keep original order
                    return 0;
                });

                // Take top 5 trails (or all if less than 5)
                const topFiveTrails = sortedTrails.slice(0, Math.min(sortedTrails.length, 5));
                setTopRatedTrails(topFiveTrails);
            } catch (error) {
                console.error('Error fetching trails:', error);
                setTopRatedTrails([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTopRatedTrails();
    }, []);

    const handlePrev = () => {
        if (topRatedTrails.length <= 2) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(prevSlide => {
                const maxSlide = Math.max(0, topRatedTrails.length - 2);
                return prevSlide === 0 ? maxSlide : prevSlide - 1;
            });
            setTransition(false);
        }, 300); 
    };

    const handleNext = () => {
        if (topRatedTrails.length <= 2) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(prevSlide => {
                const maxSlide = Math.max(0, topRatedTrails.length - 2);
                return prevSlide >= maxSlide ? 0 : prevSlide + 1;
            });
            setTransition(false);
        }, 300); 
    };

    const handleBulletClick = (index) => {
        if (index === currentSlide || index >= topRatedTrails.length - 1) return;
        setTransition(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setTransition(false); 
        }, 300); 
    };

    const handleAllTrailsClick = () => {
        navigate('/all-trails');
    };

    if (loading) {
        return (
            <div className='top-rated-trails'>
                <div className='main-container'>
                    <div className='loading-container'>
                        <div className='loading-spinner'></div>
                        <p>Loading trails...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (topRatedTrails.length === 0) {
        return (
            <div className='top-rated-trails'>
                <div className='main-container'>
                    <div className='no-trails'>
                        <h2 className='top-rated-title'>Highest Rated Trails</h2>
                        <p className='top-rated-desc'>No trails available at the moment. Check back soon!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='top-rated-trails'>
            <div className='main-container'>
                <div className='top-rated-content'>
                    <div className='left-top-rated'>
                        <div className={`all-top-rated-trails ${transition ? 'slider-fade-out' : ''}`}>
                            {topRatedTrails.slice(currentSlide, currentSlide + 2).map((trail) => (
                                <TopRatedTrailCard
                                    key={trail._id}
                                    trail={trail}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='right-top-rated'>
                        <div className='top-rated-description'>
                            <h2 className='top-rated-title'>Highest Rated Trails</h2>
                            <p className='top-rated-desc'>Embark on unforgettable adventures amidst nature's wonders, guided by our meticulously curated selection of the finest hiking destinations.</p>
                            <div className='top-rated-button'>
                                <Button
                                    type="button"
                                    className="basic-btn green"
                                    onClick={handleAllTrailsClick}
                                >
                                    All trails
                                </Button>
                            </div>
                        </div>
                        {topRatedTrails.length > 2 && (
                            <div className='slider-trail'>
                                <button className='arrow-slide prev' onClick={handlePrev} aria-label="Previous trails">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <div className='slider-controller'>
                                    {Array.from({ length: Math.max(1, topRatedTrails.length - 1) }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`slider-bullet ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => handleBulletClick(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        ></div>
                                    ))}
                                </div>
                                <button className='arrow-slide next' onClick={handleNext} aria-label="Next trails">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopRatedTrails;
