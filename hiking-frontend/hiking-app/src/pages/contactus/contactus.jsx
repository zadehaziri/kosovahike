import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { Input, Form, Button, message } from "antd";
import { LiaMountainSolid } from "react-icons/lia";
import "./contactus.scss";
import { useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";

const ContactForm = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loggedUser = useSelector((state) => state.loggedUser.user);
  const [form] = Form.useForm();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const handleGoBack = () => {
    navigate("/");
  };
  useEffect(() => {
    if (loggedUser) {
      form.setFieldsValue({
        fullName: loggedUser.firstName + " " + loggedUser.lastName,
        email: loggedUser.email,
      });
    }
  }, [loggedUser, form]);

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
      setError("");
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const values = await form.validateFields();
      
      if (!captchaVerified) {
        setError("Ju lutem verifikoni CAPTCHA-n!");
        message.error("Ju lutem verifikoni CAPTCHA-n!");
        setLoading(false);
        return;
      }

      console.log("Duke dërguar email...", values);

      const response = await emailjs.send(
        "service_d599blg",
        "template_os9x33i",
        {
          email: values.email,
          name: values.fullName,
          message: values.message,
        },
        "wZ0iZrD1cLEUjTbsv"
      );

      console.log("Email sent successfully:", response);
      message.success("Email-i u dërgua me sukses!");
      
      form.resetFields();
      setAlert(true);
      setCaptchaVerified(false);
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error.text || error.message || "Gabim gjatë dërgimit të email-it. Ju lutem provoni përsëri.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact-title">
        <LiaMountainSolid className="mount-icon" />
        <div className="title animate-from-bottom">
          <h2>Contact Us</h2>
          <p>
            Have a question or feedback? Reach out to us using the form on your
            right.
          </p>
          <button type="button" className="basic-btn" onClick={handleGoBack}>
            Go back to home-page
          </button>
        </div>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="contact-form"
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Please enter your full name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[
            {
              required: true,
              message: "Please enter your message",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        {alert && (
          <div className="custom-alert" style={{ 
            background: '#52c41a', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '15px' 
          }}>
            <p>✅ Email-i u dërgua me sukses!</p>
            <p>Po ju ridrejtojmë në faqen kryesore...</p>
          </div>
        )}
        {error && (
          <div style={{ 
            background: '#ff4d4f', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '5px', 
            marginBottom: '15px' 
          }}>
            <p>❌ {error}</p>
          </div>
        )}
        <ReCAPTCHA
          sitekey="6Ld2V5cpAAAAAHRHxT_V5hF8jtdzdIqKdQyKpCDd"
          onChange={handleCaptchaChange}
        />
        <Button 
          type="primary" 
          htmlType="submit" 
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          style={{ width: '100%', marginTop: '15px' }}
        >
          {loading ? 'Duke dërguar...' : 'Dërgo'}
        </Button>
      </Form>
    </div>
  );
};

export default ContactForm;
