import React, { useState } from 'react';
import './navProfile.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBlog, faCalendarDays, faHeart, faPlus, faSquarePollHorizontal, faUser } from '@fortawesome/free-solid-svg-icons';
import { clearLoggedUser } from "../../redux/users/loggedUserSlice";
import { useDispatch } from "react-redux";

const NavProfile = ({ section }) => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('Profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearLoggedUser());
  };

  const handleSection = (selectedSection) => {
    section(selectedSection);
    setActiveSection(selectedSection);
    handleMenuOpen();
  };

  const handleMenuOpen = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(!isMenuOpen);
      const navbar = document.querySelector('.profile-links');
      navbar.classList.toggle('open', isMenuOpen);
    }
  };

  return (
    <div className='profile-navbar'>
      <ul className={`profile-links ${isMenuOpen ? 'open': ''}`}>
        <li className={`profile-link ${activeSection === 'Profile' ? 'active' : ''}`} onClick={() => { handleSection('Profile') }}>
          <FontAwesomeIcon icon={faUser}/>
          <span>
            Profile
          </span>
        </li>
        <li className={`profile-link ${activeSection === 'My Trails' ? 'active' : ''}`} onClick={() => { handleSection('My Trails') }}>
          <FontAwesomeIcon icon={faSquarePollHorizontal}/>
          <span>
            My Trails
          </span>
        </li>
        <li className={`profile-link ${activeSection === 'My Blogs' ? 'active' : ''}`} onClick={() => { handleSection('My Blogs') }}>
          <FontAwesomeIcon icon={faBlog}/>
          <span>
            My Blogs
          </span>
        </li>
        <li className={`profile-link ${activeSection === 'Favorited Trails' ? 'active' : ''}`} onClick={() => { handleSection('Favorited Trails') }}>
          <FontAwesomeIcon icon={faHeart}/>
          <span>
            Favorited Trails
          </span>
        </li>
        <li className={`profile-link ${activeSection === 'Joined Events' ? 'active' : ''}`} onClick={() => { handleSection('Joined Events') }}>
          <FontAwesomeIcon icon={faCalendarDays}/>
          <span>
            Joined events
          </span>
        </li>
        <li className='profile-link' onClick={() => handleLogout()}>
          <FontAwesomeIcon icon={faArrowRightFromBracket}/>
          <span>
            Logout
          </span>
        </li>
      </ul>
      <div className={`profile-burger-menu ${isMenuOpen ? 'rotate' : ''}`} onClick={() => handleMenuOpen()}>
        <FontAwesomeIcon icon={faPlus}/>
      </div>
    </div>
  )
}

export default NavProfile;
