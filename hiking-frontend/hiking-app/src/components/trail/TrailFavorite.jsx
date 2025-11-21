import { useEffect, useState } from 'react';
import TrailsSlider from '../slider/TrailsSlider';
import TrailCard from './TrailCard';
import axios from 'axios';
import './TrailDiscovery.scss';

const TrailDiscovery = () => {
  const [userCity, setUserCity] = useState(null);
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/trails');
      console.log(response.data);
      setTrails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trails:', error);
      setError('Failed to fetch trails. Please try again later.');
      setLoading(false);
    }
  };


  useEffect(() => {
    // const fetchUserCity = async () => {
    //   try {
    //     const response = await fetch(
    //       'https://api.ipgeolocation.io/ipgeo?apiKey=4ba2b16019de4abbb548227f58ce0121'
    //     );
    //     console.log(response);
    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(data);
    //       setUserCity(data.city);
    //     } else {
    //       console.error('Failed to fetch city name:', response.statusText);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching city name:', error);
    //   }
    // };
    fetchTrails()
    // fetchUserCity();

  }, []);

  return (
    <div className='trail-discovery'>
      <h1>Favorite trails near {userCity}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className='card-container'>
          <div className='trails-cards'>
            <TrailsSlider>
              {trails.map((trail, index) => (
                <TrailCard trail={trail} key={index} />
              ))}
            </TrailsSlider>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailDiscovery;
