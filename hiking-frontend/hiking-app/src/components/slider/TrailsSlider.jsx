import React from 'react';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './TrailsSlider.scss';

const TrailsSlider = ({ children }) => {
  const CustomPrevArrow = ({ onClick }) => (
    <button className='custom-prev-arrow' onClick={onClick}>
      &larr;
    </button>
  );
  const CustomNextArrow = ({ onClick }) => (
    <button className='custom-next-arrow' onClick={onClick}>
      &rarr;
    </button>
  );
  const settings = {
    infinite: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    slidesToShow: 4,
    slidesToScroll: 3,
    autoplaySpeed: 4000,
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='trails-slider'>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default TrailsSlider;
