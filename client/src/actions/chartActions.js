import axios from 'axios';
import { NEW_DRAWING, LOAD_PREF, UPDATE_MACD_PREF, UPDATE_RSI_PREF, UPDATE_WIN_SIZE, TOGGLE_MA, TOGGLE_CHART_STYLE } from './types';

var headers = {
  'xauth': localStorage.getItem('jwtToken')
}

export const newDrawingAction = drawing => dispatch => {
  return(
    axios.post('/api/newDrawing', drawing,  {headers: headers}).then(res => 
      dispatch({
        type: NEW_DRAWING,
        payload: res.data
      })
    )
  )
};

export const loadChartPref = () => dispatch => {
  return (
    axios.get('/api/chartpref', {headers: headers}).then(res =>
      dispatch({
        type: LOAD_PREF,
        payload: res.data
      })
    )
  )
};

export const updateMACDPref = pref => dispatch => {
  return (
    axios.post('/api/macd', pref, {headers: headers}).then(res =>
      dispatch({
        type: UPDATE_MACD_PREF,
        payload: res.data
      })
    )
  )
};

export const updateRSIPref = pref => dispatch => {
  return (
    axios.post('/api/rsi', pref, {headers: headers}).then(res =>
      dispatch({
        type: UPDATE_RSI_PREF,
        payload: res.data
      })
    )
  )
};

export const updateWinSize = pref => dispatch => {
  return (
    axios.post('/api/windowSize', pref, {headers: headers}).then(res =>
      dispatch({
        type: UPDATE_WIN_SIZE,
        payload: res.data
      })
    )
  )
};

export const toggleMA = pref => dispatch => {
  return (
    axios.post('/api/toggleMA', pref, {headers: headers}).then(res =>
      dispatch({
        type: TOGGLE_MA,
        payload: res.data
      })
    )
  )
};

export const toggleChartStyle = pref => dispatch => {
  return (
    axios.post('/api/toggleChartStyle', pref, {headers: headers}).then(res =>
      dispatch({
        type: TOGGLE_CHART_STYLE,
        payload: res.data
      })
    )
  )
};
