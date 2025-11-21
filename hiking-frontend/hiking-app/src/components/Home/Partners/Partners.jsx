import React from 'react';
import './partners.scss';

const Partners = () => {
  const partners = [
    {
      name: 'Uje Rugove',
      logo: 'https://rugove.eu/wp-content/uploads/2018/08/rugove_logo.png'
    },
    {
      name: 'Ssprint',
      logo: 'https://konsulencemarketing.com/wp-content/uploads/2021/05/0001-S-Sprint-Logo-1024x913.png'
    },
    {
      name: 'Frutomania',
      logo: 'https://www.frutomaniaks.com/wp-content/uploads/2020/06/FRUTOMANIA-PA-ICON.png'
    },
    {
      name: 'Vala Kosovo Telecom',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Vala_Kosovo_Telecom_logo.svg/981px-Vala_Kosovo_Telecom_logo.svg.png'
    },
    {
      name: 'Devolli Corporation',
      logo: 'https://www.devollicorporation.com/wp-content/uploads/2020/06/devollicoblack.png'
    },
    {
      name: 'Outdoor Kosova',
      logo: 'https://outdoorkosova.com/wp-content/uploads/2021/11/Backup_of_logo-outdoor-kosova.png'
    }
  ];

  return (
    <div className='partners-section'>
      <div className='main-container'>
        <h3 className='partners-title'>Our Partners</h3>
        <div className='partners-grid'>
          {partners.map((partner, index) => (
            <div key={index} className='partner-item'>
              <img
                src={partner.logo}
                alt={partner.name}
                className='partner-logo'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;