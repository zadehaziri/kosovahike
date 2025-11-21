// Import React, useState, useEffect, Form, Input, Button
import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import Button from "../../components/Shared/Button/Button";
import "./modal.scss";

const Modal = ({ isOpen, closeModal, onSubmit, review }) => {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
      form.setFieldsValue({
        rating: review.rating,
        comment: review.comment,
      });
    } else {
      setRating(null);
      setComment("");
      form.resetFields();
    }
  }, [review, form]);

  const handleRatingChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 5) {
      setRating(value);
    }
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <span className="wrapper-modal" onClick={closeModal} />
          <div className="content-modal">
            <div className="review-btn close">
              <Button className="basic-btn green" onClick={closeModal}>
                X
              </Button>
            </div>

            <h2>{review ? "Edit Review" : "Add Review"}</h2>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              style={{ maxWidth: 400 }}
            >
              <Form.Item
                label="Rating:"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please enter a rating!",
                  },
                  {
                    pattern: /^\d{1}$/,
                    message: "Rating should be a single digit!",
                  },
                ]}
              >
                <Input
                  type="text"
                  onChange={handleRatingChange}
                  style={{ color: "#000" }}
                  maxLength={1}
                />
              </Form.Item>

              <Form.Item label="Comment:" name="comment">
                <Input.TextArea
                  rows={4}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ color: "#000" }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="submit" className="basic-btn green">
                  {review ? "Update" : "Submit"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
