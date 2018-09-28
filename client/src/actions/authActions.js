import axios from 'axios';
import { LOGIN, REGISTER, LOGOUT } from './types';

export const loginAction = user => (dispatch, getState) => {
  return(
    axios.post('/users/login', user).then(res =>{
        localStorage.setItem('jwtToken', res.headers.xauth);
        dispatch({
          type: LOGIN,
          payload: res.headers.xauth
        })
      }
    )
  )
};

export const logoutAction = user => (dispatch, getState) => {
  return(
    axios.delete('/users/me/token', localStorage.getItem('jwtToken')).then(res =>{
        localStorage.removeItem('jwtToken'),
        dispatch({
          type: LOGOUT,
          payload: res.data
        })
      }
    )
  )
};

export const register = user => dispatch => {
  axios.post('/users', user).then(res =>
    dispatch({
      type: REGISTER,
      payload: res.data
    })
  );
};
