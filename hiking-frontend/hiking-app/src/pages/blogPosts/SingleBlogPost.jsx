import React, { useEffect } from 'react';

import blogBanner from '../../assets/images/blog-bg1.jpg';
import blogImage1 from '../../assets/images/blog-image1.jpg';
import blogImage2 from '../../assets/images/blog-image2.jpg';
import blogAsideImage from '../../assets/images/blog-aside.jpeg';
import { CiCalendar } from 'react-icons/ci';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ChatHelper from "../../components/ChatHelper/chathelper";
import { fetchBlogById, fetchBlogs } from './../../redux/blogs/blogsSlice';

import './SingleBlogPost.scss';

const SingleBlogPost = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const singleBlog = useSelector((state) => state.blogs.singleBlog);

  const sortedBlogPosts = useSelector((state) =>
    state.blogs.blogs?.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    })
  );

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  if (!singleBlog) {
    return <div>Loading...</div>;
  }

  const { title, content } = singleBlog;

  let splitIndex = -1;
  for (let i = Math.ceil(singleBlog?.content?.length / 2); i >= 0; i--) {
    if (content[i] === '\n\n') {
      splitIndex = i;
      break;
    }
  }

  if (splitIndex === -1) {
    for (
      let i = Math.ceil(singleBlog?.content?.length / 2);
      i < content?.length;
      i++
    ) {
      if (content[i] === '\n') {
        splitIndex = i;
        break;
      }
    }
  }
  const firstPart = singleBlog?.content?.slice(
    0,
    splitIndex !== -1 ? splitIndex : Math.ceil(singleBlog?.content?.length / 2)
  );
  const secondPart = singleBlog?.content?.slice(
    splitIndex !== -1
      ? splitIndex + 1
      : Math.ceil(singleBlog?.content?.length / 2)
  );

  const renderContentWithLineBreaks = (content) => {
    const paragraphs = content?.split('\n');

    return paragraphs?.map((paragraph, index) => (
      <React.Fragment key={index}>
        <p>{paragraph}</p>

        {index < paragraphs?.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className='singleBlog--container'>
      <div className='header'>
        <h3 className='title '>
          Nature's <span>Narratives</span>
        </h3>
      </div>
      {singleBlog && (
        <div className='single-blog'>
          <div className='blog-banner'>
            {/* <img
            src={
              singleBlog?.images?.length === 0
                ? blogBanner
                : `http://localhost:5000/pastTrailimages/${singleBlog?.images[0]?.name}`
            }
            alt='Blog Banner'
          /> */}
            {singleBlog && singleBlog.images && singleBlog.images.length > 0 ? (
              <img
                src={
                  singleBlog.images[0]?.name?.startsWith('http')
                    ? singleBlog.images[0].name
                    : `http://localhost:5000/pastTrailimages/${singleBlog.images[0]?.name}`
                }
                alt='Blog Banner'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = blogBanner;
                }}
              />
            ) : (
              <img src={blogBanner} alt='Blog Banner' />
            )}
          </div>
          <div className='blog-content'>
            <article>
              <span className='blog-date'>
                <CiCalendar fontWeight={800} /> {singleBlog.date}
              </span>
              <h2 className='blog-title'>{title}</h2>
              <div className='blog-text'>
                {renderContentWithLineBreaks(firstPart)}
                <br />
                <br />
                <div className='middleImage-container'>
                  <div className='image-div'>
                    <img
                      src={
                        singleBlog?.images?.length > 1
                          ? singleBlog?.images[1]?.name?.startsWith('http')
                            ? singleBlog.images[1].name
                            : `http://localhost:5000/pastTrailimages/${singleBlog?.images[1]?.name}`
                          : blogImage1
                      }
                      alt='Blog'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blogImage1;
                      }}
                    />
                  </div>

                  <div className='image-div'>
                    <img
                      src={
                        singleBlog?.images?.length > 2
                          ? singleBlog?.images[2]?.name?.startsWith('http')
                            ? singleBlog.images[2].name
                            : `http://localhost:5000/pastTrailimages/${singleBlog?.images[2]?.name}`
                          : blogImage2
                      }
                      alt='Blog'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blogImage2;
                      }}
                    />
                  </div>
                </div>
                <br />

                {renderContentWithLineBreaks(secondPart)}
              </div>
            </article>
            <aside>
              <div className='aside-image'>
                <img src={blogAsideImage} alt='' />
              </div>
              <h2>Kosova Hike Blog</h2>
              <div className='latest-blogs'>
                <h2>Latest Blogs</h2>
                {sortedBlogPosts && sortedBlogPosts.length > 0 && (
                  <ul className='blogs'>
                    {React.Children.toArray(
                      sortedBlogPosts?.slice(0, 6).map((blog) => (
                        <li className='blogs-item' key={blog._id}>
                          <Link
                            to={`/blog-posts/${blog?._id}`}
                            className='link'
                          >
                            <span>{blog?.title}</span>
                            <img
                              src={
                                blog?.images?.length > 0
                                  ? blog.images[0]?.name?.startsWith('http')
                                    ? blog.images[0].name
                                    : `http://localhost:5000/pastTrailimages/${blog.images[0]?.name}`
                                  : blogImage2 // Use a default image if no images are available
                              }
                              alt='Blog'
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = blogImage2;
                              }}
                            />
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
      <ChatHelper/>
    </div>
  );
};

export default SingleBlogPost;
