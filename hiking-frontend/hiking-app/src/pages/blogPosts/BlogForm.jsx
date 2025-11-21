import React, { useState, useEffect } from 'react';

import { Form, Input, Button, Upload } from 'antd';
import { GoPlusCircle } from 'react-icons/go';

import './BlogForm.scss';
import { addBlog, fetchBlogs } from './../../redux/blogs/blogsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BlogForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.loggedUser.user._id);
  const author = useSelector((state) => state.loggedUser.user);
  const navigate = useNavigate();
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      if (fileList.length > 3) {
        setFileList([...fileList, file]);
        return false;
      }
    },
    fileList,
  };

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const { title, content } = values;
    if (!values.title || !values.content) {
      console.log('Title or content is empty');
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    formData.append('authorName', `${author.firstName} ${author.lastName}`);

    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      await dispatch(addBlog({ authorId: userId, blogData: formData }));
      navigate('/blog-posts');
    } catch (error) {
      console.error('Failed to add blog:', error);
    }
  };
  return (
    <div className='blog--post-form'>
      <div className='header'>
        <h3 className='title '>
          Nature's <span>Narratives</span>
        </h3>
      </div>
      <div className='write'>
        <Form onFinish={handleSubmit} form={form} className='writeForm'>
          <div className='writeFormGroup'>
            <Upload
              maxCount={3}
              multiple
              {...props}
              onChange={handleFileChange}
              fileList={fileList}
            >
              <GoPlusCircle className='writeIcon ' />
            </Upload>
            <Form.Item name='title'>
              <Input
                variant='borderless'
                className='writeInput'
                placeholder='Title'
                type='text'
                autoFocus
              />
            </Form.Item>
          </div>
          <div className='writeFormGroup'>
            <Form.Item name='content'>
              <Input.TextArea
                style={{ minHeight: '100dvh' }}
                variant='borderless'
                className='writeInput writeText'
                placeholder='Tell your story...'
                type='text'
              />
            </Form.Item>
          </div>

          <Button className='writeSubmit' type='primary' htmlType='submit'>
            Publish
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BlogForm;
