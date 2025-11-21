import React, { useState, useEffect, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import "./ReviewListComponent.scss";
import Button from "../../components/Shared/Button/Button";
import SubTitle from "../../components/Shared/Subtitle/SubTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

const ReviewListComponent = ({
  trail,
  users,
  loggedUser,
  handleAddReview,
  handleEditReview,
  handleDeleteReview,
  averageRating,
  profileIcon,
}) => {
  const userReviewed = useMemo(() => {
    if (trail && trail.reviews) {
      const userReview = trail.reviews.find(
        (review) => review.user === loggedUser.user?._id
      );
      return !!userReview;
    }
    return false;
  }, [trail, loggedUser.user]);

  return (
    <div className="reviews-all-trail-single">
      {loggedUser.user && !userReviewed && (
        <div className="add-review-single-trail">
          <Button
            type="button"
            onClick={() => handleAddReview()}
            className="basic-btn green"
          >
            Add a review
          </Button>
        </div>
      )}
      {trail?.reviews && trail.reviews.length > 0 && (
        <div className="all-reviews">
          {averageRating > 0 && (
            <div className="average-rating">
              <StarRating rating={averageRating} />
              <p>{averageRating.toFixed(1)}</p>
            </div>
          )}
          <div className="review-container">
            {trail.reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="card"
                >
                  <div className="user-data">
                    <div className="user-left">
                      <img
                        src={users[review.user]?.profileImg?.name || profileIcon || "https://via.placeholder.com/60"}
                        alt={users[review.user]?.firstName || "User"}
                        onError={(e) => {
                          e.target.src = profileIcon || "https://via.placeholder.com/60";
                        }}
                      />
                      <h4>
                        {users[review.user]?.firstName}{" "}
                        {users[review.user]?.lastName}
                      </h4>
                    </div>
                    {loggedUser.user?._id === users[review.user]?._id && (
                      <div className="user-buttons">
                        <button
                          type="button"
                          className="review-btn"
                          onClick={() => handleEditReview(review)}
                        >
                          &#128393;
                        </button>
                        <button
                          type="button"
                          className="review-btn"
                          onClick={() => handleDeleteReview(review)}
                        >
                          &#128465;
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-review-section">
                    <div className="quote-left-comment">
                      <FontAwesomeIcon icon={faQuoteLeft} />
                    </div>
                    <div className="user-comment">
                      <p>{review.comment}</p>
                    </div>
                    <div className="quote-right-comment">
                      <FontAwesomeIcon icon={faQuoteRight} />
                    </div>
                  </div>
                  <div className="user-rating">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ReviewListComponent);
