import React from 'react';
import Subtitle from '../../Shared/Subtitle/SubTitle';
import './topRatedTrailCard.scss';
import Button from '../../Shared/Button/Button';
import { useNavigate } from 'react-router';

const TopRatedTrailCard = ({trail}) => {
    const navigate = useNavigate();
    
    const handleSingleTrail = (name) => {
        const encodedName = encodeURIComponent(name);
        const formattedTrailName = encodedName.replace(/%20/g, '-');
        navigate(`/trails/trail/${formattedTrailName}`);
    }
  return (
    <div className='top-rated-trail-card' style={{backgroundImage: `url(${trail?.photos[0]})`}}>
        <div className='trail-card-content'>
            <div className='trail-card-top'>
                <h4 className='trail-name'>{trail.name}</h4>
                <Subtitle 
                    text={trail.location}
                    beforeLine={true}
                />
                <p className='trail-desc'>{trail.description}</p>
            </div>
            <div className='learn-more-content'>
                <Button
                    type="button"
                    className="basic-btn"
                    onClick={() => handleSingleTrail(trail.name)}
                >
                    Learn more
                </Button>
            </div>
        </div>
    </div>
  )
}

export default TopRatedTrailCard;
