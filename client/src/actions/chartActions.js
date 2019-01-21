import axios from 'axios';
import { NEW_DRAWING, LOAD_PREF } from './types';

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
