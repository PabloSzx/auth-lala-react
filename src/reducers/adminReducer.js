import _ from "lodash";
import {
  ADMIN_GET_PROGRAMS,
  ADMIN_GET_USERS,
  ADMIN_GET_TRACKING,
} from "../types";

export default (
  state = { users: [], programs: [], tracking: [] },
  { type, payload }
) => {
  const admin = _.omit(payload, "error");

  switch (type) {
    case ADMIN_GET_PROGRAMS: {
      return {
        ...state,
        programs: _.isEmpty(admin) ? state.programs : admin,
      };
    }
    case ADMIN_GET_USERS: {
      return {
        ...state,
        users: _.isEmpty(admin) ? state.users : admin,
      };
    }
    case ADMIN_GET_TRACKING: {
      return {
        ...state,
        tracking: _.isEmpty(admin) ? state.tracking : _.chunk(_.map(admin), 50),
      };
    }

    default:
      return state;
  }
};
