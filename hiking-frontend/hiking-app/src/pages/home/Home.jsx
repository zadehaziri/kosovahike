import React from 'react';
import './Home.scss';
import Testimonials from '../../components/Testimonials/Testimonials';
import Banner from '../../components/Home/Banner/Banner';
import TopRatedTrails from '../../components/Home/TopRatedTrails/TopRatedTrails';
import TopServices from '../../components/Home/TopServices/TopServices';
import Partners from '../../components/Home/Partners/Partners';
import TrailEvents from '../../components/Home/TrailEvents/TrailEvents';
import ChatHelper from "../../components/ChatHelper/chathelper";

const Home = () => {
  return (
    <div className='home-container'>
      <Banner />
      <TrailEvents />
      <TopRatedTrails />
      <TopServices />
      <Partners />
      <ChatHelper/>
      {/* <Testimonials /> */}
    </div>
  );
};

export default Home;
