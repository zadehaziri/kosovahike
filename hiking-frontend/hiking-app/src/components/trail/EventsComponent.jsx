import { useEffect, useState } from "react";
import TrailsSlider from "../slider/TrailsSlider";
import TrailCard from "./TrailCard";
import axios from "axios";
import "./EventsComponent.scss";
import { config } from "../../config";
import FavoriteTrailsContainer from "./FavoriteTrailsContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";

import React from "react";
import Button from "../Shared/Button/Button";

const EventsComponent = () => {
  return (
    <div className="parent-div">
        <div className="left-content">
        <li>
        <div className="main-div">
          <div className="image-placeholder">
            <img
              className="img-box"
              src="http://themes.framework-y.com/alpins/wp-content/uploads/2019/04/image-5.jpg"
              alt=""
            ></img>
            <div className="information-box">
              <div className="information-flex">
                <span className="information-span text">Days</span>
                <span className="information-span">1</span>
              </div>
              <div className="information-flex">
                <span className="information-span text">Group size</span>
                <span className="information-span">2</span>
              </div>
              <div className="information-flex">
                <span className="information-span text">Difficulty</span>
                <span className="information-span">3</span>
              </div>
            </div>
          </div>
          <div className="under-information-box">
            <h1 className="title-class">Bianco Excursion</h1>
            <p className="paragraph-class">
              Monte bianco is a mountain located in the deep nature and rivers.
            </p>
            <div className="location-class">
            <FontAwesomeIcon className="icon-class" icon={faMapLocation} />
            <span>Malet e Sharrit, Prizren
            </span>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div className="main-div">
          <div className="image-placeholder">
            <img
              className="img-box"
              src="http://themes.framework-y.com/alpins/wp-content/uploads/2019/04/image-5.jpg"
              alt=""
            ></img>
            <div className="information-box">
              <div className="information-flex">
                <span className="information-span text">Days</span>
                <span className="information-span">1</span>
              </div>
              <div className="information-flex">
                <span className="information-span text">Group size</span>
                <span className="information-span">2</span>
              </div>
              <div className="information-flex">
                <span className="information-span text">Difficulty</span>
                <span className="information-span">3</span>
              </div>
            </div>
          </div>

          <div className="under-information-box">
            <h1 className="title-class">Bianco Excursion</h1>
            <p className="paragraph-class">
              Monte bianco is a mountain located in the deep nature and rivers.
            </p>
            <div className="location-class">
            <FontAwesomeIcon className="icon-class" icon={faMapLocation} />
            <span>Malet e Sharrit, Prizren
            </span>
            </div>
          </div>
        </div>
      </li>
        </div>
        <div className="right-content">
        <div className="event-title">LATEST TRIPS</div>
        <div className="event-undertitle">Explore the unexplored world</div>
        <div className="event-description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, porro molestias. Maxime doloremque enim ducimus. Perferendis similique voluptatem repellat praesentium, esse est inventore? Molestias laborum reiciendis dolor quasi rerum blanditiis!</div>
        <div className="join-event-btn">
            <Button className="basic-btn green">Join Event</Button>
        </div>
        </div>
    </div>
  );
};

export default EventsComponent;