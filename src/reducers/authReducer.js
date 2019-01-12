import { FETCH_USER, LOGIN_USER, LOGOUT_USER } from "../types";

export default (state = false, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || false;
    case LOGIN_USER:
      return action.payload || false;
    case LOGOUT_USER:
      return false;
    default:
      return state;
  }
};
