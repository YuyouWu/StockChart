import { combineReducers } from 'redux';
import authReducer from './authReducer';
import portfolioReducer from './portfolioReducer';
import chartPrefReducer from './chartPrefReducer';

export default combineReducers({
  auth: authReducer,
  portolio: portfolioReducer,
  chartPref: chartPrefReducer
});
