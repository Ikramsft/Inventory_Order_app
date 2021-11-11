import * as actionTypes from './actionType';

const initState = {
  isLoading: false,
  data: {},
  error: false
};

function getMaster(state = initState, action) {
  switch (action.type) {
    case actionTypes.MASTERCAT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.MASTERCAT_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.MASTERCAT_FAILED:

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

function getsub1(state = initState, action) {
  switch (action.type) {
    case actionTypes.SUB1:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SUB1_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SUB1_FAILED:

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


function getsub2(state = initState, action) {
  switch (action.type) {
    case actionTypes.SUB2:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SUB2_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SUB2_FAILED:

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



function getsupplier(state = initState, action) {
  switch (action.type) {
    case actionTypes.SUPPLIER:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SUPPLIER_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SUPPLIER_FAILED:

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

function getlocation(state = initState, action) {
  switch (action.type) {
    case actionTypes.LOCATION:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.LOCATION_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.LOCATION_FAILED:

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


function getunit(state = initState, action) {
  switch (action.type) {
    case actionTypes.UNIT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.UNIT_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.UNIT_FAILED:

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



function getsize(state = initState, action) {
  switch (action.type) {
    case actionTypes.SIZE:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.SIZE_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.SIZE_FAILED:

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



function getcolor(state = initState, action) {
  switch (action.type) {
    case actionTypes.COLOR:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.COLOR_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.COLOR_FAILED:

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

function delcatagory(state = initState, action) {
  switch (action.type) {
    case actionTypes.DELETECAT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.DELETECAT_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.DELETECAT_FAILED:

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

function addcatagory(state = initState, action) {
  switch (action.type) {
    case actionTypes.ADDCAT:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.ADDCAT_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.ADDCAT_FAILED:

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



function generatestocknumber(state = initState, action) {
  switch (action.type) {
    case actionTypes.GENERATESTOCKID:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.GENERATESTOCKID_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.GENERATESTOCKID_FAILED:

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


function insertinventory(state = initState, action) {
  switch (action.type) {
    case actionTypes.INSERTINVETORY:

      return {
        ...state,
        isLoading: true
      };
      break;
    case actionTypes.INSERTINVETORY_SUCCESS:

      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        error: false
      };

      break;
    case actionTypes.INSERTINVETORY_FAILED:

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
  getMaster,
  getsub1,
  getsub2,
  getsupplier,
  getlocation,
  getunit,
  getsize,
  getcolor,
  delcatagory,
  addcatagory,
  generatestocknumber,
  insertinventory
};