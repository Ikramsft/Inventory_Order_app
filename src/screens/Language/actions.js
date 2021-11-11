import * as actionTypes from "./actionTypes";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const select_lang = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.LANG));


    dispatch(
      actionHandlers.handleResponse(actionTypes.LANG_SUCCESS, data)
    );

  };
};

const logout = (data) => {

  return dispatch => {
    dispatch(actionHandlers.tryHandle(actionTypes.LOGOUT));
    return post(data)
      // .then(response => response.json())
      .then(json => {


        dispatch(
          actionHandlers.handleResponse(actionTypes.LOGOUT_SUCCESS, json)
        );
      })
      .catch(error =>
        dispatch(actionHandlers.handleError(actionTypes.LOGOUT_FAILED, error))
      );
  };
};



export { select_lang, logout };