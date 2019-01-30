import { omit, isEmpty } from "lodash";
import { ADMIN_GET_PROGRAMS, ADMIN_GET_USERS } from "../types";

export default (state = { users: [], programs: [] }, { type, payload }) => {
  const admin = omit(payload, "error");

  switch (type) {
    case ADMIN_GET_PROGRAMS: {
      return {
        ...state,
        programs: isEmpty(admin) ? state.programs : admin,
      };
    }
    case ADMIN_GET_USERS: {
      return {
        ...state,
        users: isEmpty(admin) ? state.users : admin,
      };
    }

    default:
      return state;
  }
};
