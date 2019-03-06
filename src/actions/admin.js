import axios from "axios";
import {
  ADMIN_GET_PROGRAMS,
  ADMIN_GET_USERS,
  ADMIN_LOGIN,
  ADMIN_FETCH,
  ADMIN_GET_TRACKING,
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

export const adminGetTracking = () => async dispatch => {
  const res = await axios.post("/admin/get_tracking");

  dispatch({
    type: ADMIN_GET_TRACKING,
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

export const adminImportUsers = data => async dispatch => {
  const res = await axios.post("/admin/users_import", { data });

  dispatch({
    type: ADMIN_GET_USERS,
    payload: res.data,
  });
};

export const adminImportPrograms = data => async dispatch => {
  const res = await axios.post("/admin/programs_import", { data });

  dispatch({
    type: ADMIN_GET_PROGRAMS,
    payload: res.data,
  });
};

export const adminLockUser = email => async dispatch => {
  const res = await axios.post("/admin/lock_user", { email });

  dispatch({
    type: ADMIN_GET_USERS,
    payload: res.data,
  });
};

export const adminMailLockedUsers = () => async dispatch => {
  await axios.post("/admin/mail_all_locked_users");
};

export const adminDeleteUser = email => async dispatch => {
  const res = await axios.post("/admin/delete_user", { email });

  dispatch({
    type: ADMIN_GET_USERS,
    payload: res.data,
  });
};

export const adminDeleteProgram = ({ email, program }) => async dispatch => {
  const res = await axios.post("/admin/delete_program", { email, program });

  dispatch({
    type: ADMIN_GET_PROGRAMS,
    payload: res.data,
  });
};
