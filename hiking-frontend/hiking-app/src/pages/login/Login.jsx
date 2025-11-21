import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LiaMountainSolid } from 'react-icons/lia';
import Button from '../../components/Shared/Button/Button';
import ReCAPTCHA from "react-google-recaptcha";

import {
  setLoggedUser,
  clearLoggedUser,
} from "../../redux/users/loggedUserSlice";

import "./Login.scss";
import authService from "../../services/authService";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage("");
    
    if (!captchaVerified) {
      setErrorMessage("Ju lutem verifikoni CAPTCHA-n!");
      message.warning("Ju lutem verifikoni CAPTCHA-n!");
      return;
    }

    try {
      setLoading(true);
      const values = await form.validateFields();
      
      console.log("Duke dërguar request për login...", values);
      
      const response = await authService.login(values);
      
      console.log("Response nga server:", response);
      
      if (response.status === 200) {
        const { token, expiresIn, user } = response.data;
        
        console.log("Login suksess:", { token, user, expiresIn });
        
        dispatch(setLoggedUser({ token, user, expiresIn }));
        message.success("Login i suksesshëm! Po ju ridrejtojmë...");
        
        const timeout = parseInt(expiresIn) * 60 * 60 * 1000;
        setTimeout(() => {
          dispatch(clearLoggedUser());
          navigate("/login");
        }, timeout);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Gabim gjatë login:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      
      const errorMsg = error?.response?.data?.error || 
                      error?.response?.data?.message || 
                      error?.message || 
                      "Gabim gjatë login-it. Ju lutem provoni përsëri.";
      
      setErrorMessage(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  return (
    <div className="login">
      <div className="login-title ">
        <LiaMountainSolid className="mount-icon" />
        <div className="title animate-from-bottom">
          <h2>Welcome back!</h2>
          <p>
            🌄 Please log in to access your account and start exploring trails.
            Happy hiking!
          </p>
          <Button
            type="button"
            className="basic-btn"
            onClick={handleGoBack}
          >
            Go back home
          </Button>
        </div>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="form"
      >
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
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter a correct password" },
            { min: 6 },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <p>Forgot password?</p>
        
        <ReCAPTCHA 
          sitekey="6Ld2V5cpAAAAAHRHxT_V5hF8jtdzdIqKdQyKpCDd"
          onChange={handleCaptchaChange}
        />
        
        {errorMessage && (
          <div style={{ 
            color: '#ff4d4f', 
            marginTop: '10px', 
            padding: '10px',
            background: 'rgba(255, 77, 79, 0.1)',
            borderRadius: '5px'
          }}>
            {errorMessage}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: '15px',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Duke u loguar...' : 'Login'}
        </button>

        <div className="login-footer">
          <p>you don't have an account?</p>
          <Link to="/sign-up">
            <p className="to-signup">Sign up</p>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Login;
