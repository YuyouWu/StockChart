import { NEW_DRAWING, LOAD_PREF } from '../actions/types';

var initialState = {
  tickers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NEW_DRAWING:
      return {
        ...state
      };
    case LOAD_PREF:
      return {
        ...state
      };
    default:
      return state;
  }
}

