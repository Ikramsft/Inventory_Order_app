import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const getOrders = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.ORDERS));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.ORDERS_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.ORDERS_FAILED, error))
      );
  };
};

const getorderbyid = (data) => {
  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.ORDER));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.ORDER_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.ORDER_FAILED, error))
      );
  };
}

const setorderstatus = (data) => {
  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SETSTATE));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SETSTATE_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SETSTATE_FAILED, error))
      );
  };
}


export { getOrders, getorderbyid, setorderstatus };