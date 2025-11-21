
import React from "react";
import TrailCard from "./TrailCard";
import "./FavoriteTrailsContainer.scss";
import { useSelector } from "react-redux";


// import blurredBackground from "../../assets/images/dark.png";

const FavoriteTrailsContainer = ({ favoriteTrails, userId }) => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const { firstName } = loggedUser.user;
  return (
    <div
      className='blurred-background'
      // style={{ backgroundImage: `url(${blurredBackground})` }}
    >

      <div className="favorite-container-trails-one">
        <div className="title-one-favorite">
          <h1>Rediscovering your favorite trails, {firstName}!</h1>

        </div>
        <div className='favorite-trails-container-users'>
          {favoriteTrails
            .filter((favoriteTrail) => favoriteTrail)
            .map((favoriteTrail, index) => (
              <div className='favorite-trail__card' key={index}>
                <TrailCard
                  trail={favoriteTrail}
                  isDisableFavButton={true}
                  userId={userId}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteTrailsContainer;
