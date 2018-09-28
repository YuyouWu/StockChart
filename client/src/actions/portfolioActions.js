import axios from 'axios';
import { GET_TICKERS, ADD_TICKER,  GET_ERRORS } from './types';

var headers = {
  'xauth': localStorage.getItem('jwtToken')
}

export const getTickers = () => (dispatch,getState) => {
  var header = {
    'xauth': localStorage.getItem('jwtToken')
  }
  return(
    axios.get('/portfolio', {headers: header}).then(res =>
     	dispatch({
        type: GET_TICKERS,
        payload: res.data.tickers
      })
    ).catch(err =>
      dispatch({
        type: GET_ERRORS,
          payload: err.response.data
      })
    )
  )
};

export const addTicker = ticker => dispatch => {
  axios.post('/portfolio/add', ticker, {headers: headers}).then(res =>
    dispatch({
      type: ADD_TICKER,
      payload: res.data
    })
  );
};
