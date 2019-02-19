import { combineReducers } from "redux";
import adminReducer from "./adminReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import redirectReducer from "./redirectReducer";

export default combineReducers({
  auth: authReducer,
  error: errorReducer,
  admin: adminReducer,
  redirect: redirectReducer,
});
