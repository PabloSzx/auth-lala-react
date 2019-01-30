import { omit } from "lodash";
import {
  ADMIN_GET_PROGRAMS,
  ADMIN_GET_USERS,
  ADMIN_LOGIN,
  ADMIN_FETCH,
} from "../types";

export default (state = {}, { type, payload }) => {
  const admin = omit(payload, "error");

  switch (type) {
    case ADMIN_LOGIN:
    case ADMIN_FETCH:
      return {
        ...state,
        admin,
      };
    case ADMIN_GET_PROGRAMS: {
      return {
        ...state,
        programs: admin,
      };
    }
    case ADMIN_GET_USERS: {
      return {
        ...state,
        users: admin,
      };
    }

    default:
      return state;
  }
};
