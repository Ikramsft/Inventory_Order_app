import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function getOrders_list(state = initState, action) {
  switch (action.type) {
    case actionTypes.ORDERS:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.ORDERS_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.ORDERS_FAILED:

      return {
        ...state,
        isLoading: false,
        error: action.payload.data
      };
      break;

    default:
      return state;
  }
}

function getOrders_byid(state = initState, action) {
  switch (action.type) {
    case actionTypes.ORDER:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.ORDER_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.ORDER_FAILED:

      return {
        ...state,
        isLoading: false,
        error: action.payload.data
      };
      break;

    default:
      return state;
  }
}

function setorderstatus(state = initState, action) {
  switch (action.type) {
    case actionTypes.SETSTATE:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SETSTATE_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SETSTATE_FAILED:

      return {
        ...state,
        isLoading: false,
        error: action.payload.data
      };
      break;

    default:
      return state;
  }
}

export { getOrders_list, getOrders_byid, setorderstatus };