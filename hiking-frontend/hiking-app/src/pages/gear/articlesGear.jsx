import React from "react";
import { Link } from "react-router-dom";
import "../../pages/gear/Gear.scss";
import ChatHelper from "../../components/ChatHelper/chathelper";
const RelatedArticles = () => {
  return (
    <div className="related-articles-container">
      <h2 className="related-articles-title">You Might Also Like</h2>
      <div className="cards">
        <article className="carda">
          <Link to="/blog-posts/660eaf4c8a8485b530a4ce74">
            <div className="card__image-container">
              <img
                src={require(".././gear/backpaking.jpg")}
                alt="best backpacking 2024"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Backpacking Gear of 2024
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eb12a8a8485b530a4d1ae">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/15/51/276634_24231_M2.jpg"
                alt="how to choose hiking shoes"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                How to Choose Hiking Shoes
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eb3798a8485b530a4d406">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/28/53/406866_25193_M2.jpg"
                alt="10 top trail running shoes review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                10 Best Trail Running Shoes
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eb5fd8a8485b530a4d9d0">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/27/50/396478_2910_M2.jpg"
                alt="10 top hiking boots review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                10 Best Hiking Boots of 2024
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eb80f8a8485b530a4dab6">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/27/82/399751_31740_M2.jpg"
                alt="best hiking shoes for women review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Hiking Shoes for Women of 2024
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eb9818a8485b530a4dba8">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/26/87/390249_4047_M2.jpg"
                alt="best trekking poles review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Trekking Poles of 2024
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660ea9d78a8485b530a4cd5e">
            <div className="card__image-container">
              <img
                src={require(".././gear/Hiking-Shorts-Mens.jpg")}
                alt="best hiking shorts review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Hiking Shorts
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660eba7c8a8485b530a4de1a">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/27/35/394994_3131_M2.jpg"
                alt="best wind jackets review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Windbreakers
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>

        <article className="carda">
          <Link to="/blog-posts/660ebc638a8485b530a4e0d2">
            <div className="card__image-container">
              <img
                src="https://d1nymbkeomeoqg.cloudfront.net/photos/28/79/409424_24227_M2.jpg"
                alt="best hiking pants review"
              />
            </div>
            <div className="card__content">
              <h3 className="card__title related_article_title">
                Best Hiking Pants of 2024
              </h3>
              <span className="card__info"></span>
            </div>
          </Link>
        </article>
      </div>
      <ChatHelper/>
    </div>
  );
};

export default RelatedArticles;
