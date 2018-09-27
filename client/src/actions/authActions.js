import axios from 'axios';
import { LOGIN, REGISTER } from './types';

export const loginAction = user => dispatch => {
  axios.post('/portfolio', user).then(res =>
    console.log(    
   	dispatch({
      type: LOGIN,
      payload: res.headers.xauth
    }),
	)
  );
};

export const register = user => dispatch => {
  axios.post('/users', user).then(res =>
    dispatch({
      type: REGISTER,
      payload: res.data
    })
  );
};
