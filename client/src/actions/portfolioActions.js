import axios from 'axios';
import { GET_TICKERS, ADD_TICKER } from './types';

var headers = {
  'xauth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmFiOGY1ZjdjNmYzMTA4NzgxOWQzMzYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM4MDM5MjM1fQ.51vdkVtopOb1oMvdW64RkQkzxA54Y0Mv4y4P7tTjDMI'
}

export const getTickers = () => dispatch => {
  axios.get('/portfolio', {headers: headers}).then(res =>
    console.log(
   	dispatch({
      type: GET_TICKERS,
      payload: res.data.tickers
    })
    )
  );
};

export const addTicker = ticker => dispatch => {
  axios.post('/portfolio/add', ticker, {headers: headers}).then(res =>
    console.log(
    dispatch({
      type: ADD_TICKER,
      payload: res.data
    })
    )
  );
};
