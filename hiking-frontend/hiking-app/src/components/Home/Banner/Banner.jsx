import React, { useEffect, useState } from 'react';
import './banner.scss';
import banner1 from '../../../assets/images/banner1.jpeg';
import banner2 from '../../../assets/images/banner2.jpg';
import banner3 from '../../../assets/images/banner3.jpg';
import banner4 from '../../../assets/images/banner4.jpg';
import SubTitle from '../../Shared/Subtitle/SubTitle';
import axios from 'axios';
import NumberIncrement from './NumberIncrement';

const Banner = () => {
    const [bannerImg, setBannerImg] = useState(banner1);
    const [activeBullet, setActiveBullet] = useState(0);
    const [trailsLength, setTrailsLength] = useState(0);
    const [usersLength, setUsersLength] = useState(0);
    const [transition, setTransition] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5000/trails")
            .then((res) => {
                setTrailsLength(res.data.length);
            })
            .catch((err) => {
                console.log(err);
            })
        axios.get("http://localhost:5000/users")
            .then((res) => {
                setUsersLength(res.data.length);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    const sliderImages = [
        [banner1, banner2, banner3],
        [banner2, banner3, banner4],
        [banner3, banner4, banner1],
        [banner4, banner1, banner2]
    ];

    const handleBulletClick = (index) => {
        setTransition(true);
        setTimeout(() => {
            setActiveBullet(index);
            setTransition(false);
        }, 300)

    };

    return (
        <div className='banner' style={{ backgroundImage: `url(${bannerImg})` }}>
            <div className='main-container'>
                <div className='banner-content'>
                    <div className='left-banner'>
                        <div className='top-lfbn-content'>
                            <h2 className='banner-title'>Amazing mountains to explore</h2>
                        </div>
                        <div className='bottom-lfbn-content'>
                            <p className='banner-paragraph'>Do not follow where the path may lead. Go instaed where there is no path and leave a trail.</p>
                            <SubTitle
                                text="RALPH EMERSON"
                                afterLine={true}
                            />
                        </div>
                    </div>
                    <div className='right-banner'>
                        <div className='top-rgbn-content'>
                            <div className='banner-stats'>
                                <div className='banner-stat'>
                                    <h4 className='stat-name'>Trails</h4>
                                    <span className='stat-count'>
                                        <NumberIncrement
                                            number={trailsLength}
                                        />
                                    </span>
                                </div>
                                <div className='banner-stat'>
                                    <h4 className='stat-name'>Users</h4>
                                    <span className='stat-count'>
                                        <NumberIncrement
                                            number={usersLength}
                                        />
                                    </span>
                                </div>
                                <div className='banner-stat'>
                                    <h4 className='stat-name'>Events</h4>
                                    <span className='stat-count'>
                                        <NumberIncrement
                                            number={100}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='bottom-rgbn-content'>
                            <div className={`banner-slider ${transition ? 'slider-fade-out' : ''}`}>
                                {sliderImages[activeBullet].map((image, index) => (
                                    <div className='slider-image' key={index}>
                                        <img src={image} alt={`banner ${index}`} onClick={() => setBannerImg(image)} />
                                    </div>
                                ))}
                            </div>
                            <div className='slider-controller'>
                                {sliderImages.map((_, index) => (
                                    <div
                                        className={`controll-bullet ${index === activeBullet ? 'active' : ''}`}
                                        key={index}
                                        onClick={() => handleBulletClick(index)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
