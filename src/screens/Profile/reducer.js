import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function save_user(state = initState, action) {
  switch (action.type) {
    case actionTypes.SAVEUSER:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SAVEUSER_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SAVEUSER_FAILED:

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


export { save_user };