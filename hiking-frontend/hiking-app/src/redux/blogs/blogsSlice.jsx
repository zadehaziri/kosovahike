import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const response = await axios.get(`http://localhost:5000/blogs`);
  return response.data;
});
export const fetchBlogsByUser = createAsyncThunk(
  'blogs/fetchBlogsByUser',
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/blogs/user/${userId}`
    );
    return response.data;
  }
);

export const fetchBlogById = createAsyncThunk(
  'blogs/fetchBlogById',
  async (blogId) => {
    const response = await axios.get(`http://localhost:5000/blogs/${blogId}`);
    console.log(response);
    return response.data;
  }
);

export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async ({ authorId, blogData }) => {
    const response = await axios.post(
      `http://localhost:5000/blogs/${authorId}`,
      blogData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async ({ blogId, authorId }) => {
    await axios.delete(`/api/blogs/${blogId}/${authorId}`);
    return blogId;
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ blogId, updatedFields }) => {
    const response = await axios.put(`/api/blogs/${blogId}`, updatedFields);
    return response.data;
  }
);

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  singleBlog: null,
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setSingleBlog: (state, action) => {
      state.singleBlog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.singleBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addBlog.fulfilled, (state, action) => {
        const newBlog = action.payload.data;
        state.blogs.push(newBlog);
        state.loading = false;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        // Update the blog in the state with the updated data
        state.loading = false;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBlogsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogsByUser.fulfilled, (state, action) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlogsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  fetchBlogsStart,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  clearError,
  setSingleBlog,
} = blogsSlice.actions;

export default blogsSlice.reducer;
