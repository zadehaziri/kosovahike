import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPastTrails } from '../../redux/pastTrails/trailsTrackingSlice';
import PastTrail from './PastTrail.jsx';

import './PastTrails.scss';

const PastTrails = () => {
  const pastTrails = useSelector((state) => state.trailsTracking.pastTrails);
  const loading = useSelector((state) => state.trailsTracking.loading);
  const error = useSelector((state) => state.trailsTracking.error);
  const userId = useSelector((state) => state.loggedUser.user._id);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPastTrails(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!pastTrails.length)
    return (
      <p className='no-trails'>
        👋 Add your first trail by clicking on a location trail on the map
      </p>
    );

  return (
    <ul className='past-trails'>
      {React.Children.toArray(
        pastTrails.map((trail) => <PastTrail trail={trail} />)
      )}
    </ul>
  );
};

export default PastTrails;
