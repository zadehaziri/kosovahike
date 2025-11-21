import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';

import Navbar from './../components/navbar/Navbar';
import Footer from './../components/footer/footer';
import ScrollToTop from '../components/scrollToTop/ScrollToTop';
import { CustomThemeProvider } from '../styles/CustomTheme';
import { useSelector } from 'react-redux';

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;
  const loggedUser = useSelector((state) => state.loggedUser.user);
  const isLoginSignUp = pathname === '/login' || pathname === '/sign-up';

  const basePath = '/user-stats';
  const hideNav = pathname.startsWith(basePath);
  const navShouldBeHidden = hideNav || isLoginSignUp;
  if (loggedUser && isLoginSignUp) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='app'>
      <CustomThemeProvider>
        {!navShouldBeHidden && <Navbar />}
        <ScrollToTop />
        <Outlet />
        {!navShouldBeHidden && <Footer />}
      </CustomThemeProvider>
    </div>
  );
};

export default Layout;
