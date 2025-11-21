import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation hook
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.scss";
import DropDown from "./DropDown";
import BurgerNav from "./BurgerNav";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const token = useSelector((state) => state.loggedUser.token);
  const location = useLocation(); // Use useLocation hook

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navContainerClasses = ["navContainer"];
  if (scrolled) {
    navContainerClasses.push("scrolled");
  }

  const isActive = (path) => {
    // Check if the current location matches the given path
    return location.pathname === path;
  };

  const loggedRoutes = [
    { name: "HOME", path: "/" },
    { name: "TRAILS", path: "/all-trails" },
    { name: "HIKING BUDDY", path: "/hiking-buddy" },
    { name: "GEAR", path: "/gear" },
    { name: "EVENTS", path: "/events" },
    { name: "BLOG", path: "/blog-posts" },
  ];
  const publicRouteLinks = [
    { name: "LOGIN", path: "/login" },
    { name: "SIGN UP", path: "/sign-up", className: "sign-up" },
  ];

  return (
    <div className={navContainerClasses.join(" ")}>
      <BurgerNav scrolled={scrolled} />
      <nav className="navBar">
        <ul>
          <Link
            to="/"
            className="quasi-logo"
            style={{
              color: scrolled ? "#43815c" : "white",
              textDecoration: "none",
              cursor: "default",
            }}
          >
            <p className="kosova-name">KOSOV</p>
            <FontAwesomeIcon icon={faTree} style={{ height: "20px" }} />
            <p className="hike-name">HIKE</p>
          </Link>
          {!token ? (
            <div
              className="auth-links"
              style={scrolled ? { color: "#566735" } : {}}
            >
              {publicRouteLinks.map((route, index) => (
                <Link
                  to={route.path}
                  key={index}
                  className={route.className ? route.className : ""}
                  style={{ color: isActive(route.path) ? "#43815c" : "" }}
                >
                  <li>{route.name}</li>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="auth-links"
              id="logged-links"
              style={scrolled ? { color: "#ffffff" } : {}}
            >
              {loggedRoutes.map((route, index) => (
                <Link
                  to={route.path}
                  key={index}
                  className={route.className ? route.className : ""}
                  style={{ color: isActive(route.path) ? "#43815c" : "" }}
                >
                  <li>{route.name}</li>
                </Link>
              ))}
            </div>
          )}
        </ul>
        {token && <DropDown />}
      </nav>
    </div>
  );
};

export default Navbar;
