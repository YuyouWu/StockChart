import { combineReducers } from 'redux';
import authReducer from './authReducer';
import portfolioReducer from './portfolioReducer';

export default combineReducers({
  auth: authReducer,
  portolio: portfolioReducer
});
