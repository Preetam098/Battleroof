import axios from "axios";
import {
  APPROVE_REQUEST,
  APPROVE_REQUEST_FAIL,
  APPROVE_REQUEST_SUCCESS,
  DELETE_USER,
  DELETE_USER_FAIL,
  DELETE_USER_SUCCESS,
  PLAYER_LIST,
  PLAYER_LIST_FAIL,
  PLAYER_LIST_SUCCESS,
  PLAYER_VIEW,
  PLAYER_VIEW_FAIL,
  PLAYER_VIEW_SUCCESS,
  TEAM_LIST,
  TEAM_LIST_FAIL,
  TEAM_LIST_SUCCESS,
  TEAM_VIEW,
  TEAM_VIEW_FAIL,
  TEAM_VIEW_SUCCESS,
  TRANSACTION_LOGS,
  TRANSACTION_LOGS_FAIL,
  TRANSACTION_LOGS_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_STATUS,
  UPDATE_USER_STATUS_FAIL,
  UPDATE_USER_STATUS_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_WALLET,
  UPDATE_USER_WALLET_FAIL,
  UPDATE_USER_WALLET_SUCCESS,
  USER_LIST,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  WITHDRAW_REQUEST,
  WITHDRAW_REQUEST_FAIL,
  WITHDRAW_REQUEST_SUCCESS,
  TDM_PLAYER_LISTS,
  TDM_PLAYER_LISTS_FAIL,
  TDM_PLAYER_DETAILS,
  TDM_PLAYER_DETAILS_SUCCESS,
  TDM_PLAYER_DETAILS_FAIL,
  RECORD_COUNT_SUCCESS,
  RECORD_COUNT_FAIL,
  RECORD_COUNT,
  TOTAL_AMOUNT,
  TOTAL_AMOUNT_SUCCESS,
  TOTAL_AMOUNT_FAIL,
  TRANSACTION_LIST,
  TRANSACTION_LIST_SUCCESS,
  TRANSACTION_LIST_FAIL,
  TRANSACTION_LIST_BY_Id,
  TRANSACTION_LIST_SUCCESS_BY_Id,
  TRANSACTION_LIST_FAIL_BY_Id,
  ADD_SUPPORT,
  ADD_SUPPORT_SUCCESS,
  ADD_SUPPORT_FAIL,
  View_SUPPORT,
  View_SUPPORT_SUCCESS,
  View_SUPPORT_FAIL,
  REGISTRATION_RECORD_COUNT,
  REGISTRATION_RECORD_COUNT_SUCCESS,
  REGISTRATION_RECORD_COUNT_FAIL,
  DEVICE_RECORD_COUNT,
  DEVICE_RECORD_COUNT_SUCCESS,
  DEVICE_RECORD_COUNT_FAIL,
} from ".";
import {
  add_support,
  view_support,
  approve_requests,
  delete_user,
  game_played_by_user,
  player_list,
  player_view,
  record_count,
  tdm_player_view,
  team_list,
  team_view,
  total_amount,
  transaction_list,
  transaction_list_by_id,
  transaction_logs,
  update_user,
  update_user_wallet,
  user_list,
  user_status,
  withdraw_requests,
  registration_count,
  device_count,
} from "../../utils/endpoints";
import { toast } from "react-hot-toast";

// User lists
export const getUsers =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: USER_LIST });
    try {
      const response = await axios.get(
        user_list,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
          params,
        }
      );
      const { data } = response.data;
      dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: USER_LIST_FAIL });
    }
  };

// Update User Wallet
export const updateUserWallet =
  (user_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_WALLET });

    try {
      const response = await axios.post(
        `${update_user_wallet}/${user_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_USER_WALLET_SUCCESS });
      toast.success(message);
      dispatch(getUsers());

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_USER_WALLET_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// Delete User
export const deleteUser = (user_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_USER });
  try {
    const response = await axios.get(`${delete_user}/${user_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_USER_SUCCESS });
    dispatch(getUsers());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: DELETE_USER_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};
export const ExportUserCSV = (url) => async () => {
  // dispatch({ type: DELETE_USER });
  try {
    const response = await axios.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    // dispatch({ type: DELETE_USER_SUCCESS });
    toast.success(message);
    const a = document.createElement("a");
    a.href = response.data.file;
    a.download = "Data.csv";
    a.click();
    // callBack(response.data.file);
  } catch (error) {
    // dispatch({ type: DELETE_USER_FAIL });
    if (error?.response?.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// Update User Status
export const updateUserStatus = (user_id, payload) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_STATUS });
  try {
    await axios.post(`${user_status}/${user_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    // const { message } = response.data;
    dispatch(getUsers());
    dispatch({ type: UPDATE_USER_STATUS_SUCCESS });
    // toast.success(message);
  } catch (error) {
    dispatch({ type: UPDATE_USER_STATUS_FAIL });

    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// Update User
export const updateUser = (user_id, payload, callBack) => async (dispatch) => {
  dispatch({ type: UPDATE_USER });
  try {
    const response = await axios.post(`${update_user}/${user_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_USER_SUCCESS });
    dispatch(getUsers());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAIL });
    if (error?.response?.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// --------------------------------- Teams ---------------------------- //

// Team Lists
export const teamList = (query) => async (dispatch) => {
  dispatch({ type: TEAM_LIST });
  try {
    const response = await axios.get(`${team_list}/?${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: TEAM_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TEAM_LIST_FAIL });
  }
};

// tdm player Lists
export const tdmPlayersLists = (query) => async (dispatch) => {
  dispatch({ type: TDM_PLAYER_LISTS });
  try {
    const response = await axios.get(`${game_played_by_user}/${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: TDM_PLAYER_LISTS, payload: data });
  } catch (error) {
    dispatch({ type: TDM_PLAYER_LISTS_FAIL });
  }
};

// tdm player Details
export const tdmPlayersDetails = (query) => async (dispatch) => {
  dispatch({ type: TDM_PLAYER_DETAILS });
  try {
    const response = await axios.get(`${tdm_player_view}/${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: TDM_PLAYER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TDM_PLAYER_DETAILS_FAIL });
  }
};

// Team View
export const teamView = (team_id) => async (dispatch) => {
  dispatch({ type: TEAM_VIEW });
  try {
    const response = await axios.get(`${team_view}/${team_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: TEAM_VIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TEAM_VIEW_FAIL });
  }
};

// --------------------------------- PLayers ---------------------------- //

// Player List
export const playerList = (team_id) => async (dispatch) => {
  dispatch({ type: PLAYER_LIST });
  try {
    const response = await axios.get(`${player_list}/${team_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: PLAYER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PLAYER_LIST_FAIL });
  }
};

// Player View
export const playerView = (player_id) => async (dispatch) => {
  dispatch({ type: PLAYER_VIEW });
  try {
    const response = await axios.get(`${player_view}/${player_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: PLAYER_VIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PLAYER_VIEW_FAIL });
  }
};

// --------------------------------- Transactions ---------------------------- //

// Transactions Logs
export const transactionLogs =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: TRANSACTION_LOGS });
    try {
      const response = await axios.get(transaction_logs, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      dispatch({ type: TRANSACTION_LOGS_SUCCESS, payload: response?.data });
    } catch (error) {
      dispatch({ type: TRANSACTION_LOGS_FAIL });
    }
  };

// With Draw Logs
export const withdrawRequest = (params, callBack) => async (dispatch) => {
  // const url = query ? `${withdraw_requests}${query}` : withdraw_requests;
  dispatch({ type: WITHDRAW_REQUEST });
  try {
    const response = await axios.get(withdraw_requests, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
      params,
    });
    dispatch({ type: WITHDRAW_REQUEST_SUCCESS, payload: response?.data });
    callBack && callBack();
  } catch (error) {
    dispatch({ type: WITHDRAW_REQUEST_FAIL });
  }
};

// Approve Request
export const appvoveRequest = (payload) => async (dispatch) => {
  dispatch({ type: APPROVE_REQUEST });
  try {
    const response = await axios.post(approve_requests, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    dispatch({ type: APPROVE_REQUEST_SUCCESS });
    dispatch(withdrawRequest());
    toast.success(response.data.message);
  } catch (error) {
    dispatch({ type: APPROVE_REQUEST_FAIL });
  }
};

// get record count
export const getRecordCount = () => async (dispatch) => {
  dispatch({ type: RECORD_COUNT });
  try {
    const response = await axios.get(`${record_count}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: RECORD_COUNT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: RECORD_COUNT_FAIL });
  }
};
export const getRegistrationCount =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: REGISTRATION_RECORD_COUNT });
    try {
      const response = await axios.get(`${registration_count}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response.data;
      dispatch({ type: REGISTRATION_RECORD_COUNT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: REGISTRATION_RECORD_COUNT_FAIL });
    }
  };
export const getDeviceCount = () => async (dispatch) => {
  dispatch({ type: DEVICE_RECORD_COUNT });
  try {
    const response = await axios.get(`${device_count}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: DEVICE_RECORD_COUNT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: DEVICE_RECORD_COUNT_FAIL });
  }
};

// get record count
export const getTotalAmount = (entry_fee) => async (dispatch) => {
  dispatch({ type: TOTAL_AMOUNT });
  try {
    const response = await axios.post(`${total_amount}`, entry_fee, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
      data: {
        type: entry_fee,
      },
    });
    const { data } = response.data;
    dispatch({ type: TOTAL_AMOUNT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TOTAL_AMOUNT_FAIL });
  }
};

// get transaction list
export const getTransactionList = () => async (dispatch) => {
  dispatch({ type: TRANSACTION_LIST });
  try {
    const response = await axios.get(`${transaction_list}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response?.data;
    dispatch({ type: TRANSACTION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: TRANSACTION_LIST_FAIL });
  }
};

export const getTransactionListByUserId =
  (user_id, params = {}) =>
  async (dispatch) => {
    dispatch({ type: TRANSACTION_LIST_BY_Id });
    try {
      const response = await axios.get(`${transaction_list_by_id}/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      dispatch({
        type: TRANSACTION_LIST_SUCCESS_BY_Id,
        payload: response?.data || [],
      });
    } catch (error) {
      dispatch({ type: TRANSACTION_LIST_FAIL_BY_Id });
    }
  };

// support

export const getSupportView = (callBack) => async (dispatch) => {
  dispatch({ type: View_SUPPORT });
  try {
    const response = await axios.get(`${view_support}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });

    callBack(response?.data?.data);
    dispatch({ type: View_SUPPORT_SUCCESS, payload: response?.data?.data });
  } catch (error) {
    dispatch({ type: View_SUPPORT_FAIL });
  }
};

export const addSupport = (support_data, callBack) => async (dispatch) => {
  dispatch({ type: ADD_SUPPORT });
  try {
    const response = await axios.post(`${add_support}`, support_data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: ADD_SUPPORT_SUCCESS, payload: data });
    dispatch(getSupportView());
    callBack();
  } catch (error) {
    dispatch({ type: ADD_SUPPORT_FAIL });
  }
};
