import React, { useEffect, useState } from "react";
import "./profileCard.scss";
import Button from "../Shared/Button/Button";
import gravatar from "gravatar";
import { fetchPastTrails } from "../../redux/pastTrails/trailsTrackingSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Shared/Modal/Modal";
import { Form, message } from "antd";
import InputField from "../Shared/InputField/InputField";
import SelectField from "../Shared/SelectField/SelectField";
import authService from "../../services/authService";
import { setLoggedUser } from "../../redux/users/loggedUserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  const loggedUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const [pastTrailsLength, setPastTrailsLength] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState({
    ...loggedUser.user,
    interests: (loggedUser.user.interests || []).join(", "),
    socialMedia: {
      facebook: loggedUser.user.socialMedia?.facebook || "",
      instagram: loggedUser.user.socialMedia?.instagram || "",
      twitter: loggedUser.user.socialMedia?.twitter || "",
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchPastTrails(user._id))
        .then((result) => {
          // Check if the action was fulfilled or rejected
          if (result && result.type) {
            if (result.type.endsWith('/fulfilled')) {
              // Action was fulfilled
              if (result.payload && Array.isArray(result.payload)) {
                setPastTrailsLength(result.payload.length);
              } else {
                setPastTrailsLength(0);
              }
            } else if (result.type.endsWith('/rejected')) {
              // Action was rejected
              console.error("Error fetching past trails - action rejected:", result.error);
              setPastTrailsLength(0);
            } else {
              // Unknown action type
              setPastTrailsLength(0);
            }
          } else if (result && result.payload && Array.isArray(result.payload)) {
            // Fallback for older Redux versions or different structure
            setPastTrailsLength(result.payload.length);
          } else {
            setPastTrailsLength(0);
          }
        })
        .catch((error) => {
          console.error("Error fetching past trails:", error);
          setPastTrailsLength(0);
        });
    } else {
      setPastTrailsLength(0);
    }
  }, [user, dispatch]);

  useEffect(() => {
    console.log('LoggedUser profileImg updated:', loggedUser.user?.profileImg);
    console.log('User profileImg:', user?.profileImg);
  }, [loggedUser.user?.profileImg, user?.profileImg]);

  const handleCloseModal = () => {
    setIsEditing(false);
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  const handleEditingProfile = () => {
    setIsEditing(true);
    authService
      .getUser(loggedUser.user._id)
      .then((res) => {
        const fetchedUserData = res.data;
        setUserData({
          ...loggedUser.user,
          interests: (loggedUser.user.interests || []).join(", "),
        });
        form.setFieldsValue(fetchedUserData);
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to fetch user data");
      });
  };

  const skillOptions = [
    { value: "", label: "Select Skill Level" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const hikeBuddyOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const handleInputChange = (fieldName, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSaveProfilePicture = (image) => {
    if (image) {
      setProfilePicture(image);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(image);
    }
  };

  const handleSaveEditedData = () => {
    form.validateFields().then((values) => {
      // First upload profile picture if selected
      const uploadPicturePromise = profilePicture
        ? (() => {
            const formData = new FormData();
            formData.append("images", profilePicture);
            return authService
              .uploadProfilePicture(loggedUser.user._id, formData)
              .then((res) => {
                const profileImage = res.data;
                message.success("Profile picture uploaded successfully");
                setProfilePicture(null);
                return profileImage;
              })
              .catch((error) => {
                console.error("Profile picture upload error:", error);
                message.error("Failed to upload profile picture");
                throw error;
              });
          })()
        : Promise.resolve(null);

      uploadPicturePromise
        .then((profileImage) => {
          // Then update user data
          const interestsArray =
            typeof values.interests === "string"
              ? values.interests.split(",").map((interest) => interest.trim())
              : [];

          const updatedFields = {
            ...values,
            interests: interestsArray,
            socialMedia: {
              facebook: values["socialMedia.facebook"],
              twitter: values["socialMedia.twitter"],
              instagram: values["socialMedia.instagram"],
            },
          };

          return authService
            .updateUser(updatedFields, loggedUser.user._id)
            .then((res) => {
              const updatedUser = res.data;
              // If profile picture was uploaded, update it in the user object
              if (profileImage) {
                updatedUser.profileImg = profileImage;
              }
              dispatch(setLoggedUser({ ...loggedUser, user: updatedUser }));
              setUserData(updatedUser);
              message.success("User data updated successfully!");
              setProfilePicturePreview(null);
              handleCloseModal();
            })
            .catch((error) => {
              console.error("User data update error:", error);
              message.error("Failed to update user data");
            });
        })
        .catch((error) => {
          // Error already handled in uploadPicturePromise
          setProfilePicturePreview(null);
        });
    });
  };

  return (
    <div className="profile-card">
      <div className="top-profile-content"></div>
      <div className="bottom-profile-content">
        <div className="profile-image">
          {(() => {
            const profileImg = loggedUser.user?.profileImg || user?.profileImg;
            const imageName = profileImg?.name || (typeof profileImg === 'string' ? profileImg : null);
            const imageUrl = imageName 
              ? `http://localhost:5000/images/${imageName}?t=${Date.now()}` 
              : null;
            
            if (imageUrl && imageName) {
              return (
                <img
                  key={`${imageName}-${loggedUser.user?.profileImg?.name || ''}`}
                  src={imageUrl}
                  alt="profile image"
                  onError={(e) => {
                    console.error('Profile image failed to load. URL:', imageUrl);
                    console.error('ProfileImg data:', profileImg);
                    // Fallback to gravatar if image fails to load
                    const gravatarUrl = gravatar.url(user?.email || loggedUser.user?.email || '', { s: "200", d: "identicon" });
                    e.target.src = gravatarUrl;
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                  onLoad={() => {
                    console.log('Profile image loaded successfully. URL:', imageUrl);
                    console.log('Image name:', imageName);
                  }}
                />
              );
            } else {
              const gravatarUrl = gravatar.url(user?.email || loggedUser.user?.email || '', { s: "200", d: "identicon" });
              return (
                <img
                  src={gravatarUrl}
                  alt="profile image"
                />
              );
            }
          })()}
        </div>
        <h4 className="profile-name">
          {user?.firstName} {user?.lastName}
        </h4>
        {user?.phoneNumber && (
          <div className="profile-phone">
            <FontAwesomeIcon icon={faPhone} className="phone-icon" />
            <Link to={`tel:${user.phoneNumber}`} className="phone-link">
              {user.phoneNumber}
            </Link>
          </div>
        )}
        <div className="profile-stats">
          {pastTrailsLength > 0 && (
            <div className="profile-stat">
              <span className="stat-count">{pastTrailsLength}</span>
              <span className="stat-desc">Trails</span>
            </div>
          )}
          {user?.trailFavorites && user.trailFavorites.length > 0 && (
            <div className="profile-stat">
              <span className="stat-count">{user.trailFavorites.length}</span>
              <span className="stat-desc">Favorites</span>
            </div>
          )}
          {user?.blogPosts && user.blogPosts.length > 0 && (
            <div className='profile-stat'>
              <span className='stat-count'>{user.blogPosts.length}</span>
              <span className='stat-desc'>Blogs</span>
            </div>
          )}
          {user?.eventsAttending && user.eventsAttending.length > 0 && (
            <div className="profile-stat">
              <span className="stat-count">{user.eventsAttending.length}</span>
              <span className="stat-desc">Events</span>
            </div>
          )}
        </div>
        <Button
          className="basic-btn"
          type="button"
          onClick={() => handleEditingProfile()}
        >
          Edit profile
        </Button>
      </div>
      {isEditing && (
        <Modal onClose={() => handleCloseModal()}>
          <h2 className="content-title">Edit Profile</h2>
          <Form
            form={form}
            layout="vertical"
            className="form"
            initialValues={userData}
          >
            <Form.Item label="Profile Picture" name="profileImg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  name="profileImg"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSaveProfilePicture(e.target.files[0])}
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(15, 32, 41, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
                {(profilePicturePreview || loggedUser.user?.profileImg) && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <img
                      src={profilePicturePreview || `http://localhost:5000/images/${loggedUser.user.profileImg.name}`}
                      alt="Profile preview"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid rgba(67, 129, 92, 0.5)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  </div>
                )}
              </div>
            </Form.Item>
            <Form.Item label="Description" name="description">
              <textarea
                className="text-input"
                rows={3}
                placeholder="Description..."
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Age" name="age">
              <InputField
                classname="text-input"
                type="number"
                label="Age"
                onChange={(value) => handleInputChange("age", value)}
              />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <SelectField
                id="gender-filter"
                classname="select-field"
                options={genderOptions}
                onChange={(value) => handleInputChange("gender", value)}
              />
            </Form.Item>
            <Form.Item label="Location" name="location">
              <InputField
                classname="text-input"
                type="text"
                label="Location"
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber">
              <InputField
                classname="text-input"
                type="text"
                label="Phone Number"
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Hike Buddy" name="hikeBuddy">
              <SelectField
                id="hikeBuddy-filter"
                classname="select-field"
                options={hikeBuddyOptions}
                onChange={(value) => handleInputChange("hikeBuddy", value)}
              />
            </Form.Item>
            <Form.Item label="Skill Level" name="skillLevel">
              <SelectField
                id="skill-filter"
                classname="select-field"
                options={skillOptions}
                onChange={(value) => handleInputChange("skillLevel", value)}
              />
            </Form.Item>
            <Form.Item label="Availability" name="availability">
              <InputField
                classname="text-input"
                type="text"
                label="Availability"
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Interests" name="interests">
              <textarea
                className="text-input"
                rows={3}
                placeholder="Enter your interests separated by commas..."
                onChange={(e) => handleInputChange("interests", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Facebook" name="socialMedia.facebook">
              <InputField
                classname="text-input"
                type="text"
                label="Facebook"
                onChange={(e) =>
                  handleInputChange("socialMedia.facebook", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Instagram" name="socialMedia.instagram">
              <InputField
                classname="text-input"
                type="text"
                label="Instagram"
                onChange={(e) =>
                  handleInputChange("socialMedia.instagram", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Twitter" name="socialMedia.twitter">
              <InputField
                classname="text-input"
                type="text"
                label="Twitter"
                onChange={(e) =>
                  handleInputChange("socialMedia.twitter", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item 
              label=" "
              style={{ 
                gridColumn: '2', 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'flex-end',
                marginBottom: 0,
                marginTop: 'auto'
              }}
            >
              <Button
                className="basic-btn green"
                type="submit"
                onClick={() => handleSaveEditedData()}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ProfileCard;
