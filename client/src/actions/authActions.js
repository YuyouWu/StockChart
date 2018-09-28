import axios from 'axios';
import { LOGIN, REGISTER, LOGOUT, SET_CURRENT_USER } from './types';

var headers = {
  'xauth': localStorage.getItem('jwtToken')
}

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

export const logoutAction = () => (dispatch, getState) => {
  localStorage.removeItem('jwtToken');
  return(
    axios.delete('/users/me/token', {headers: headers}).then(res =>{
        dispatch({
          type: LOGOUT,
          payload: res.data
        })
      }
    )
  )
};

export const setCurrentUser = () => dispatch => {
  return(
    axios.get('/users/me', {headers: headers}).then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      })
    )
  )
};


