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


const do_signup = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.SIGNUP));
    return post(data)
      // .then(response => response.json())
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.SIGNUP_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.SIGNUP_FAILED, error))
      );
  };
};



export { get_country ,do_signup};