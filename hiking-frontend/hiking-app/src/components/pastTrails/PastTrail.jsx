import { Link } from 'react-router-dom';
import { formatDate } from './../../helpers/helpers';
import {
  fetchPastTrails,
  removePastTrail,
} from '../../redux/pastTrails/trailsTrackingSlice';

import { useDispatch, useSelector } from 'react-redux';

import './PastTrail.scss';

function PastTrail({ trail }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.loggedUser.user._id);
  const { name, date, _id: id, position, emoji } = trail;

  function handleClick(e) {
    e.preventDefault();
    dispatch(removePastTrail({ userId, trailId: id }))
      .then(() => {
        dispatch(fetchPastTrails(userId));
      })
      .catch((error) => {
        console.error('Error removing trail:', error);
      });
  }

  return (
    <li>
      <Link
        className={`${id === trail.id ? 'pastTrailActive' : 'pastTrail'}`}
        to={`${id}?lat=${position?.lat}&lng=${position?.lng}`}
      >
        <span className='emoji'>{emoji}</span>
        <h3 className='name'>{name}</h3>
        <time className='date'>{formatDate(date)}</time>
        <button className='deleteBtn' onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default PastTrail;
