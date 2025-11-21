import { useState, useEffect, memo } from "react";
import "./Trailspage.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import TrailDetailsComponent from "./TrailDetailsComponent";
import TrailsRouteComponent from "./TrailsRouteComponent";
import TrailInfoComponent from "./TrailInfoComponent";
import ReviewListComponent from "./ReviewListComponent";
import ReviewModalComponent from "./ReviewModalComponent";
import { useSelector } from "react-redux";
import { message } from "antd";
import authService from "../../services/authService";
import DetailsOfTrails from "./DetailsOfTrail";
import OnTopDescription from "./OnTopDescription";
import ChatHelper from "../../components/ChatHelper/chathelper";
const Trailspage = () => {
  const { trailName } = useParams();
  const [trail, setTrail] = useState(null);
  const [users, setUsers] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const loggedUser = useSelector((state) => state.loggedUser);

  useEffect(() => {
    if (!trail) {
      console.log("Fetching trail data...");
      axios
        .get(`http://localhost:5000/trails/trail/${trailName}`)
        .then((res) => {
          console.log("Trail data fetched successfully:", res.data);
          setTrail(res.data);
          res.data.reviews.forEach((review) => {
            axios
              .get(`http://localhost:5000/users/${review.user}`)
              .then((res) => {
                setUsers((prevState) => ({
                  ...prevState,
                  [review.user]: res.data,
                }));
              })
              .catch((error) => {
                console.log("Error fetching user:", error);
              });
          });
          setAverageRating(calculateAverageRating(res.data.reviews));
        })
        .catch((error) => {
          console.error("Error fetching trail data:", error);
        });
    }
  }, [trail, trailName]);

  useEffect(() => {
    if (loggedUser.user && trail && trail.reviews) {
      const reviewedByUser = trail.reviews.find(
        (review) => review.user === loggedUser.user._id
      );
      if (reviewedByUser) {
        setAlreadyReviewed(true);
      }
    }
  }, [loggedUser, trail]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }
    return totalRating / reviews.length;
  };

  const handleAddReview = () => {
    if (!loggedUser || !loggedUser.user || !loggedUser.user._id) {
      message.info("Please Login to add a review!");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleSubmit = async ({ rating, comment }) => {
    try {
      if (!loggedUser || !loggedUser.user || !loggedUser.user._id) {
        message.info("Please login to add a review");
        return;
      }

      const userId = loggedUser?.user._id;

      if (editingReview) {
        await authService.editReview({ rating, comment }, trail._id, userId);
        message.success("Review edited successfuly!");
      } else {
        await authService.addReview({ rating, comment }, trail._id, userId);
        message.success("Review added successfuly!");
      }

      const response = await axios.get(
        `http://localhost:5000/trails/trail/${trailName}`
      );
      setTrail(response.data);
      setEditingReview(null);
      setAverageRating(calculateAverageRating(response.data.reviews));

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      await authService.deleteReview(trail._id, review.user);
      const response = await axios.get(
        `http://localhost:5000/trails/trail/${trailName}`
      );
      setTrail(response.data);
      setAverageRating(calculateAverageRating(response.data.reviews));
      message.success("Review deleted successfully!");

      const reviewedByUser = response.data.reviews.find(
        (r) => r.user === loggedUser.user._id
      );
      setAlreadyReviewed(!!reviewedByUser);
      setEditingReview(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };
  const city = trail?.location?.split(",")[0]?.trim() || "";

  if (!trail) {
    return (
      <div className="trailspage-container-one">
        <div className="middle-box">
          <div className="trail-loading">
            <div className="loading-spinner"></div>
            <p>Loading trail details...</p>
          </div>
        </div>
        <ChatHelper/>
      </div>
    );
  }

  return (
    <div className="trailspage-container-one">
      <div className="middle-box">
        <TrailDetailsComponent averageRating={averageRating} trail={trail} />
        <DetailsOfTrails averageRating={averageRating} trail={trail} />
        <TrailInfoComponent location={city} trail={trail} />
        <TrailsRouteComponent trail={trail} />
        <OnTopDescription trail={trail} />
        {/* <TrailGuide /> */}
        <ReviewListComponent
          trail={trail}
          users={users}
          alreadyReviewed={alreadyReviewed}
          loggedUser={loggedUser}
          handleAddReview={handleAddReview}
          handleEditReview={handleEditReview}
          handleDeleteReview={handleDeleteReview}
          averageRating={averageRating}
          profileIcon="https://via.placeholder.com/60"
        />
        <ReviewModalComponent
          isOpen={isModalOpen}
          closeModal={handleClose}
          onSubmit={handleSubmit}
          editingReview={editingReview}
        />
      </div>
      <ChatHelper/>
    </div>
  );
};

export default memo(Trailspage);
