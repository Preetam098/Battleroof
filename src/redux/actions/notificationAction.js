import axios from "axios";
import {
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_FAIL,
  ADD_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_SUCCESS,
  NOTIFICATION_LIST,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_LIST_SUCCESS,
  STATUS_NOTIFICATION,
  STATUS_NOTIFICATION_FAIL,
  STATUS_NOTIFICATION_SUCCESS,
} from ".";
import {
  add_notification,
  delete_notification,
  notification_list,
  notification_status,
} from "../../utils/endpoints";
import { toast } from "react-hot-toast";

// Notification lists
export const getNotifications =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: NOTIFICATION_LIST });
    try {
      const response = await axios.get(notification_list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response;
      dispatch({ type: NOTIFICATION_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: NOTIFICATION_LIST_FAIL });
    }
  };

// Delete Notification
export const deleteNotification =
  (notification_id, callBack) => async (dispatch) => {
    dispatch({ type: DELETE_NOTIFICATION });
    try {
      const response = await axios.get(
        `${delete_notification}/${notification_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: DELETE_NOTIFICATION_SUCCESS });
      dispatch(getNotifications());
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: DELETE_NOTIFICATION_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

export const pushNotification = (payload, callBack) => async (dispatch) => {
  dispatch({ type: ADD_NOTIFICATION });
  try {
    const formData = new FormData();
    for (const key in payload) {
      if (key === "image") {
        formData.append(key, payload[key]);
      } else {
        formData.append(key, payload[key]);
      }
    }

    const response = await axios.post(add_notification, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    const { message } = response.data;
    dispatch({ type: ADD_NOTIFICATION_SUCCESS });
    toast.success(message);
    dispatch(getNotifications());

    callBack();
  } catch (error) {
    dispatch({ type: ADD_NOTIFICATION_FAIL });
    if (error.response.status === 500) {
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
    toast.error(error.message);
  }
};

export const notificationStatusChange =
  (payload, callBack) => async (dispatch) => {
    dispatch({ type: STATUS_NOTIFICATION });
    try {
      const response = await axios.post(`${notification_status}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: STATUS_NOTIFICATION_SUCCESS });
      dispatch(getNotifications());
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: STATUS_NOTIFICATION_FAIL });
    }
  };
