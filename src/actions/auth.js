import axios from "axios";
import {
  LOGIN_USER,
  LOGOUT_USER,
  LOADING,
  CLEAR_ERROR,
  REDIRECT,
  FETCH_USER,
} from "../types";

export const fetchUser = callback => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/current_user", { callback });
  if (res.data.redirect) {
    dispatch({
      type: REDIRECT,
      payload: res.data.redirect,
    });
  } else {
    dispatch({
      type: FETCH_USER,
      payload: res.data,
    });
  }
};

export const loginUser = ({ email, password, callback }) => async dispatch => {
  dispatch({
    type: LOADING,
  });
  const res = await axios.post("/auth/login", { email, password, callback });
  if (res.data.redirect) {
    dispatch({
      type: REDIRECT,
      payload: res.data.redirect,
    });
  } else {
    dispatch({
      type: LOGIN_USER,
      payload: res.data,
    });
  }
};

export const loginUserNoSession = ({
  email,
  password,
  callback,
}) => async dispatch => {
  dispatch({
    type: LOADING,
  });

  const res = await axios.post("/auth/login/no_session", {
    email,
    password,
    callback,
  });
  if (res.data.redirect) {
    dispatch({
      type: REDIRECT,
      payload: res.data.redirect,
    });
  } else {
    dispatch({
      type: LOGIN_USER,
      payload: res.data,
    });
  }
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
