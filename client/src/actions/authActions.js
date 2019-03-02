import axios from 'axios';
import { LOGIN, REGISTER, LOGOUT, SET_CURRENT_USER, UPDATE_LOGIN_DATE, CHANGE_EMAIL, CHANGE_PASSWORD } from './types';

var headers = {
  'xauth': localStorage.getItem('jwtToken')
}

export const loginAction = user => dispatch => {
  return(
    axios.post('/api/users/login', user).then(res =>{
        localStorage.setItem('jwtToken', res.headers.xauth);
        dispatch({
          type: LOGIN,
          payload: res.data
        });
      }
    )
  )
};

export const logoutAction = () => (dispatch, getState) => {
  localStorage.removeItem('jwtToken');
  return(
    axios.delete('/api/users/me/token', {headers: headers}).then(res =>{
        dispatch({
          type: LOGOUT,
          payload: res.data
        })
      }
    )
  )
};

export const registerAction = newUser => (dispatch, getState) => {
  return(
    axios.post('/api/users', newUser).then(res =>{
        localStorage.setItem('jwtToken', res.headers.xauth);
        dispatch({
          type: REGISTER,
          payload: res.headers.xauth
        })
      }
    )
  )
};

export const setCurrentUser = () => dispatch => {
  return(
    axios.get('/api/users/me', {headers: headers}).then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      })
    )
  )
};

export const updateLoginDate = () => dispatch => {
  return(
    axios.post('/api/users/date', {}, {headers: headers}).then(res =>
      dispatch({
        type: UPDATE_LOGIN_DATE,
        payload: res.data
      })
    )
  )
};

export const changeEmail = (body) => dispatch => {
  return(
    axios.post('/api/changeEmail', body, {headers: headers}).then(res =>
      dispatch({
        type: CHANGE_EMAIL,
        payload: res.data
      })
    )
  )
};

export const changePassword = (body) => dispatch => {
  return(
    axios.post('/api/changePassword', body, {headers: headers}).then(res =>
      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data
      })
    )
  )
};
