import React, { useEffect, useState, useCallback } from 'react';
import './HikingBuddy.scss';
import axios from 'axios';
import { useSelector } from 'react-redux';
import authService from '../../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/Shared/InputField/InputField';
import SelectField from '../../components/Shared/SelectField/SelectField';
import Button from '../../components/Shared/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faSearch, faTimes, faSpinner, faUserFriends, faUsers, faRoute } from '@fortawesome/free-solid-svg-icons';
import { message } from 'antd';

import ChatHelper from "../../components/ChatHelper/chathelper";
const HikingBuddy = () => {
  const [fullName, setFullName] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [hikeBuddies, setHikeBuddies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.loggedUser);

  const fetchHikeBuddies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/hikeBuddies');
      let buddies = response.data;

      if (loggedUser.user) {
        buddies = buddies.filter((buddy) => buddy._id !== loggedUser.user._id);
      }

      setHikeBuddies(buddies);
      setHasSearched(false);
    } catch (error) {
      console.error('Error fetching hikeBuddies:', error);
      message.error('Failed to load hiking buddies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loggedUser]);

  useEffect(() => {
    fetchHikeBuddies();
  }, [fetchHikeBuddies]);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const filters = {
        fullName: fullName.trim(),
        location: locationFilter.trim(),
        gender: genderFilter,
        skillLevel: skillLevel,
      };
      
      const response = await authService.searchHikeBuddies(filters);
      let filteredHikeBuddies = response.data;

      if (loggedUser.user) {
        filteredHikeBuddies = filteredHikeBuddies.filter(
          (buddy) => buddy._id !== loggedUser.user._id
        );
      }

      setHikeBuddies([...filteredHikeBuddies]);
      setHasSearched(true);
      
      if (filteredHikeBuddies.length === 0) {
        message.info('No hiking buddies found matching your criteria');
      } else {
        message.success(`Found ${filteredHikeBuddies.length} hiking buddy(ies)`);
      }
    } catch (error) {
      console.error('Error searching for hike buddies:', error);
      message.error('Failed to search hiking buddies. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setLocationFilter('');
    setSkillLevel('');
    setGenderFilter('');
    setHasSearched(false);
    fetchHikeBuddies();
    message.info('Filters reset');
  };

  const handleMessage = (buddy) => {
    if (!loggedUser.user) {
      message.warning('Please login to send a message');
      navigate('/login');
      return;
    }
    // For now, navigate to user profile or could open a modal
    // You can enhance this later with a messaging system
    message.info(`Contact ${buddy.firstName} via their social media or phone`);
  };

  const handleInputChange = (fieldName, value) => {
    switch (fieldName) {
      case 'fullName':
        setFullName(value);
        break;
      case 'locationFilter':
        setLocationFilter(value);
        break;
      case 'skillLevel':
        setSkillLevel(value);
        break;
      case 'genderFilter':
        setGenderFilter(value);
        break;
      default:
        break;
    }
  };

  const skillOptions = [
    { value: '', label: 'Select Skill Level' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  return (
    <div className='buddy-container'>
      <div className='main-container'>
        <div className='sections-container'>
          <div className='search-section'>
            <div className='search-header'>
              <h2 className='section-title'>
                <FontAwesomeIcon icon={faUserFriends} className='title-icon' />
                Find a Hiking Buddy
              </h2>
              <p className='section-subtitle'>Connect with fellow hikers and explore trails together</p>
            </div>
            <div className='search-form'>
              <div className='filter-option'>
                <InputField
                  type="text"
                  label="Name"
                  value={fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  classname="text-input"
                  placeholder="Enter name..."
                />
              </div>
              <div className='filter-option'>
                <InputField
                  type="text"
                  label="Location"
                  value={locationFilter}
                  onChange={(e) => handleInputChange('locationFilter', e.target.value)}
                  classname="text-input"
                  placeholder="Enter location..."
                />
              </div>
              <div className='filter-option'>
                <SelectField
                  id="skill-filter"
                  classname="select-field"
                  value={skillLevel}
                  options={skillOptions}
                  onChange={(value) => handleInputChange('skillLevel', value)}
                />
              </div>
              <div className='filter-option'>
                <SelectField
                  id="gender-filter"
                  classname="select-field"
                  value={genderFilter}
                  options={genderOptions}
                  onChange={(value) => handleInputChange('genderFilter', value)}
                />
              </div>
              <div className='search-actions'>
                <Button
                  type="button"
                  className="basic-btn green search-btn"
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className='btn-icon' />
                      Searching...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSearch} className='btn-icon' />
                      Search
                    </>
                  )}
                </Button>
                {(hasSearched || fullName || locationFilter || skillLevel || genderFilter) && (
                  <Button
                    type="button"
                    className="basic-btn reset-btn"
                    onClick={handleReset}
                    disabled={searching}
                  >
                    <FontAwesomeIcon icon={faTimes} className='btn-icon' />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className='featured-section'>
            <div className='featured-header'>
              <h2 className='section-title'>
                {hasSearched ? 'Search Results' : 'Available Hiking Buddies'}
                {hikeBuddies.length > 0 && (
                  <span className='results-count'>({hikeBuddies.length})</span>
                )}
              </h2>
            </div>
            {loading ? (
              <div className='loading-container'>
                <FontAwesomeIcon icon={faSpinner} spin className='loading-spinner' />
                <p>Loading hiking buddies...</p>
              </div>
            ) : hikeBuddies.length === 0 ? (
              <div className='empty-state'>
                <FontAwesomeIcon icon={faUserFriends} className='empty-icon' />
                <h3>No Hiking Buddies Found</h3>
                <p>{hasSearched 
                  ? 'Try adjusting your search criteria' 
                  : 'No hiking buddies available at the moment'}</p>
                {hasSearched && (
                  <Button
                    type="button"
                    className="basic-btn green"
                    onClick={handleReset}
                  >
                    View All Buddies
                  </Button>
                )}
              </div>
            ) : (
              <div className='card-container'>
                {hikeBuddies.map((buddy, index) => (
                  <div key={buddy._id || index} className='card'>
                    <div className='card__image-wrapper'>
                      <img
                        src={buddy.profileImg?.name || buddy.profileImg || 'https://via.placeholder.com/150'}
                        alt={buddy.firstName}
                        className='card__image'
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      {buddy.skillLevel && (
                        <span className={`skill-badge skill-${buddy.skillLevel}`}>
                          {buddy.skillLevel}
                        </span>
                      )}
                    </div>
                    <div className='card__content'>
                      <h3 className='card__name'>{`${buddy.firstName} ${buddy.lastName}`}</h3>
                      {buddy.location && (
                        <p className='card__location'>
                          <FontAwesomeIcon icon={faRoute} /> {buddy.location}
                        </p>
                      )}
                      {buddy?.description && (
                        <p className='card__description'>{buddy.description}</p>
                      )}
                      {buddy?.availability && (
                        <p className='card__available'>
                          Available on {buddy.availability}
                        </p>
                      )}
                      <div className='card__contact'>
                        {(buddy?.socialMedia?.facebook || buddy?.socialMedia?.instagram || buddy?.socialMedia?.twitter) && (
                          <ul className='social-icons'>
                            {buddy?.socialMedia?.facebook && (
                              <li>
                                <Link 
                                  to={`https://www.facebook.com/${buddy.socialMedia.facebook}`} 
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='social-link'
                                >
                                  <FontAwesomeIcon className='icon fb' icon={faFacebookF}/>
                                </Link>
                              </li>
                            )}
                            {buddy?.socialMedia?.instagram && (
                              <li>
                                <Link 
                                  to={`https://www.instagram.com/${buddy.socialMedia.instagram}`} 
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='social-link'
                                >
                                  <FontAwesomeIcon className='icon ig' icon={faInstagram}/>
                                </Link>
                              </li>
                            )}
                            {buddy?.socialMedia?.twitter && (
                              <li>
                                <Link 
                                  to={`https://www.twitter.com/${buddy.socialMedia.twitter}`} 
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='social-link'
                                >
                                  <FontAwesomeIcon className='icon tt' icon={faTwitter}/>
                                </Link>
                              </li>
                            )}
                          </ul>
                        )}
                        <div className='contact-actions'>
                          {buddy?.phoneNumber && (
                            <Link 
                              to={`tel:${buddy.phoneNumber}`} 
                              className='contact-phone'
                              title={`Call ${buddy.firstName}`}
                            >
                              <FontAwesomeIcon icon={faPhone}/>
                            </Link>
                          )}
                          <Button
                            type="button"
                            className="basic-btn green message-btn"
                            onClick={() => handleMessage(buddy)}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* <div className='join-group-section'>
          <h2 className='section-title'>Join an Existing Group</h2>
        </div> */}
        <div className='statistics-container'>
          <div className='statistics-header'>
            <h2 className='section-title'>
              <FontAwesomeIcon icon={faUsers} className='title-icon' />
              Our Statistics
            </h2>
          </div>
          <div className='statistics-list'>
            <div className='statistic-item'>
              <div className='statistic-box'>
                <FontAwesomeIcon icon={faUserFriends} className='statistic-icon' />
                <div className='statistic-label'>HikeBuddies Found</div>
                <div className='statistic-value'>500+</div>
              </div>
            </div>
            <div className='statistic-item'>
              <div className='statistic-box'>
                <FontAwesomeIcon icon={faUsers} className='statistic-icon' />
                <div className='statistic-label'>Hiking Groups</div>
                <div className='statistic-value'>50+</div>
              </div>
            </div>
            <div className='statistic-item'>
              <div className='statistic-box'>
                <FontAwesomeIcon icon={faRoute} className='statistic-icon' />
                <div className='statistic-label'>Total Hikes</div>
                <div className='statistic-value'>1000+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatHelper/>
    </div>
    
  );
};

export default HikingBuddy;
