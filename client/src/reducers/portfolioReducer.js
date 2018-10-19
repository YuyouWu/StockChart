import { GET_TICKERS, ADD_TICKER, GET_CURRENT_PRICE } from '../actions/types';

var initialState = {
  tickers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TICKERS:
      return {
        ...state,
        tickers: [action.payload, ...state.tickers]
      };
    case ADD_TICKER:
      return {
        ...state,
        tickers: [action.payload, ...state.tickers]
      };
    case GET_CURRENT_PRICE:
      return {
        ...state,
        tickers: [action.payload, ...state.tickers]
      };
    default:
      return state;
  }
}

