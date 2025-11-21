import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearLoggedUser } from '../../redux/users/loggedUserSlice';

import avatar from '../../assets/images/avatar.jpg';

import './User.scss';
function User() {
  const user = useSelector((state) => state.loggedUser.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(clearLoggedUser());
    navigate('/login');
  };
  return (
    <div className='user'>
      <img className='avatar' src={avatar} alt='user' />
      <span>Welcome, {user.firstName}</span>
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
}

export default User;
