export const tryHandle = actionType => ({ type: actionType, payload: { isLoading: false,} });

export const handleResponse = (actionType, data) => {
  return {
    type: actionType,
    payload: { data: data }
  };
};

export const handleError = (actionType, error) => {
  return {
    type: actionType,
    payload: { data: error }
  };
};
