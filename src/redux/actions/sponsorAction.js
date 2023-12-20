import axios from "axios";
import {
  SPONSOR_LIST_SUCCESS,
  SPONSOR_LIST_FAIL,
  SPONSOR_LIST,
  ADD_SPONSOR,
  ADD_SPONSOR_FAIL,
  ADD_SPONSOR_SUCCESS,
  UPDATE_SPONSOR,
  UPDATE_SPONSOR_FAIL,
  UPDATE_SPONSOR_SUCCESS,
  DELETE_SPONSOR,
  DELETE_SPONSOR_FAIL,
  DELETE_SPONSOR_SUCCESS,
  UPDATE_SPONSOR_STATUS,
  UPDATE_SPONSOR_STATUS_FAIL,
  UPDATE_SPONSOR_STATUS_SUCCESS,
} from ".";
import {
  sponsor_list,
  add_sponsor,
  update_sponsor,
  delete_sponsor,
  sponsor_status,
} from "../../utils/endpoints";
import { toast } from "react-hot-toast";

//sponsor list
export const getSponsor = () => async (dispatch) => {
  dispatch({ type: SPONSOR_LIST });
  try {
    const response = await axios.get(sponsor_list, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: SPONSOR_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SPONSOR_LIST_FAIL });
  }
};

// add sponsor
export const addSponsor = (payload, callBack) => async (dispatch) => {
  dispatch({ type: ADD_SPONSOR });
  try {
    const response = await axios.post(add_sponsor, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: ADD_SPONSOR_SUCCESS });
    dispatch(getSponsor());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: ADD_SPONSOR_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// delete sponsor
export const deleteSponsor = (sponsor_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_SPONSOR });
  try {
    const response = await axios.get(`${delete_sponsor}/${sponsor_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_SPONSOR_SUCCESS });
    dispatch(getSponsor());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: DELETE_SPONSOR_FAIL });

    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
    callBack();
  }
};

// update game type
export const updateSponsor =
  (sponsor_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_SPONSOR });
    try {
      const response = await axios.post(
        `${update_sponsor}/${sponsor_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_SPONSOR_SUCCESS });
      dispatch(getSponsor());
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_SPONSOR_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update sponsor status
export const updatesponsorStatus =
  (sponsor_id, payload) => async (dispatch) => {
    dispatch({ type: UPDATE_SPONSOR_STATUS });
    try {
      await axios.post(`${sponsor_status}/${sponsor_id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      dispatch(getSponsor());
      dispatch({ type: UPDATE_SPONSOR_STATUS_SUCCESS });
    } catch (error) {
      dispatch({ type: UPDATE_SPONSOR_STATUS_FAIL });

      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        const { message } = error?.response?.data;
        toast.error(message);
      }
    }
  };
