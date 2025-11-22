import React from "react";
import Modal from "./Modal";

const ReviewModalComponent = ({
  isOpen,
  closeModal,
  onSubmit,
  editingReview,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={onSubmit}
      review={editingReview}
    />
  );
};

export default ReviewModalComponent;
