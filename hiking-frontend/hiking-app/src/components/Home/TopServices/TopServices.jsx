import React from 'react';
import './topServices.scss';
import SubTitle from '../../Shared/Subtitle/SubTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faMapLocationDot, faTemperatureHalf, faToolbox } from '@fortawesome/free-solid-svg-icons';

const TopServices = () => {
    const services = [
        {
        title: "Diverse Locations",
        desc: "Explore a variety of stunning locations ranging from serene forests to rugged mountains.",
        logo: faMapLocationDot
        },
        {
        title: "Live Conditions",
        desc: "Stay updated with real-time weather forecasts and trail conditions for a safe hiking experience.",
        logo: faTemperatureHalf
        },
        {
        title: "User Reviews",
        desc: "Read authentic reviews from fellow hikers to plan your adventure effectively and share your experiences.",
        logo: faStar
        },
        {
        title: "Recommended Gear",
        desc: "Get insights into essential gear and equipment recommended by experienced hikers for your trekking journey.",
        logo: faToolbox
        },
    ];

  return (
    <div className='top-services'>
        <div className='main-container'>
            <div className='top-services-content'>
                <div className='top-services-title'>
                    <h3 className='services-title'>Top Services</h3>
                    <SubTitle
                        text="We provide the best experience"
                        afterLine={true}
                        beforeLine={true}
                    />
                </div>
                <div className='services-cards'>
                    {services.map((service, index) => (
                        <div className='service-card' key={index}>
                            <div className='single-service'>
                                <FontAwesomeIcon className='service-icon' icon={service.logo}/>
                                <h5 className='service-title'>{service.title}</h5>
                                <p className='service-desc'>{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TopServices