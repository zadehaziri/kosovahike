import React, { useEffect, useState, useCallback } from 'react';
import './UserProfile.scss';
import { useSelector, useDispatch } from 'react-redux';
import NavProfile from '../../components/Profile/NavProfile';
import ProfileSection from '../../components/Profile/ProfileSection';
import { fetchPastTrails } from '../../redux/pastTrails/trailsTrackingSlice';
import ListComponent from '../../components/Profile/ListComponent';
import axios from 'axios';
import { fetchBlogsByUser } from '../../redux/blogs/blogsSlice';

const UserProfile = () => {
  const loggedUser = useSelector((state) => state.loggedUser.user);
  const [activeSection, setActiveSection] = useState('Profile');
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [fieldsToFill, setFieldsToFill] = useState([]);
  const [myTrails, setMyTrails] = useState([]);
  const dispatch = useDispatch();
  const [favoritedTrails, setFavoritedTrails] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const { blogs } = useSelector((state) => state.blogs.blogs);

  const calculateProfileCompletion = useCallback(() => {
    const excludedFields = [
      'trailFavorites',
      'pastTrails',
      'eventsAttending',
      '_id',
      '__v',
      'hikeBuddy',
    ];
    let totalFields =
      Object.keys(loggedUser).length -
      excludedFields.length +
      Object.keys(loggedUser.socialMedia).length;
    let filledFields = 0;
    let fieldsToFill = [];

    Object.keys(loggedUser).forEach((key) => {
      if (
        loggedUser[key] &&
        loggedUser[key] !== '' &&
        !(Array.isArray(loggedUser[key]) && loggedUser[key].length === 0) &&
        !excludedFields.includes(key)
      ) {
        filledFields++;
      } else if (!excludedFields.includes(key)) {
        fieldsToFill.push(key);
      }
    });

    if (loggedUser.socialMedia) {
      Object.keys(loggedUser.socialMedia).forEach((key) => {
        if (loggedUser.socialMedia[key] && !excludedFields.includes(key)) {
          filledFields++;
        } else {
          fieldsToFill.push(`socialMedia.${key}`);
        }
      });
    }

    const completionPercentage = (filledFields / totalFields) * 100;
    setProfileCompletion(completionPercentage.toFixed());
    setFieldsToFill(fieldsToFill);
  }, [loggedUser]);

  useEffect(() => {
    calculateProfileCompletion();
  }, [loggedUser, calculateProfileCompletion]);

  useEffect(() => {
    if (loggedUser && loggedUser._id) {
      dispatch(fetchPastTrails(loggedUser._id))
        .then((data) => {
          setMyTrails(data.payload);
        })
        .catch((error) => {
          console.error('Error fetching past trails:', error);
        });
    }
  }, [dispatch, loggedUser]);

  useEffect(() => {
    if (loggedUser && loggedUser._id) {
      dispatch(fetchBlogsByUser(loggedUser._id));
    }
  }, [dispatch, loggedUser]);

  useEffect(() => {
    if (loggedUser && loggedUser._id) {
      let favTrails = loggedUser?.trailFavorites;
      let fetchedTrails = [];

      Promise.all(
        favTrails.map((trail) =>
          axios
            .get(`http://localhost:5000/trails/${trail}`)
            .then((res) => fetchedTrails.push(res.data))
            .catch((error) =>
              console.log('Error fetching favorite trail', error)
            )
        )
      ).then(() => {
        setFavoritedTrails(fetchedTrails);
      }      );
    }
  }, [loggedUser]);

  useEffect(() => {
    if (loggedUser && loggedUser._id) {
      let joinedEvents = loggedUser?.eventsAttending;
      let fetchedEvents = [];

      Promise.all(
        joinedEvents.map((event) =>
          axios
            .get(`http://localhost:5000/events/${event}`)
            .then((res) => fetchedEvents.push(res.data))
            .catch((error) =>
              console.log('Error fetching joined events', error)
            )
        )
      ).then(() => {
        setJoinedEvents(fetchedEvents);
      });
    }
  }, [loggedUser]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = (section) => {
    switch (section) {
      case 'Profile':
        return (
          <ProfileSection
            user={loggedUser}
            completedPercentage={profileCompletion}
            fieldsToComplete={fieldsToFill}
          />
        );
      case 'My Trails':
        return (
          <ListComponent
            title={'My Trails'}
            list={myTrails}
            link={`/user-stats/past-trails`}
            addItem={`/user-stats/past-trails`}
          />
        );
      case 'My Blogs':
        return (
          <ListComponent
            title={'My Blogs'}
            list={blogs}
            addItem={`/blog-form`}
            link={'/blog-posts'}
          />
        );
      case 'Favorited Trails':
        return (
          <ListComponent
            title={'Favorited Trails'}
            list={favoritedTrails}
            link={`/trails/trail`}
            addItem={`/all-trails`}
          />
        );
      case 'Joined Events':
        return (
          <ListComponent
            title={'Joined Events'}
            list={joinedEvents}
            link={`/incoming-events`}
            addItem={`/incoming-events`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='user-profile-container'>
      <div className='user-profile-content'>
        <div className='left-up-content'>
          <NavProfile section={handleSectionChange} />
        </div>
        <div className='right-up-content'>{renderSection(activeSection)}</div>
      </div>
    </div>
  );
};

export default UserProfile;
