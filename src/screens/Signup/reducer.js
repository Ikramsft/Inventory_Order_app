import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

 function get_countrycode(state = initState, action) {
  switch (action.type) {
    case actionTypes.COUNTRY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.COUNTRY_SUCCESS:
     
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.COUNTRY_FAILED:
    
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

function do_signup(state = initState, action) {
  switch (action.type) {
    case actionTypes.SIGNUP:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SIGNUP_SUCCESS:
     
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SIGNUP_FAILED:
    
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


export{get_countrycode,do_signup};