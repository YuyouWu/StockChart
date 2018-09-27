import { GET_TICKERS, ADD_TICKER } from '../actions/types';

const initialState = {
  tickers: '',
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TICKERS:
      return {
        ...state,
        items: [action.payload, ...state.tickers]
      };
    case ADD_TICKER:
      return {
        ...state,
        items: [action.payload, ...state.tickers]
      };
    default:
      return state;
  }
}

