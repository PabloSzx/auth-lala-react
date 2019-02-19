import { REDIRECT } from "../types";

export default (state = false, { type, payload }) => {
  switch (type) {
    case REDIRECT: {
      return payload;
    }
    default:
      return state;
  }
};
