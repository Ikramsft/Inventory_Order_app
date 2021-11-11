import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const doLogin = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.LOGIN));
    return post(data)
      .then((json) => {
        dispatch(
          actionHandlers.handleResponse(actionTypes.LOGIN_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(actionHandlers.handleError(actionTypes.LOGIN_FAILED, error))
      );
  };
};

const get_user_data = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.USERDATA));
    return post(data)
      .then((json) => {
        dispatch(
          actionHandlers.handleResponse(actionTypes.USERDATA_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(actionHandlers.handleError(actionTypes.USERDATA_FAILED, error))
      );
  };
};

export { doLogin, get_user_data };
