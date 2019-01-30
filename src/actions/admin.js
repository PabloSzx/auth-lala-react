import axios from "axios";
import {
  ADMIN_GET_PROGRAMS,
  ADMIN_GET_USERS,
  ADMIN_LOGIN,
  ADMIN_FETCH,
} from "../types";

export const adminGetUsers = () => async dispatch => {
  const res = await axios.post("/admin/get_users");
  dispatch({
    type: ADMIN_GET_USERS,
    payload: res.data,
  });
};

export const adminGetPrograms = () => async dispatch => {
  const res = await axios.post("/admin/get_programs");

  dispatch({
    type: ADMIN_GET_PROGRAMS,
    payload: res.data,
  });
};

export const adminLogin = ({ username, password }) => async dispatch => {
  const res = await axios.post("/admin/login", { username, password });

  dispatch({
    type: ADMIN_LOGIN,
    payload: res.data,
  });
};

export const adminUserUpdate = data => async dispatch => {
  const res = await axios.post("/admin/update_user", data);

  dispatch({
    type: ADMIN_GET_USERS,
    payload: res.data,
  });
};

export const adminProgramUpdate = data => async dispatch => {
  const res = await axios.post("/admin/update_program", data);

  dispatch({
    type: ADMIN_GET_PROGRAMS,
    payload: res.data,
  });
};

export const adminFetch = () => async dispatch => {
  const res = await axios.post("/admin/current_user");

  dispatch({
    type: ADMIN_FETCH,
    payload: res.data,
  });
};
