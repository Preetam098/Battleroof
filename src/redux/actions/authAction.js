import axios from "axios";
import {
  LOG_IN,
  LOG_IN_FAIL,
  LOG_IN_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_SETTING,
  UPDATE_SETTING_FAIL,
  UPDATE_SETTING_SUCCESS,
  VIEW_SETTING,
  VIEW_SETTING_FAIL,
  VIEW_SETTING_SUCCESS,
} from ".";
import { toast } from "react-hot-toast";
import {
  login_url,
  update_password,
  update_profile,
  update_setting,
  view_setting,
} from "../../utils/endpoints";

// login
export const authLogin = (payload, callBack) => async (dispatch) => {
  dispatch({ type: LOG_IN });
  try {
    const response = await axios.post(login_url, payload);
    const { token, message, user } = response.data;
    dispatch({ type: LOG_IN_SUCCESS });

    toast.success(message);
    localStorage.setItem("AccessToken", token);
    localStorage.setItem("Admin", JSON.stringify(user));

    callBack();
  } catch (error) {
    const { message } = error.response.data;
    dispatch({ type: LOG_IN_FAIL });
    toast.error(message);
  }
};

// updateProfile
export const updateProfile = (payload, callBack) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE });
  try {
    const response = await axios.post(update_profile, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_PROFILE_SUCCESS });
    toast.success(message);

    callBack();
  } catch (error) {
    const { msg } = error?.response?.data?.error?.errors?.[0];
    dispatch({ type: UPDATE_PROFILE_FAIL });
    toast.error(msg);
  }
};

// updatePassword
export const updatePassword = (payload, callBack) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE });
  try {
    const response = await axios.post(update_password, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_PROFILE_SUCCESS });
    toast.success(message);
    callBack();
  } catch (error) {
    console.log(error);
    const data = error?.response?.data?.error
      ? error?.response?.data?.error?.errors?.[0].msg
      : error?.response?.data?.message;
    dispatch({ type: UPDATE_PROFILE_FAIL });
    toast.error(data);
  }
};

// ------------------ Setting ---------------------- //

export const getSetting = (callBack) => async (dispatch) => {
  dispatch({ type: VIEW_SETTING });
  try {
    const response = await axios.get(`${view_setting}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: VIEW_SETTING_SUCCESS, payload: data });
    callBack(data.result);
  } catch (error) {
    dispatch({ type: VIEW_SETTING_FAIL });
  }
};

export const updateSetting = (payload, callBack) => async (dispatch) => {
  dispatch({ type: UPDATE_SETTING });
  try {
    const response = await axios.post(`${update_setting}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_SETTING_SUCCESS });
    dispatch(getSetting());
    toast.success(message);

    callBack();
  } catch (error) {
    // const { msg } = error?.response?.data?.error?.errors?.[0];
    dispatch({ type: UPDATE_SETTING_FAIL });
    // toast.error(msg);
  }
};
