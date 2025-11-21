import React, { useState } from "react";

import styles from "./BurgerNav.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { LiaMountainSolid } from "react-icons/lia";
import { useSelector, useDispatch } from "react-redux";
import { FiUser } from "react-icons/fi";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import { clearLoggedUser } from "../../redux/users/loggedUserSlice";

const BurgerNav = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useSelector((state) => state.loggedUser.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(clearLoggedUser());
    navigate("/login");
    setMenuOpen(false);
  };

  // Main navigation pages (from navbar)
  const mainNavRoutes = [
    { name: "HOME", path: "/" },
    { name: "TRAILS", path: "/all-trails" },
    { name: "HIKING BUDDY", path: "/hiking-buddy" },
    { name: "GEAR", path: "/gear" },
    { name: "EVENTS", path: "/events" },
    { name: "BLOG", path: "/blog-posts" },
  ];

  // Personal pages (from dropdown menu)
  const personalPages = [
    { icon: <FiUser />, name: "PROFILE", path: "/profile" },
    { icon: <FaShoppingCart />, name: "MY CART", path: "/cart" },
    { icon: <FaBox />, name: "MY ORDERS", path: "/orders" },
    { icon: <IoStatsChartOutline />, name: "YOUR TRAILS", path: "/user-stats" },
    { icon: <MdOutlineAddPhotoAlternate />, name: "ADD BLOG", path: "/blog-form" },
  ];

  const publicRouteLinks = [
    { name: "LOG IN", path: "/login" },
    { name: "SIGN UP", path: "/sign-up", className: "sign-up" },
  ];

  return (
    <div className={styles.hamburgerMenu}>
      <input
        className={`${menuOpen ? styles.checkedMenu : ""}`}
        id={styles.menuToggle}
        checked={menuOpen}
        type="checkbox"
        onChange={() => setMenuOpen(!menuOpen)}
      />
      <label
        className={scrolled ? styles.scrolledColor : styles.menuBtn}
        htmlFor={styles.menuToggle}
      >
        <span></span>
      </label>

      <div className={styles.menuBox}>
        <div className={styles.logo}>
          <Link
            to="/"
            className={styles.quasiLogo}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <LiaMountainSolid fontSize="42px" />
            KosovaHike
          </Link>
        </div>
        <div className={styles.items}>
          {!token ? (
            <ul className={styles.navLinks}>
              {publicRouteLinks.map((route, index) => (
                <Link
                  onClick={() => setMenuOpen(!menuOpen)}
                  to={route.path}
                  key={index}
                  className={route.className ? route.className : ""}
                >
                  <li>{route.name}</li>
                </Link>
              ))}
            </ul>
          ) : (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Navigation</h3>
                <ul className={styles.navLinks}>
                  {mainNavRoutes.map((route, index) => (
                    <Link
                      onClick={() => setMenuOpen(!menuOpen)}
                      to={route.path}
                      key={index}
                    >
                      <li>{route.name}</li>
                    </Link>
                  ))}
                </ul>
              </div>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>My Personal Pages</h3>
                <ul className={styles.navLinks}>
                  {personalPages.map((route, index) => (
                    <Link
                      onClick={() => setMenuOpen(!menuOpen)}
                      to={route.path}
                      key={index}
                    >
                      <li>
                        <span className={styles.icon}>{route.icon}</span>
                        {route.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
              <div className={styles.logoutSection}>
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogOut}
                >
                  LOG OUT
                </button>
              </div>
            </>
          )}
          <div className={styles.footer}>
            <p>Contact us:</p>
            <p>
              <a href="tel:38971 22 22 22">+38971 22 22 22</a>
            </p>
            <p>Pristina Republic of Kosovo</p>
            <p className={styles.mail}>hiking@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerNav;
