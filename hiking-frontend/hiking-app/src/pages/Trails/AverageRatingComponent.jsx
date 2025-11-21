import StarRating from "./StarRating";

export const AverageRatingComponent = ({ averageRating }) => {
  return (
    <div>
      {averageRating > 0 && (
        <div className="average-rating">
          <StarRating rating={averageRating} />
        </div>
      )}
    </div>
  );
};
