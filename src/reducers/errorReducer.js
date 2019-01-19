import { pick, get } from "lodash";
import {
  FETCH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  SIGNUP_USER,
  CLEAR_ERROR,
} from "../types";

export default (state = {}, { type, payload }) => {
  const error = get(pick(payload, "error"), "error", {});
  switch (type) {
    case FETCH_USER: {
      return { ...error };
    }
    case LOGIN_USER: {
      return { ...error };
    }
    case SIGNUP_USER: {
      return { ...error };
    }
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
