import { LOGIN, REGISTER, LOGOUT } from '../actions/types';

var initialState = {
  token: ''

};
export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload
      };
    case LOGOUT:
      return {
        ...state
      };
    case REGISTER:
      return {
        ...state
      };
    default:
      return state;
  }
}

