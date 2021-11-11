import * as actionTypes from "./actionType";

const initState = {
  isLoading: false,
  data: {},
  error: false,
};

function getdashboarddata(state = initState, action) {
  switch (action.type) {
    case actionTypes.DASHBOARDDATA:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case actionTypes.DASHBOARDDATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false,
      };

      break;
    case actionTypes.DASHBOARDDATA_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
      break;

    default:
      return state;
  }
}

function postIosReciept(state = initState, action) {
  switch (action.type) {
    case actionTypes.RECIEPT:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case actionTypes.RECIEPT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false,
      };

      break;
    case actionTypes.RECIEPT_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
      break;

    default:
      return state;
  }
}

function verifyReciept(state = initState, action) {
  switch (action.type) {
    // case actionTypes.VERIFYRECIEPT:
    //   return {
    //     ...state,
    //     isSubscriber: state.isSubscriber,
    //     isLoading: true,
    //   };
    //   break;
    case actionTypes.VERIFYRECIEPT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verifyRecieptCallback: true,
        isSubscriber: action.payload.data.status,
        error: false,
      };
    //   break;
    // case actionTypes.VERIFYRECIEPT_FAILED:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     isSubscriber: state.isSubscriber,
    //     error: action.payload.data,
    //   };
    //   break;

    default:
      return state;
  }
}

function getoutstock(state = initState, action) {
  switch (action.type) {
    case actionTypes.OUTSTOCK:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case actionTypes.OUTSTOCK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false,
      };

      break;
    case actionTypes.OUTSTOCK_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
      break;

    default:
      return state;
  }
}

function getnotifications(state = initState, action) {
  switch (action.type) {
    case actionTypes.GETALERTS:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case actionTypes.GETALERTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false,
      };

      break;
    case actionTypes.GETALERTS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload.data,
      };
      break;

    default:
      return state;
  }
}

export {
  getdashboarddata,
  getoutstock,
  getnotifications,
  postIosReciept,
  verifyReciept,
};
