import axios from 'axios';
import { config } from '../config';

class AuthService {

  signUp(payload) {
    const url = `${config.BASE_URL}/users`;
    console.log('SignUp URL:', url);
    console.log('SignUp payload:', payload);
    return axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  login(payload) {
    const url = `${config.BASE_URL}/login`;
    console.log('Login URL:', url);
    console.log('Login payload:', payload);
    return axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  addReview(payload, trailId, userId) {
    const url = `${config.BASE_URL}/trails/${trailId}/reviews/${userId}`;
    return axios.post(url, payload);
  }

  editReview(payload, trailId, userId) {
    const url = `${config.BASE_URL}/trails/${trailId}/reviews/${userId}`;
    return axios.put(url, payload);
  }

  deleteReview(trailId, userId) {
    const url = `${config.BASE_URL}/trails/${trailId}/reviews/${userId}`;
    return axios.delete(url);
  }

  updateUser(payload, userId) {
    const url = `${config.BASE_URL}/users/${userId}`;
    return axios.put(url, payload);
  }

  searchHikeBuddies(payload) {
    const url = `${config.BASE_URL}/hikeBuddies/search`;
    return axios.post(url, payload);
  }
  
  getUser(userId) {
    const url = `${config.BASE_URL}/users/${userId}`;
    return axios.get(url);
  }

  uploadProfilePicture(userId, payload) {
    const url = `${config.BASE_URL}/users/${userId}/profilePicture`;
    console.log('Uploading profile picture to:', url);
    console.log('Payload keys:', Object.keys(payload));
    
    return axios.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000, // 30 seconds timeout
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    }).catch((error) => {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null,
        request: error.request ? 'Request made but no response' : 'No request made'
      });
      throw error;
    });
  }  

}

export default new AuthService();
