import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

 function get_countrycode1(state = initState, action) {
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

function foregotpassword(state = initState, action) {
  switch (action.type) {
    case actionTypes.FOREGOT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.FOREGOT_SUCCESS:
     
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.FOREGOT_FAILED:
    
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


export{get_countrycode1,foregotpassword};