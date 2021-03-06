import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_CCA_LIST,
} from "../types";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      return setAuthorizationHeader(res.data.token);
    })
    .then(() => {
      dispatch(getUserData());
      history.push("/");
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  const startingHeader = localStorage.FBIdToken.split(" ")[0];
  if (startingHeader === "User") {
    axios
      .get("/user")
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  } else {
    axios
      .get("/admin")
      .then((res) => {
        dispatch({
          type: SET_USER,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token)
        .then(() => {
          dispatch(getUserData());
          history.push("/");
          dispatch({ type: CLEAR_ERRORS });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

const setAuthorizationHeader = (token) => {
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  return axios.get(`/user/${userId}`).then((res) => {
    const startingHeader = res.data.adminStatus.tokenHeader;
    const FBIdToken = `${startingHeader}${token}`;

    localStorage.setItem("FBIdToken", FBIdToken);
    axios.defaults.headers.common["Authorization"] = FBIdToken;
  });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const setAsAdmin = (adminData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/user/admin", adminData)
    .then((res) => {
      return setAuthorizationHeader(localStorage.FBIdToken.split(" ")[1]);
    })
    .then(() => {
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const joinCCA = (data, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/join", data)
    .then((res) => {
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getAllCCA = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get("/cca")
    .then((res) => {
      const ccaList = res.data;
      dispatch({
        type: SET_CCA_LIST,
        payload: { ccaList },
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
