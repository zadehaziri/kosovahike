import { useEffect, useState } from "react";
import TrailsSlider from "../slider/TrailsSlider";
import TrailCard from "./TrailCard";
// import FavoriteTrailCard from "./FavoriteTrailCard";
import axios from "axios";
import "./TrailDiscovery.scss";
import { config } from "../../config";
import FavoriteTrailsContainer from "./FavoriteTrailsContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TrailDiscovery = () => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteTrails, setFavoriteTrails] = useState([]);
  const userId = loggedUser?.user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/trails`);
        setTrails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trails:", error);
        setError("Failed to fetch trails. Please try again later.");
        setLoading(false);
      }
    };

    const fetchFavoriteTrails = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}/users/${userId}/favorites`
        );
        setFavoriteTrails(response.data);
      } catch (error) {
        console.error("Error fetching favorite trails:", error);
      }
    };

    fetchTrails();
    fetchFavoriteTrails();
  }, []);

  const toggleFavorite = async (trailId) => {
    if (loggedUser.token === null) navigate(`/sign-up`);

    try {
      if (isFavorite(trailId)) {
        await removeFavorite(userId, trailId);
        setFavoriteTrails(
          favoriteTrails.filter((trail) => trail._id !== trailId)
        );
      } else {
        await addFavorite(userId, trailId);
        setFavoriteTrails([
          ...favoriteTrails,
          trails.find((trail) => trail._id === trailId),
        ]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const addFavorite = async (userId, trailId) => {
    try {
      await axios.post(
        `${config.BASE_URL}/users/${userId}/favorites/${trailId}`
      );
    } catch (error) {
      console.error("Failed to add favorite trail:", error);
    }
  };

  const removeFavorite = async (userId, trailId) => {
    try {
      await axios.delete(
        `${config.BASE_URL}/users/${userId}/favorites/${trailId}`
      );
    } catch (error) {
      console.error("Failed to remove favorite trail:", error);
    }
  };

  const isFavorite = (trailId) => {
    return favoriteTrails.some((trail) => trail._id === trailId);
  };

  return (
    <div className="trail-discovery">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="card-container"></div>
          {!!loggedUser.token && favoriteTrails.length > 0 && (
            <FavoriteTrailsContainer
              favoriteTrails={favoriteTrails}
              userId={userId}
            />
          )}

          <div className="trails-cards">
            <h1></h1>
            <h1>Journeying through nature's untold stories </h1>

            <TrailsSlider>
              {trails.map((trail, index) => (
                <TrailCard
                  key={index}
                  trail={trail}
                  navigateToSignUp={loggedUser.token === null}
                  userId={userId}
                  isFavorite={isFavorite(trail._id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </TrailsSlider>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailDiscovery;
