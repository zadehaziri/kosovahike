import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchSinglePastTrail } from './../../redux/pastTrails/trailsTrackingSlice';
import './PastTrailItem.scss';
import { useSelector, useDispatch } from 'react-redux';
import { formatDate } from './../../helpers/helpers';
import Slider from 'react-slick';

function PastTrailItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.trailsTracking.loading);
  const userId = useSelector((state) => state.loggedUser.user._id);

  const pastTrails = useSelector((state) => state.trailsTracking.pastTrails);
  console.log(pastTrails);

  const trail = useSelector((state) => state.trailsTracking.selectedTrail);

  useEffect(() => {
    dispatch(fetchSinglePastTrail({ userId, trailId: id }));
  }, [dispatch, id, userId]);

  const settings = {
    customPaging: function (i) {
      return (
        <ul>
          {trail?.images && trail.images[i]?.name ? (
            <img
              style={{ width: '100%', height: '28px', objectFit: 'cover' }}
              src={`http://localhost:5000/pastTrailimages/${trail?.images[i]?.name}`}
              alt='Trail'
            />
          ) : (
            <p>Loading images ...⏳</p>
          )}
        </ul>
      );
    },
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    width: '400px',
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='pastTrail-item'>
      {trail && (
        <>
          <div className='row'>
            <h6>{trail.name}</h6>
            <h3>
              <span>{trail.emoji || ''}</span> {trail.name}
            </h3>
          </div>

          <div className='row'>
            <h6>You went to {trail.name} on</h6>
            <p>{formatDate(trail?.date)}</p>
          </div>

          {trail.notes && (
            <div className='row'>
              <h6>Your notes</h6>
              <p>{trail.notes}</p>
            </div>
          )}

          {trail.images.length > 0 && (
            <>
              <h6>Memories</h6>

              <div className='row'>
                <div className='pastTrail-images'>
                  {trail?.images?.length === 1 ? (
                    <img
                      className='single-image'
                      style={{
                        objectFit: 'cover',
                        width: '440px',
                        maxWidth: '100%',
                        height: '247px',
                        borderRadius: '10px',
                      }}
                      key={trail?.image?._id}
                      src={`http://localhost:5000/pastTrailimages/${trail?.images[0]?.name}`}
                      alt='Trail Memories'
                    />
                  ) : (
                    <Slider {...settings}>
                      {trail?.images?.map((image) => (
                        <img
                          style={{ objectFit: 'cover' }}
                          key={image._id}
                          src={`http://localhost:5000/pastTrailimages/${image.name}`}
                          alt='Trail Memories'
                        />
                      ))}
                    </Slider>
                  )}
                </div>
              </div>
            </>
          )}

          <div className='row'>
            <h6>Learn more</h6>
            <a
              href={`https://en.wikipedia.org/wiki/${trail.name}`}
              target='_blank'
              rel='noreferrer'
            >
              Check out {trail.name} on Wikipedia &rarr;
            </a>
          </div>
          <div>
            <button
              className='back btn'
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              &larr; Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PastTrailItem;
