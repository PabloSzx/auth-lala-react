import axios from "axios";
import { FETCH_USER, LOGIN_USER, LOGOUT_USER } from "../types";

export const fetchUser = () => async dispatch => {
  const res = await axios.post("/auth/current_user");
  dispatch({
    type: FETCH_USER,
    payload: res.data,
  });
};

export const loginUser = ({ username, password }) => async dispatch => {
  const res = await axios.post("/auth/login", { username, password });
  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};

export const loginUserNoSession = ({
  username,
  password,
}) => async dispatch => {
  const res = await axios.post("/auth/login/no_session", {
    username,
    password,
  });
  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};

export const logoutUser = () => async dispatch => {
  await axios.post("/auth/logout");
  dispatch({
    type: LOGOUT_USER,
  });
};

export const signupUser = ({ email, name, password }) => async dispatch => {
  const res = await axios.post("/auth/signup", {
    email,
    name,
    password,
  });

  console.log("res", res);

  dispatch({
    type: LOGIN_USER,
    payload: res.data,
  });
};
