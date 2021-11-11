import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const saveuser = (data) => {
  console.log("params");
  console.log(data);
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.SAVEUSER));
    return post(data)
      .then((json) => {
        console.log("response from server ");
        console.log(json);
        dispatch(
          actionHandlers.handleResponse(actionTypes.SAVEUSER_SUCCESS, json)
        );
      })
      .catch((error) => {
        console.log("Error from server ");
        console.log(error);
        dispatch(
          actionHandlers.handleError(actionTypes.SAVEUSER_FAILED, error)
        );
      });
  };
};

export { saveuser };
