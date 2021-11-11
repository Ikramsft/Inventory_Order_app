import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const getMaterCat = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.MASTERCAT));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.MASTERCAT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.MASTERCAT_FAILED, error))
      );
  };
};

const getsub1 = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SUB1));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SUB1_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SUB1_FAILED, error))
      );
  };
};

const getsub2 = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SUB2));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SUB2_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SUB2_FAILED, error))
      );
  };
};


const getsupplier = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SUPPLIER));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SUPPLIER_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SUPPLIER_FAILED, error))
      );
  };
};



const getlocation = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.LOCATION));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.LOCATION_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.LOCATION_FAILED, error))
      );
  };
};


const getunit = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.UNIT));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.UNIT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.UNIT_FAILED, error))
      );
  };
};


const delcat = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.DELETECAT));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.DELETECAT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.DELETECAT_FAILED, error))
      );
  };
};



const getsize = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SIZE));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SIZE_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SIZE_FAILED, error))
      );
  };
};


const getcolor = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.COLOR));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.COLOR_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.COLOR_FAILED, error))
      );
  };
};


const generatestockid = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.GENERATESTOCKID));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.GENERATESTOCKID_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.GENERATESTOCKID_FAILED, error))
      );
  };
};

const addcat = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.ADDCAT));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.ADDCAT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.ADDCAT_FAILED, error))
      );
  };
};

const insert_inventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.INSERTINVETORY));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.INSERTINVETORY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.INSERTINVETORY_FAILED, error))
      );
  };
};

export {
  getMaterCat,
  getsub1,
  getsub2,
  getsupplier,
  getlocation,
  getunit,
  getsize,
  getcolor,
  delcat,
  addcat,
  generatestockid,
  insert_inventory
};