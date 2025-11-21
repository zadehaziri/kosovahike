import React from "react";
import ProfileCard from "./ProfileCard";
import "./profileSection.scss";
import CompletedProfile from "./CompletedProfile";
import FieldsToComplete from "./FieldsToComplete";
import Button from "../Shared/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../redux/users/loggedUserSlice";
import authService from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLayerGroup,
  faLightbulb,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const ProfileSection = ({ user, completedPercentage, fieldsToComplete }) => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const notCompleted = completedPercentage < 100;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHikeBuddy = async (bool) => {
    try {
      const updatedUser = { ...loggedUser.user, hikeBuddy: bool };
      const res = await authService.updateUser(
        updatedUser,
        loggedUser.user._id
      );
      const updatedUserData = res.data;
      dispatch(setLoggedUser({ ...loggedUser, user: updatedUserData }));

      if (bool === true) {
        navigate("/hiking-buddy");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="profile-section">
      <div className="top-profile-section">
        <div
          className={
            notCompleted
              ? "left-side-profile not-completed"
              : "left-side-profile"
          }
        >
          <div className="profile-card-content">
            <ProfileCard user={user} />
          </div>
        </div>
        {completedPercentage < 100 && (
          <div className="right-side-profile">
            <CompletedProfile percentage={completedPercentage} />
            <FieldsToComplete fields={fieldsToComplete} />
          </div>
        )}
      </div>
      <div className="bottom-profile-section">
        <div className="bottom-profile__content">
          {user?.hikeBuddy ? (
            <div className="profile-hikeBuddy">
              <h4 className="hike-buddy-title">
                You are currently looking for hike buddies.
              </h4>
              <p className="hike-buddy-desc">
                If you no longer want to connect with hike buddies, you can
                leave:
              </p>
              <Button
                className="basic-btn green"
                type="button"
                onClick={() => handleHikeBuddy(false)}
              >
                Leave
              </Button>
            </div>
          ) : (
            <div className="profile-hikeBuddy">
              <h4 className="hike-buddy-title">
                Do you want to find and connect with hike buddies?
              </h4>
              <Button
                className="basic-btn green"
                type="button"
                onClick={() => handleHikeBuddy(true)}
              >
                Yes
              </Button>
            </div>
          )}
          <div className="profile-otherDetails">
            <div className="all-other-details">
              {(user?.description ||
                user?.skillLevel ||
                user?.availability ||
                user?.interests.length > 0) && (
                <div className="user-detail">
                  <span className="detail-title">Bio</span>
                  {user?.description && (
                    <div className="user-detail__content">
                      <p className="detail__text-bio">{user.description}</p>
                    </div>
                  )}
                  {user?.skillLevel && (
                    <div className="user-detail__content">
                      <FontAwesomeIcon
                        className="detail__icon"
                        icon={faLightbulb}
                      />
                      <p className="detail__text">{user.skillLevel}</p>
                    </div>
                  )}
                  {user?.availability && (
                    <div className="user-detail__content">
                      <FontAwesomeIcon
                        className="detail__icon"
                        icon={faClock}
                      />
                      <p className="detail__text">{user.availability}</p>
                    </div>
                  )}
                  {user?.interests.length > 0 && (
                    <div className="user-detail__content">
                      <FontAwesomeIcon
                        className="detail__icon"
                        icon={faLayerGroup}
                      />
                      <ul className="detail-array">
                        {user?.interests.map((interest, index) => (
                          <li className="array-list-content" key={index}>
                            {interest}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {(user?.phoneNumber ||
                user?.location ||
                user?.socialMedia?.facebook ||
                user?.socialMedia?.instagram ||
                user?.socialMedia?.twitter) && (
                <div className="user-detail">
                  <span className="detail-title">Contact Info</span>
                  {user?.phoneNumber && (
                    <div className="user-detail__content phone-number-content">
                      <FontAwesomeIcon
                        className="detail__icon phone-icon-large"
                        icon={faPhone}
                      />
                      <span className="detail__text phone-number-text">
                        <Link to={`tel:${user.phoneNumber}`} className="phone-link">
                          {user.phoneNumber}
                        </Link>
                      </span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="user-detail__content">
                      <FontAwesomeIcon
                        className="detail__icon"
                        icon={faLocationDot}
                      />
                      <span className="detail__text">{user.location}</span>
                    </div>
                  )}
                  {user?.socialMedia && (
                    <div className="user-socialMedias">
                      {user?.socialMedia?.facebook && (
                        <div className="user-socialMedia">
                          <Link
                            to={`https://www.facebook.com/${user.socialMedia.facebook}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon={faFacebookF} />
                          </Link>
                        </div>
                      )}
                      {user?.socialMedia?.instagram && (
                        <div className="user-socialMedia">
                          <Link
                            to={`https://www.instagram.com/${user.socialMedia.instagram}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon={faInstagram} />
                          </Link>
                        </div>
                      )}
                      {user?.socialMedia?.twitter && (
                        <div className="user-socialMedia">
                          <Link
                            to={`https://www.twitter.com/${user.socialMedia.twitter}`}
                            target="_blank"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
