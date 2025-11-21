import React from 'react';
import './favoritehikes.scss'; // Import SCSS file for styling

const FavoriteHikes = () => {
  const favoriteHikes = [
    { id: 1, name: 'Hike 1', location: 'Location 1', difficulty: 'Moderate', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam condimentum mi sed magna efficitur dignissim.', rating: 4, image: 'https://images.pexels.com/photos/1557688/pexels-photo-1557688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 2, name: 'Hike 2', location: 'Location 2', difficulty: 'Easy', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et nunc et mauris aliquam tincidunt.', rating: 3.5, image: 'https://images.pexels.com/photos/1557688/pexels-photo-1557688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { id: 3, name: 'Hike 3', location: 'Location 3', difficulty: 'Difficult', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras commodo interdum enim, a ullamcorper justo aliquet sit amet.', rating: 5, image: 'https://images.pexels.com/photos/1557688/pexels-photo-1557688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    // Add more hikes as needed
  ];

  // Function to generate star icons based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i}>⭐</span>);
    }
    return stars;
  };

  return (
    <div className="favorite-hikes">
      <h1 className="header">Favorite Hikes</h1>
      <div className="hike-list">
        {favoriteHikes.map(hike => (
          <div className="hike-item" key={hike.id}>
            <img src={hike.image} alt={hike.name} className="hike-image" />
            <div className="hike-details">
              <h2>{hike.name}</h2>
              <p><strong>Location:</strong> {hike.location}</p>
              <p><strong>Difficulty:</strong> {hike.difficulty}</p>
              <p className="description"><strong>Description:</strong> {hike.description}</p>
              <p className="rating"><strong>Rating:</strong> {renderStars(hike.rating)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteHikes;
