import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const get_country = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.COUNTRY));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.COUNTRY_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.COUNTRY_FAILED, error))
      );
  };
};


const foregotpassword = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.FOREGOT));
    return post(data)
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.FOREGOT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.FOREGOT_FAILED, error))
      );
  };
};



export { get_country ,foregotpassword};