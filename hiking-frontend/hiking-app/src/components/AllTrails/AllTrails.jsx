import React, { useState, useEffect } from "react";
import Button from "../Shared/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faMagnifyingGlass,
  faSortUp,
  faSortDown,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./allTrails.scss";
import InputField from "../Shared/InputField/InputField";
import { config } from "../../config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { updateFavoriteTrails } from "../../redux/users/loggedUserSlice";
import ChatHelper from "../../components/ChatHelper/chathelper";
const AllTrails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allTrails, setAllTrails] = useState([]);
  const [filteredTrails, setFilteredTrails] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc");
  const [displayedTrails, setDisplayedTrails] = useState(6);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteTrails, setFavoriteTrails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState();
  const [selectedElevationGain, setSelectedElevationGain] = useState();
  const userId = useSelector((state) => state.loggedUser)?.user?._id;
  const [loadingFavoriteTrails, setLoadingFavoriteTrails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${config.BASE_URL}/trails`);
        const trails = response.data || [];
        setAllTrails(trails);
        setFilteredTrails(trails);
      } catch (error) {
        console.error("Error fetching trails:", error);
        setError("Failed to load trails. Please try again later.");
        setAllTrails([]);
        setFilteredTrails([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteTrails = async () => {
      if (userId) {
        try {
          setLoadingFavoriteTrails(true);
          const response = await axios.get(
            `${config.BASE_URL}/users/${userId}/favorites`
          );
          // Ensure response.data is an array
          const favorites = Array.isArray(response.data) ? response.data : [];
          setFavoriteTrails(favorites);
        } catch (error) {
          console.error("Error fetching favorite trails:", error);
          // Set empty array on error to prevent crashes
          setFavoriteTrails([]);
        } finally {
          setLoadingFavoriteTrails(false);
        }
      } else {
        // If no userId, set empty array
        setFavoriteTrails([]);
        setLoadingFavoriteTrails(false);
      }
    };

    fetchTrails();
    fetchFavoriteTrails();
  }, [userId]);

  // Unified filtering function that applies all filters
  const applyAllFilters = () => {
    let filtered = allTrails;

    // Apply difficulty filter
    if (activeDifficulty === "favorite") {
      filtered = filtered.filter((trail) => trail.isFavorite);
    } else if (activeDifficulty) {
      filtered = filtered.filter((trail) => {
        if (!trail.difficulty) return false;
        return trail.difficulty.toLowerCase() === activeDifficulty.toLowerCase();
      });
    }

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((trail) =>
        trail.name && trail.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply duration filter
    if (selectedDuration) {
      filtered = filtered.filter((trail) => {
        if (!trail.duration) return false;
        if (selectedDuration === "short") {
          return trail.duration <= 100;
        } else if (selectedDuration === "medium") {
          return trail.duration >= 101 && trail.duration <= 300;
        } else if (selectedDuration === "long") {
          return trail.duration >= 301;
        }
        return true;
      });
    }

    // Apply elevation gain filter
    if (selectedElevationGain) {
      filtered = filtered.filter((trail) => {
        if (trail.elevationGain === undefined || trail.elevationGain === null) return false;
        if (selectedElevationGain === "low") {
          return trail.elevationGain < 300;
        } else if (selectedElevationGain === "medium") {
          return trail.elevationGain >= 500 && trail.elevationGain <= 1050;
        } else if (selectedElevationGain === "high") {
          return trail.elevationGain >= 1000;
        }
        return true;
      });
    }

    setFilteredTrails(filtered);
  };

  useEffect(() => {
    if (!loadingFavoriteTrails && allTrails.length > 0) {
      mergeFavoriteTrails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteTrails, loadingFavoriteTrails, allTrails.length]);

  // Apply filters after favorite trails are merged and when filters change
  useEffect(() => {
    if (allTrails.length > 0 && !loadingFavoriteTrails) {
      applyAllFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDifficulty, searchQuery, selectedDuration, selectedElevationGain, allTrails.length, loadingFavoriteTrails]);

  useEffect(() => {
    if (!loadingFavoriteTrails && allTrails.length > 0) {
      mergeFavoriteTrails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteTrails, loadingFavoriteTrails, allTrails.length]);

  const mergeFavoriteTrails = () => {
    if (allTrails.length === 0) return;
    if (!favoriteTrails || !Array.isArray(favoriteTrails)) {
      // If favoriteTrails is not an array, just merge trails without favorite status
      const mergedTrails = allTrails.map((trail) => ({ ...trail, isFavorite: false }));
      setAllTrails(mergedTrails);
      return;
    }
    const mergedTrails = allTrails.map((trail) => {
      const isFav = favoriteTrails.some((fav) => fav && fav._id === trail._id);
      return { ...trail, isFavorite: isFav };
    });
    setAllTrails(mergedTrails);
    // Don't reset filteredTrails here - let applyAllFilters handle it
  };

  const toggleFavorite = async (trailId) => {
    if (!userId) {
      navigate(`/sign-up`);
      return;
    }

    try {
      if (isFavorite(trailId)) {
        await removeFavorite(trailId);
        setFavoriteTrails(
          favoriteTrails.filter((trail) => trail._id !== trailId)
        );
        dispatch(updateFavoriteTrails({ trailId, isAdding: false }));
      } else {
        await addFavorite(trailId);
        const trailToAdd = allTrails.find((trail) => trail._id === trailId);
        setFavoriteTrails([...favoriteTrails, trailToAdd]);
        dispatch(updateFavoriteTrails({ trailId, isAdding: true }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const addFavorite = async (trailId) => {
    try {
      await axios.post(
        `${config.BASE_URL}/users/${userId}/favorites/${trailId}`
      );
    } catch (error) {
      console.error("Failed to add favorite trail:", error);
    }
  };

  const removeFavorite = async (trailId) => {
    try {
      await axios.delete(
        `${config.BASE_URL}/users/${userId}/favorites/${trailId}`
      );
    } catch (error) {
      console.error("Failed to remove favorite trail:", error);
    }
  };

  const isFavorite = (trailId) => {
    if (!favoriteTrails || !Array.isArray(favoriteTrails) || favoriteTrails.length === 0) {
      return false;
    }
    return favoriteTrails.some((trail) => trail && trail._id === trailId);
  };

  const handleTrailClick = (name) => {
    const encodedName = encodeURIComponent(name);
    const formattedTrailName = encodedName.replace(/%20/g, "-");
    navigate(`/trails/trail/${formattedTrailName}`);
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return 'N/A';
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

  const handleSortOrder = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setFilteredTrails(filteredTrails.reverse());
  };

  const handleLoadMore = () => {
    setDisplayedTrails((prevCount) => prevCount + 3);
  };

  const handleFilterDifficulty = (difficulty) => {
    if (difficulty === "favorite") {
      setActiveDifficulty("favorite");
    } else if (difficulty === undefined || difficulty === null) {
      setActiveDifficulty(null);
    } else {
      setActiveDifficulty(difficulty);
    }
  };

  const handleSearchQuery = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration || "");
  };

  const handleElevationGainChange = (elevationGain) => {
    setSelectedElevationGain(elevationGain || "");
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    if (allTrails.length > 0 && !loadingFavoriteTrails) {
      applyAllFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDifficulty, searchQuery, selectedDuration, selectedElevationGain, allTrails.length, loadingFavoriteTrails]);

  if (loading) {
    return (
      <div className="all-trails">
        <div className="main-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading trails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-trails">
        <div className="main-container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-trails">
      <div className="main-container">
        <div className="all-trails-header">
          <h1 className="trails-page-title">Discover Amazing Trails</h1>
          <p className="trails-page-subtitle">Explore the breathtaking hiking trails of Kosovo</p>
          <div className="all-trails-search">
            <InputField
              type="text"
              label="Search for trails"
              classname="text-input"
              value={searchQuery}
              onChange={handleSearchQuery}
            />
            <div className="search-icon">
              {loadingFavoriteTrails ? (
                <div className="search-loading-spinner"></div>
              ) : searchQuery === "" ? (
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              ) : null}
            </div>
          </div>
        </div>
        <div className="all-trails-content">
          <div className="all-trails-container">
            <div className="trail-filters">
              <ul className="filter-lists">
                <li
                  className={`trail-category ${
                    activeDifficulty === null ? "active" : ""
                  }`}
                  onClick={() => handleFilterDifficulty()}
                >
                  All
                </li>
                <li
                  className={`trail-category ${
                    activeDifficulty === "easy" ? "active" : ""
                  }`}
                  onClick={() => handleFilterDifficulty("easy")}
                >
                  Easy
                </li>
                <li
                  className={`trail-category ${
                    activeDifficulty === "moderate" ? "active" : ""
                  }`}
                  onClick={() => handleFilterDifficulty("moderate")}
                >
                  Moderate
                </li>
                <li
                  className={`trail-category ${
                    activeDifficulty === "hard" ? "active" : ""
                  }`}
                  onClick={() => handleFilterDifficulty("hard")}
                >
                  Hard
                </li>
                {userId && (
                  <div
                    className={`trail-category ${
                      activeDifficulty === "favorite" ? "active" : ""
                    }`}
                    onClick={() => handleFilterDifficulty("favorite")}
                  >
                    Favorite Trails
                  </div>
                )}
                <div className="trail-category order" onClick={handleSortOrder}>
                  {sortDirection === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  )}
                </div>

               
              </ul>
              <div className="other-filters">
              <select
                  className="dropdown"
                  onChange={(e) => handleDurationChange(e.target.value)}
                  value={selectedDuration}
                >
                  <option value="">FILTER BY DURATION</option>
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
                <select
                  className="dropdown"
                  onChange={(e) => handleElevationGainChange(e.target.value)}
                  value={selectedElevationGain}
                >
                  <option value="">FILTER BY ELEVATION GAIN</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="filtered-trails">
              <div className="trails-container">
                {filteredTrails.slice(0, displayedTrails).map((trail) => (
                  <div className="single-trail-card" key={trail._id}>
                    <img
                      className="trail-image"
                      src={trail.photos && trail.photos.length > 0 ? trail.photos[0] : 'https://via.placeholder.com/400x300?text=Trail+Image'}
                      alt={trail.name || 'Trail'}
                      onClick={() => handleTrailClick(trail.name)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Trail+Image';
                      }}
                    />

                    {trail.duration && (
                      <div className="trail-duration">
                        <span>{formatDuration(trail.duration)}</span>
                      </div>
                    )}
                    <div className="trail-details">
                      {trail.length && (
                        <div className="trail-detail">
                          <span className="detail-text">{trail.length}</span>
                          <span className="detail-name">Length</span>
                        </div>
                      )}
                      {trail.elevationGain !== undefined && (
                        <div className="trail-detail">
                          <span className="detail-text">
                            {trail.elevationGain}
                          </span>
                          <span className="detail-name">Elevation Gain</span>
                        </div>
                      )}
                      {trail.difficulty && (
                        <div className="trail-detail">
                          <span className="detail-text difficulty">
                            {trail.difficulty}
                          </span>
                          <span className="detail-name">Difficulty</span>
                        </div>
                      )}
                    </div>
                    <div className="trail-description">
                      <h4 className="trail-title">{trail.name || 'Untitled Trail'}</h4>
                      <p className="trail-desc">{trail.description || 'No description available.'}</p>
                      <div className="bottom-trail-details">
                        {trail.location && (
                          <div className="trail-location">
                            <FontAwesomeIcon
                              icon={faMapLocationDot}
                              className="location-icon"
                            />
                            <span className="trail-location-text">
                              {trail.location}
                            </span>
                          </div>
                        )}
                        <div className="trail-favorite">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`favorite-icon ${
                              isFavorite(trail._id) ? "favorite" : ""
                            }`}
                            onClick={() => toggleFavorite(trail._id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTrails.length > displayedTrails && (
                  <div className="load-more-btn-container">
                    <Button
                      type="button"
                      className="basic-btn green"
                      onClick={handleLoadMore}
                    >
                      Load More Trails
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ChatHelper/>
      </div>
    </div>
  );
};
export default AllTrails;

// import Button from '../Shared/Button/Button';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapLocationDot, faMagnifyingGlass, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
// import './allTrails.scss';
// import InputField from '../Shared/InputField/InputField';
// import { config } from '../../config';
// import axios from 'axios';
// import { useNavigate } from 'react-router';

// const AllTrails = () => {
//     const navigate = useNavigate();
//     const [allTrails, setAllTrails] = useState([]);
//     const [filteredTrails, setFilteredTrails] = useState([]);
//     const [sortDirection, setSortDirection] = useState('desc');
//     const [displayedTrails, setDisplayedTrails] = useState(6);
//     const [activeDifficulty, setActiveDifficulty] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');


//     useEffect(() => {
//         const fetchTrails = async () => {
//             try {
//                 const response = await axios.get(`${config.BASE_URL}/trails`);
//                 const trails = response.data;
//                 setAllTrails([...trails].reverse());
//                 setFilteredTrails([...trails].reverse());

//             } catch (error) {
//                 console.error('Error fetching trails:', error);
//             }
//         };
//         fetchTrails();
//     }, []);

//     useEffect(() => {
//         let filtered = allTrails;
    
//         if (searchQuery.trim() !== '') {
//             filtered = filtered.filter(trail =>
//                 trail.name.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }
    
//         if (activeDifficulty) {
//             filtered = filtered.filter(trail =>
//                 trail.difficulty.toLowerCase() === activeDifficulty.toLowerCase()
//             );
//         }
    
//         setFilteredTrails(filtered);
//     }, [searchQuery, allTrails, activeDifficulty]);
    
    
    

//     const handleTrailClick = (name) => {
//         const encodedName = encodeURIComponent(name);
//         const formattedTrailName = encodedName.replace(/%20/g, '-');
//         navigate(`/trails/trail/${formattedTrailName}`);
//     };

//     const formatDuration = (minutes) => {
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = minutes % 60;
//         if (hours === 0) {
//           return `${remainingMinutes}min`;
//         } else if (remainingMinutes === 0) {
//           return `${hours}h`;
//         } else {
//           return `${hours}h ${remainingMinutes}min`;
//         }
//     };

//     const handleSortOrder = () => {
//         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         setFilteredTrails(filteredTrails.reverse());
//     };

//     const handleLoadMore = () => {
//         setDisplayedTrails( prevCount => prevCount + 3);
//     };

//     const handleFilterDifficulty = (difficulty) => {
//         if (difficulty) {
//             const filtered = allTrails.filter((trail) => trail.difficulty.toLowerCase() === difficulty.toLowerCase());
//             setFilteredTrails(filtered);
//             setActiveDifficulty(difficulty);
//         } else {
//             setFilteredTrails(allTrails);
//             setActiveDifficulty(null);
//         }
//     };

//     const handleSearchQuery = (e) => {
//         console.log(e.target.value);
//         setSearchQuery(e.target.value);
//     }


//     return (
//         <div className='all-trails'>
//             <div className='main-container'>
//                 <div className="all-trails-content">
//                     <div className='all-trails-search'>
//                         <InputField
//                             type="text"
//                             label="Search for trails"
//                             classname="text-input"
//                             value={searchQuery}
//                             onChange={handleSearchQuery}
//                         />
//                         <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass}/>
//                     </div>
//                     <div className='all-trails-container'>
//                         <div className='trail-filters'>
//                             <ul className='filter-lists'>
//                                 <li className={`trail-category ${activeDifficulty === null ? 'active' : ''}`} onClick={() => handleFilterDifficulty()}>
//                                     All
//                                 </li>
//                                 <li className={`trail-category ${activeDifficulty === 'easy' ? 'active' : ''}`} onClick={() => handleFilterDifficulty('easy')}>
//                                     Easy
//                                 </li>
//                                 <li className={`trail-category ${activeDifficulty === 'moderate' ? 'active' : ''}`} onClick={() => handleFilterDifficulty('moderate')}>
//                                     Moderate
//                                 </li>
//                                 <li className={`trail-category ${activeDifficulty === 'hard' ? 'active' : ''}`} onClick={() => handleFilterDifficulty('hard')}>
//                                     Hard
//                                 </li>
//                                 <li className='trail-category order' onClick={handleSortOrder}>
//                                     {sortDirection === 'asc' ? <FontAwesomeIcon icon={faSortUp}/> : <FontAwesomeIcon icon={faSortDown}/>}
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className='filtered-trails'>
//                             <div className='trails-container'>
//                                 {filteredTrails.slice(0, displayedTrails).map((trail) => (
//                                     <div className='single-trail-card' key={trail._id}>
//                                         <img className='trail-image' src={trail.photos[0]} alt={trail.name}  onClick={() => handleTrailClick(trail.name)}/>
//                                         <div className='trail-duration'>
//                                             <span>{formatDuration(trail.duration)}</span>
//                                         </div>
//                                         <div className='trail-details'>
//                                             <div className='trail-detail'>
//                                                 <span className='detail-text'>{trail.length}</span>
//                                                 <span className='detail-name'>Length</span>
//                                             </div>
//                                             <div className='trail-detail'>
//                                                 <span className='detail-text'>{trail.elevationGain}</span>
//                                                 <span className='detail-name'>Elevation Gain</span>
//                                             </div>
//                                             <div className='trail-detail'>
//                                                 <span className='detail-text difficulty'>{trail.difficulty}</span>
//                                                 <span className='detail-name'>Difficulty</span>
//                                             </div>
//                                         </div>
//                                         <div className='trail-description'>
//                                             <h4 className='trail-title'>{trail.name}</h4>
//                                             <p className='trail-desc'>
//                                                 {trail.description}
//                                             </p>
//                                             <div className='trail-location'>
//                                                 <FontAwesomeIcon icon={faMapLocationDot} className='location-icon'/>
//                                                 <span className='trail-location-text'>{trail.location}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {filteredTrails.length > displayedTrails &&
//                                 <div className='load-more-btn-container'>
//                                     <Button
//                                         type="button"
//                                         className="basic-btn"
//                                         onClick={handleLoadMore}
//                                     >
//                                         Load More
//                                     </Button>
//                                 </div>
//                                 }
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AllTrails;