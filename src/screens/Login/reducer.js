import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function login(state = initState, action) {
  switch (action.type) {
    case actionTypes.LOGIN:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.LOGIN_SUCCESS:
     
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.LOGIN_FAILED:
    
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


function user_data(state = initState, action) {
  switch (action.type) {
    case actionTypes.USERDATA:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.USERDATA_SUCCESS:
     
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.USERDATA_FAILED:
    
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


export{login,user_data};