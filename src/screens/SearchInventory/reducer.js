import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function search_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.SEARCH:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SEARCH_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SEARCH_FAILED:

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


function delete_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.DELETESTOCK:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.DELETESTOCK_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.DELETESTOCK_FAILED:

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


function summary_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.SUMMARY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SUMMARY_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SUMMARY_FAILED:

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



function qty_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.QTY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.QTY_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.QTY_FAILED:

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


function get_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.GETINVENTORY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.GETINVENTORY_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.GETINVENTORY_FAILED:

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

function update_inventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.UPDATESUMMARY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.UPDATESUMMARY_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.UPDATESUMMARY_FAILED:

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
function check_barcode(state = initState, action) {
  switch (action.type) {
    case actionTypes.CHECKBARCODE:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.CHECKBARCODE_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.CHECKBARCODE_FAILED:

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
export {
  search_inventory,
  delete_inventory,
  summary_inventory,
  qty_inventory,
  get_inventory,
  update_inventory,
  check_barcode
};