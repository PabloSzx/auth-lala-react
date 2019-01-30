import { pick, get } from "lodash";
import {
  FETCH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  SIGNUP_USER,
  CLEAR_ERROR,
  ADMIN_GET_PROGRAMS,
  ADMIN_LOGIN,
  ADMIN_GET_USERS,
} from "../types";

export default (state = {}, { type, payload }) => {
  const error = get(pick(payload, "error"), "error", {});
  switch (type) {
    case ADMIN_GET_PROGRAMS:
    case ADMIN_GET_USERS:
    case FETCH_USER:
    case LOGIN_USER:
    case SIGNUP_USER:
    case ADMIN_LOGIN:
    case LOGOUT_USER: {
      return { ...error };
    }
    case CLEAR_ERROR: {
      return {};
    }
    default:
      return state;
  }
};
