import * as actionTypes from './actionTypes';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function language(state = initState, action) {
  switch (action.type) {
    case actionTypes.LANG:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.LANG_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.LANG_FAILED:

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
function logout_user(state = initState, action) {
  switch (action.type) {
    case actionTypes.LOGOUT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.LOGOUT_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.LOGOUT_FAILED:

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




export { logout_user, language };