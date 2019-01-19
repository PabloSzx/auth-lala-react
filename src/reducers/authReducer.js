import { omit } from "lodash";
import { FETCH_USER, LOGIN_USER, LOGOUT_USER, LOADING } from "../types";

export default (state = {}, { type, payload }) => {
  const auth = omit(payload, "error");
  switch (type) {
    case LOADING: {
      return LOADING;
    }
    case FETCH_USER: {
      return auth;
    }
    case LOGIN_USER: {
      return auth;
    }
    case LOGOUT_USER: {
      return auth;
    }
    default:
      return state;
  }
};
