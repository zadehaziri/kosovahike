import React, { useState } from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import { message } from "antd";

import { LiaMountainSolid } from "react-icons/lia";
import {
  MdOutlineEmail,
  MdLocationPin,
  MdOutlineSmartphone,
} from "react-icons/md";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      message.warning('Ju lutem shkruani një email të vlefshëm');
      return;
    }

    setLoading(true);
    // Newsletter functionality can be added here
    setTimeout(() => {
      message.success('Faleminderit për abonimin!');
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="footer-container">
      <div className="middle">
        <div className="first">
          <Link to="/" className="logo">
            <LiaMountainSolid />
            KosovaHike
          </Link>
          <h3>About</h3>
          <p>
            KosovaHike is your ultimate guide to exploring the breathtaking trails and natural wonders of Kosovo. We connect passionate hikers, organize exciting outdoor events, and provide comprehensive resources for all your hiking adventures. Whether you're a beginner or an experienced trekker, join our community to discover hidden gems, share experiences, and create unforgettable memories in the heart of nature.
          </p>
        </div>
        <div className="second">
          <h3>Quick Links</h3>
          <div className="links-list">
            <Link to="/all-trails">Trails</Link>
            <Link to="/events">Events</Link>
            <Link to="/gear">Gear</Link>
            <Link to="/hiking-buddy">Hiking Buddy</Link>
            <Link to="/blog-posts">Blog</Link>
          </div>
        </div>
        <div className="third">
          <h3>Contact</h3>
          <div className="info">
            <div className="inline">
              <MdLocationPin />
              <p>Prishtine, Kosove</p>
            </div>
            <div className="inline">
              <MdOutlineEmail />
              <p>hello@kosovahike.com</p>
            </div>
            <div className="inline">
              <MdOutlineSmartphone />
              <p>+383 44 111 111</p>
            </div>
          </div>
          <div className="newsletter">
            <h4>Subscribe</h4>
            <form className="email" onSubmit={handleNewsletterSubmit}>
              <span>
                <MdOutlineEmail />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Duke dërguar...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="line"></div>

      <div className="f-bottom">
        <div className="left">
          <p>© 2024 KosovaHike - Hiking & Outdoor</p>
        </div>
        <div className="right">
          <p>Contact Us</p>
          <span>|</span>
          <p>Privacy Policy</p>
          <span>|</span>
          <p>Terms of Use</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
