import 'leaflet/dist/leaflet.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './UserTrailStats.scss';
import Map from './Map';
import { LiaMountainSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';

const UserTrailStats = () => {
  const trails = useSelector((state) => state.trailsTracking.pastTrails);
  const navigate = useNavigate();
  return (
    <div className='user-stats'>
      {trails && (
        <>
          <div className='sidebar'>
            {/* <h1>Kosova Hike</h1> */}
            <Link to='/' className='quasi-logo'>
              <LiaMountainSolid fontSize='42px' />
              KosovaHike
            </Link>
            <div
              className='sidebar-nav'
              onClick={() => navigate('/user-stats/past-trails')}
            >
              <p>Trails</p>
            </div>
            <Outlet />

            <footer className='sidebar-footer'>
              <p className='sidebar-copyright'>
                &copy; Copyright {new Date().getFullYear()} by Kosova Hike
              </p>
            </footer>
          </div>
          <Map />
        </>
      )}
    </div>
  );
};

export default UserTrailStats;
