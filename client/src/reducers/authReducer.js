import { LOGIN, REGISTER } from '../actions/types';

const initialState = {
  token: '',
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        items: [action.payload, ...state.token]
      };
    case REGISTER:
      return {
        ...state,
        items: [action.payload, ...state.token]
      };
    default:
      return state;
  }
}

