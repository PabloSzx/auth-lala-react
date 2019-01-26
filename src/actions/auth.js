import axios from "axios";
import {
  FETCH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  LOADING,
  CLEAR_ERROR,
} from "../types";

export const fetchUser = () => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/current_user");
  dispatch({
    type: FETCH_USER,
    payload: res.data,
  });
};

export const loginUser = ({ email, password }) => async dispatch => {
  dispatch({
    type: LOADING,
  });
  const res = await axios.post("/auth/login", { email, password });
  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};

export const loginUserNoSession = ({ email, password }) => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/login/no_session", {
    email,
    password,
  });
  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};

export const logoutUser = () => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/logout");
  dispatch({
    type: LOGOUT_USER,
    payload: res.data,
  });
};

export const signupUser = ({ email, name, password }) => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/signup", {
    email,
    name,
    password,
  });

  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};

export const recoverPassword = ({
  email,
  password,
  unlockKey,
}) => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/unlock", {
    email,
    password,
    unlockKey,
  });

  dispatch({ type: LOGIN_USER, payload: res.data });
};

export const clearError = () => async dispatch => {
  dispatch({
    type: CLEAR_ERROR,
  });
};
