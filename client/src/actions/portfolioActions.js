import axios from 'axios';
import { GET_TICKERS, ADD_TICKER,  GET_ERRORS, GET_CURRENT_PRICE } from './types';

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

export const getCurrentPrice = ticker => dispatch => {
  return (
    axios.get('/portfolio/' + ticker +'/price').then(res =>
      dispatch({
        type: GET_CURRENT_PRICE,
        payload: res.data
      })
    )
  )
};
