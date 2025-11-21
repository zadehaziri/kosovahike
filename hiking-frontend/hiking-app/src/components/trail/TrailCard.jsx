import axios from 'axios';
import './TrailCard.scss';

import addFavoriteImg from './images/FilledHeart.png';
import unFavoriteImg from './images/UnfilledHeart.png';
import { useNavigate } from 'react-router-dom';

const TrailCard = ({
  trail,
  onToggleFavorite,
  isFavorite,
  isDisableFavButton = false,
  userId,
  navigateToSignUp,
}) => {
  const navigate = useNavigate();
  const toggleFavorite = async (event) => {
    if (navigateToSignUp) navigate(`/sign-up`);

    event.stopPropagation();

    try {
      const trailId = trail._id;

      if (isFavorite) {
        await updateFavorite(userId, trailId, 'DELETE');
      } else {
        await updateFavorite(userId, trailId, 'POST');
      }

      onToggleFavorite(trailId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const updateFavorite = async (userId, trailId, method) => {
    try {
      const response = await axios({
        method: method,
        url: `http://localhost:5000/users/${userId}/favorites/${trailId}`,
      });
      if (!response.status === 200) {
        const action = method === 'POST' ? 'add' : 'remove';
        throw new Error(`Failed to ${action} favorite trail`);
      }
    } catch (error) {
      throw new Error(
        `Failed to ${method === 'POST' ? 'add' : 'remove'} favorite trail`
      );
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes}min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}min`;
    }
  };

  const handleSingleTrail = (name) => {
    const encodedName = encodeURIComponent(name);
    const formattedTrailName = encodedName.replace(/%20/g, '-');
    navigate(`/trails/trail/${formattedTrailName}`);
  };

  return (
    <div className='trailCards-container'>
      <div
        className='trail-card-one'
        onClick={() => handleSingleTrail(trail.name)}
      >
        <div className='img-container-trails'>
          <img src={trail.photos} alt='Trail View' />
          {!isDisableFavButton && (
            <div className='button-container'>
              <button onClick={(event) => toggleFavorite(event)}>
                <img
                  src={isFavorite ? addFavoriteImg : unFavoriteImg}
                  alt={isFavorite ? 'Unfavorite' : 'Favorite'}
                />
              </button>
            </div>
          )}
        </div>

        <h2>{trail.name}</h2>
        <p>{trail.location}</p>

        <div className='text-icon'>
          <div className='container-one-data'>
            <h4>{trail.difficulty}</h4>
            <span style={{ margin: '0 5px' }}>·</span>
            <p style={{ margin: '0 5px' }}>{trail.length}</p>
            <span>·</span>
            {trail.duration !== 0 && (
              <p style={{ margin: '0 5px' }}>
                {formatDuration(trail.duration)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailCard;
