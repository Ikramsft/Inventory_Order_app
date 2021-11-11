import * as actionTypes from "./actionType";
import { get, post } from "../../helpers/request";
import * as actionHandlers from "../../helpers/actionHandlers";

const getDahboarddata = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.DASHBOARDDATA));
    return post(data)
      .then((json) => {
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

const postIosReciept = (data) => {
 
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.RECIEPT));
    return post(data, 2)
      .then((json) => {
      
        dispatch(
          actionHandlers.handleResponse(actionTypes.RECIEPT_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(actionHandlers.handleError(actionTypes.RECIEPT_FAILED, error))
      );
  };
};

const verifyReciept = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.VERIFYRECIEPT));
    return post(data, 3)
      .then((json) => {
      
        dispatch(
          actionHandlers.handleResponse(actionTypes.VERIFYRECIEPT_SUCCESS, json)
        );
      })
      .catch((error) => {});
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

const getalerts = (data) => {
  return (dispatch) => {
    dispatch(actionHandlers.tryHandle(actionTypes.GETALERTS));
    return post(data)
      .then((json) => {
        dispatch(
          actionHandlers.handleResponse(actionTypes.GETALERTS_SUCCESS, json)
        );
      })
      .catch((error) =>
        dispatch(
          actionHandlers.handleError(actionTypes.GETALERTS_FAILED, error)
        )
      );
  };
};

// const updateRefreshTokenFCM = (data) => {
//   return (dispatch) => {
//     dispatch(actionHandlers.tryHandle(actionTypes.REFRESHFCMTOKEN));
//     return post(data)
//       .then((json) => {
//         dispatch(
//           actionHandlers.handleResponse(actionTypes.REFRESHFCMTOKEN_SUCCESS, json)
//         );
//       })
//       .catch((error) =>
//         dispatch(
//           actionHandlers.handleError(actionTypes.REFRESHFCMTOKEN_FAILED, error)
//         )
//       );
//   };
// };

export {
  // updateRefreshTokenFCM,
  getDahboarddata,
  getoustckdata,
  getalerts,
  postIosReciept,
  verifyReciept,
};
