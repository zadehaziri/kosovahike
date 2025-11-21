import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { LiaMountainSolid } from "react-icons/lia";
import Buttoni from "../../components/Shared/Button/Button";

const SignUp = () => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await authService.signUp(values);

      console.log(response);
      if (response.status === 201) {
        navigate("/login");
        sendConfirmationEmail(values.email, values.firstName);
      }
      console.log("Submitted values:", values);
    } catch (error) {
      console.log("ON SUBMIT");
      console.log(error);
      setErrorMessage(error.response.data.error);
    }
  };

  const sendConfirmationEmail = async (email, firstName) => {
    try {
      console.log("Duke dërguar email konfirmimi...", { email, firstName });
      const response = await emailjs.send(
        "service_d599blg",
        "template_mz7atyn",
        {
          to_email: email,
          name: firstName,
        },
        "wZ0iZrD1cLEUjTbsv"
      );
      console.log("Email konfirmimi u dërgua me sukses:", response);
    } catch (error) {
      console.error("Gabim gjatë dërgimit të email-it të konfirmimit:", error);
      // Nuk e ndalojmë procesin e signup nëse email-i dështon
    }
  };

  const validateName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your name!"));
    }
    if (/\s/.test(value)) {
      return Promise.reject(
        new Error("Name cannot contain spaces between letters.")
      );
    }
    if (/^[A-Z][a-z]*$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Name must start with a capital letter followed by lowercase letters."
      )
    );
  };

  const validateLastname = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your last name!"));
    }
    if (/\s/.test(value)) {
      return Promise.reject(
        new Error("Last name cannot contain spaces between letters.")
      );
    }
    if (/^[A-Z][a-z]*$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Last name must start with a capital letter followed by lowercase letters."
      )
    );
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your password!"));
    }
    if (value && /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(
        "Password must contain at least one uppercase letter, one number, and be at least 6 characters long."
      )
    );
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="signup">
      <div className="signUp-title ">
        <LiaMountainSolid className="mount-icon" />
        <div className="title animate-from-bottom">
          <h2>Join us! </h2>
          <p>
            Sign up now and start exploring the great outdoors with us.
            Adventure awaits!
          </p>
          <Buttoni type="button" className="basic-btn" onClick={handleGoBack}>
            Go back home
          </Buttoni>
        </div>
      </div>
      <Form form={form} onFinish={onSubmit} layout="vertical" className="form">
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "",
            },
            {
              validator: validateName,
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "",
            },
            {
              validator: validateLastname,
            },
          ]}
          hasFeedback
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
              message: "Please enter a valid email!",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "",
            },
            {
              validator: validatePassword,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
        <p className="error-message">{errorMessage}</p>

        <div className="signup-footer">
          <p>You have an account?</p>
          <div className="centered-column">
            <Link to="/login" className="to-login">
              Login
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
