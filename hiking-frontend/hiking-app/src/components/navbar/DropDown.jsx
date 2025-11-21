import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { TbSocial } from "react-icons/tb";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FaHiking } from "react-icons/fa";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import avatar from "../../assets/images/avatar.jpg";
import "./Navbar.scss";
import "./DropDown.scss";
import { clearLoggedUser } from "../../redux/users/loggedUserSlice";

const DropDown = () => {
  const dispatch = useDispatch(clearLoggedUser);
  const user = useSelector((state) => state.loggedUser.user);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const protectedRouteLinks = [
    { icon: <FiUser />, name: "PROFILE", path: "/profile" },
    // { name: "TRAILS", path: "/all-trails" },
    // { icon: <TbSocial />, name: "Hiking Buddy", path: "/hiking-buddy" },
    // { icon: <FaHiking />, name: "Gear & Equipments", path: "/gear" },
    { icon: <FaShoppingCart />, name: "MY CART", path: "/cart" },
    { icon: <FaBox />, name: "MY ORDERS", path: "/orders" },
    { icon: <IoStatsChartOutline />, name: "YOUR TRAILS", path: "/user-stats" },
    {
      icon: <MdOutlineAddPhotoAlternate />,
      name: "ADD BLOG",
      path: "/blog-form",
    },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogOut = () => {
    dispatch(clearLoggedUser());
    navigate("/login");
  };

  return (
    <div className="avatar dropdown" ref={dropdownRef}>
      {/* Hide the icon on small devices */}
      <div className="bars-icon" onClick={toggleDropdown}>
        <FontAwesomeIcon
          icon={faUser}
          className="avatar-img"
          style={{ cursor: "pointer" }}
        />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="route-links">
            {protectedRouteLinks.map((route, index) => (
              <div className="link" key={index}>
                <Link to={route.path} onClick={toggleDropdown}>
                  {route.icon} {route.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="action">
            <span className="logout" onClick={() => handleLogOut()}>
              LOG OUT
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
