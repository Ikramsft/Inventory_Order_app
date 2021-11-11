import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const searchinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SEARCH));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SEARCH_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SEARCH_FAILED, error))
      );
  };
};

const getoustckdata = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.OUTSTOCK));
    return post(data)
      .then((json) => {
        dispatch(
          actionHandlers.handleResponse(actionTypes.OUTSTOCK_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(actionHandlers.handleError(actionTypes.OUTSTOCK_FAILED, error))
      );
  };
};

const getDahboarddata = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.DASHBOARDDATA));
    return post(data)
      .then((json) => {
        console.log("json", json);
        dispatch(
          actionHandlers.handleResponse(actionTypes.DASHBOARDDATA_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(
          actionHandlers.handleError(actionTypes.DASHBOARDDATA_FAILED, error)
        )
      );
  };
};


const deleteinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.DELETESTOCK));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.DELETESTOCK_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.DELETESTOCK_FAILED, error))
      );
  };
};


const summaryinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SUMMARY));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SUMMARY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SUMMARY_FAILED, error))
      );
  };
};


const qtyinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.QTY));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.QTY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.QTY_FAILED, error))
      );
  };
};


const getinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.GETINVENTORY));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.GETINVENTORY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.GETINVENTORY_FAILED, error))
      );
  };
};



const updateinventory = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.UPDATESUMMARY));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.UPDATESUMMARY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.UPDATESUMMARY_FAILED, error))
      );
  };
};


const checkbarcode = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.CHECKBARCODE));
    return post(data)

      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.CHECKBARCODE_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.CHECKBARCODE_FAILED, error))
      );
  };
};



export {
  searchinventory,
  deleteinventory,
  summaryinventory,
  qtyinventory,
  updateinventory,
  getinventory,
  checkbarcode,
  getoustckdata,
  getDahboarddata,
};