import axios from 'axios';
import { 
  GET_TICKERS, 
  GET_ONE_TICKER,
  ADD_TICKER, 
  DELETE_TICKER, 
  EDIT_QUANTITY,
  UPDATE_INDEX, 
  GET_ALL_PORTFOLIO,
  CREATE_NEW_PORTFOLIO,
  DELETE_PORTFOLIO,
  GET_ERRORS, 
  GET_CURRENT_PRICE, 
  GET_COMPANY_STAT, 
  GET_COMPANY_FINANCIAL, 
  GET_COMPANY_FINANCIAL_ANNUAL, 
  GET_COMPANY_NEWS } from './types';

var headers = {
  'xauth': localStorage.getItem('jwtToken')
}

export const getTickers = () => (dispatch,getState) => {
  return(
    axios.get('/api/portfolio', {headers: headers}).then(res =>
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

export const getOneTicker = tickerId => (dispatch,getState) => {
  return(
    axios.get('/api/portfolio/' + tickerId, {headers: headers}).then(res =>
      dispatch({
        type: GET_ONE_TICKER,
        payload: res.data
      })
    )
  )
};

export const addTicker = ticker => dispatch => {
  return(
    axios.post('/api/portfolio/add', ticker, {headers: headers}).then(res =>
      dispatch({
        type: ADD_TICKER,
        payload: res.data
      })
    )
  )
};

export const deleteTicker = tickerId => dispatch => {
  return(
    axios.delete('/api/portfolio/' + tickerId, {headers: headers}).then(res =>
      dispatch({
        type: DELETE_TICKER,
        payload: res.data
      })
    )
  )
};

export const editQuantity = ticker => dispatch => {
  return(
    axios.patch('/api/editQuantity/', ticker, {headers: headers}).then(res =>
      dispatch({
        type: EDIT_QUANTITY,
        payload: res.data
      })
    )
  )
};

export const updateIndex = (ticker) => dispatch => {
  return(
    axios.patch('/api/portfolio/index', ticker, {headers: headers}).then(res =>
      dispatch({
        type: UPDATE_INDEX,
        payload: res.data
      })
    )
  )
};

export const getAllPortfolio = () => dispatch => {
  return (
    axios.get('/api/allPortfolio', {headers: headers}).then(res =>
      dispatch({
        type: GET_ALL_PORTFOLIO,
        payload: res.data
      })
    )
  )
};

export const newPortfolio = (portfolio) => dispatch => {
  return (
    axios.post('/api/newPortfolio', portfolio, {headers: headers}).then(res =>
      dispatch({
        type: CREATE_NEW_PORTFOLIO,
        payload: res.data
      })
    )
  )
};

export const deletePortfolio = (portfolioID) => dispatch => {
  return (
    axios.delete('/api/deletePortfolio/' + portfolioID, {headers: headers}).then(res =>
      dispatch({
        type: DELETE_PORTFOLIO,
        payload: res.data
      })
    )
  )
};


export const getCurrentPrice = ticker => dispatch => {
  return (
    axios.get('https://api.iextrading.com/1.0/stock/' + ticker +'/quote').then(res =>
      dispatch({
        type: GET_CURRENT_PRICE,
        payload: res.data
      })
    )
  )
};

export const getCompanyStat = ticker => dispatch => {
  return (
    axios.get('https://api.iextrading.com/1.0/stock/' + ticker +'/stats').then(res =>
      dispatch({
        type: GET_COMPANY_STAT,
        payload: res.data
      })
    )
  )
};

export const getCompanyFinancial = ticker => dispatch => {
  return (
    axios.get('https://api.iextrading.com/1.0/stock/' + ticker +'/financials').then(res =>
      dispatch({
        type: GET_COMPANY_FINANCIAL,
        payload: res.data
      })
    )
  )
};

export const getCompanyFinancialAnnual = ticker => dispatch => {
  return (
    axios.get('https://api.iextrading.com/1.0/stock/' + ticker +'/financials?period=annual').then(res =>
      dispatch({
        type: GET_COMPANY_FINANCIAL_ANNUAL,
        payload: res.data
      })
    )
  )
};


export const getCompanyNews = ticker => dispatch => {
  return (
    axios.get('https://api.iextrading.com/1.0/stock/' + ticker +'/news').then(res =>
      dispatch({
        type: GET_COMPANY_NEWS,
        payload: res.data
      })
    )
  )
};