import React from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import ChatHelper from "../../components/ChatHelper/chathelper";
import blogImage1 from '../../assets/images/blog-image1.jpg';

import './BlogPosts.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchBlogs } from './../../redux/blogs/blogsSlice';
import { useDispatch } from 'react-redux';
import { CiCalendar, CiEdit } from 'react-icons/ci';

const BlogPosts = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  console.log(blogs);
  const filteredBlogPosts =
    Array.isArray(blogs) &&
    blogs?.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);
  return (
    <div className='blogPosts--container'>
      <div className='header'>
        <h3 className='title animate-from-left'>
          Nature's <span>Narratives</span>
        </h3>
        <form className='search'>
          <input
            type='text'
            className='search__field'
            placeholder='Search for a blog .... '
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MdOutlineSearch fontSize='2rem' />
        </form>
      </div>
      <div className='main'>
        <ul className='list'>
          {searchQuery === ''
            ? Array.isArray(blogs) &&
              blogs?.map((post, index) => (
                <li key={index} className={`list-item item-${index + 1}`}>
                  <Link to={`/blog-posts/${post._id}`} className='link'>
                    <img
                      className='list-item--image'
                      src={
                        !post?.images || post?.images.length === 0
                          ? blogImage1
                          : post?.images[0]?.name?.startsWith('http')
                          ? post.images[0].name
                          : `http://localhost:5000/pastTrailimages/${post?.images[0]?.name}`
                      }
                      alt='My Blog'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blogImage1;
                      }}
                    />
                    <div className='blog-info'>
                      <div className='blog-data'>
                        {/* <span>{post.date}</span> */}
                        <span>
                          <CiCalendar fontWeight={800} /> 26 March, 2024
                        </span>
                        <span>
                          <CiEdit fontWeight={800} /> by {post.authorName}
                        </span>
                      </div>
                      <h5>
                        <span className='blog-title'>{post.title}</span>
                      </h5>
                    </div>
                  </Link>
                </li>
              ))
            : filteredBlogPosts?.map((post, index) => (
                <li key={index} className={`list-item item-${index + 1}`}>
                  <img
                    className='list-item--image'
                    src={
                      !post?.images || post?.images.length === 0
                        ? blogImage1
                        : post?.images[0]?.name?.startsWith('http')
                        ? post.images[0].name
                        : `http://localhost:5000/pastTrailimages/${post?.images[0]?.name}`
                    }
                    alt='My Blog'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = blogImage1;
                    }}
                  />
                  <div className='blog-info'>
                    <div className='blog-data'>
                      {/* <span>{post.date}</span> */}
                      <span>
                        <CiCalendar fontWeight={800} /> 26 March, 2024
                      </span>
                      <span>
                        <CiEdit fontWeight={800} /> by {post.authorName}
                      </span>
                    </div>
                    <h5>
                      <Link to='#' className='blog-title'>
                        {post.title}
                      </Link>
                    </h5>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      <ChatHelper/>
    </div>
  );
};

export default BlogPosts;
