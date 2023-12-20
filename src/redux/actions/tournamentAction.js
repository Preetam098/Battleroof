import axios from "axios";
import {
  ADD_TOURNAMENT,
  ADD_TOURNAMENT_FAIL,
  ADD_TOURNAMENT_SUCCESS,
  ALL_TEAM_LIST,
  ALL_TEAM_LIST_FAIL,
  ALL_TEAM_LIST_SUCCESS,
  DELETE_TEAM,
  DELETE_TEAM_FAIL,
  DELETE_TEAM_Player,
  DELETE_TEAM_Player_FAIL,
  DELETE_TEAM_Player_SUCCESS,
  DELETE_TEAM_SUCCESS,
  DELETE_TOURNAMENT,
  DELETE_TOURNAMENT_FAIL,
  DELETE_TOURNAMENT_SUCCESS,
  GAME_PLAYER_LIST,
  GAME_PLAYER_LIST_FAIL,
  GAME_PLAYER_LIST_SUCCESS,
  GAME_PLAYER_VIEW,
  GAME_PLAYER_VIEW_FAIL,
  GAME_PLAYER_VIEW_SUCCESS,
  JOINED_DELETE_TEAM,
  JOINED_DELETE_TEAM_FAIL,
  JOINED_DELETE_TEAM_SUCCESS,
  TOURNAMENT,
  TOURNAMENT_FAIL,
  TOURNAMENT_SUCCESS,
  UPDATE_ROOM_ID,
  UPDATE_ROOM_ID_FAIL,
  UPDATE_ROOM_ID_SUCCESS,
  UPDATE_SETTLEMENT_STATUS,
  UPDATE_SETTLEMENT_STATUS_FAIL,
  UPDATE_SETTLEMENT_STATUS_SUCCESS,
  UPDATE_STREAMING_LINK,
  UPDATE_STREAMING_LINK_FAIL,
  UPDATE_STREAMING_LINK_SUCCESS,
  UPDATE_TEAM_RANK,
  UPDATE_TEAM_RANK_FAIL,
  UPDATE_TEAM_RANK_SUCCESS,
  UPDATE_TOUR,
  UPDATE_TOUR_FAIL,
  UPDATE_TOUR_STATUS,
  UPDATE_TOUR_STATUS_FAIL,
  UPDATE_TOUR_STATUS_SUCCESS,
  UPDATE_TOUR_SUCCESS,
  VIEW_TOUR,
  VIEW_TOUR_FAIL,
  VIEW_TOUR_SUCCESS,
} from ".";
import {
  add_Tournament,
  all_team_list,
  bulk_update_rank,
  create_room_id,
  declare_slots,
  delete_Tournament,
  delete_joined_tournament,
  game_player_list,
  getTournament_list,
  settlement_status,
  tdp_player_view,
  team_delete,
  team_player_delete,
  tour_running_status,
  tour_status,
  tour_view,
  update_Tournament,
  update_streaming_link,
} from "../../utils/endpoints";
import { toast } from "react-hot-toast";
import { teamList } from "./userAction";

// tournament list
export const getTournaments =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: TOURNAMENT });
    try {
      const response = await axios.get(getTournament_list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response.data;
      dispatch({ type: TOURNAMENT_SUCCESS, payload: data });
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(error?.response?.data?.message);
      }
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// add tournament
export const addTournament =
  (payload, params = {}, callBack) =>
  async (dispatch) => {
    dispatch({ type: ADD_TOURNAMENT });
    try {
      const response = await axios.post(add_Tournament, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: ADD_TOURNAMENT_SUCCESS });
      toast.success(message);
      dispatch(getTournaments(params));

      callBack();
    } catch (error) {
      dispatch({ type: ADD_TOURNAMENT_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// delete tournament
export const deleteTournament =
  (tour_id, params = {}, callBack) =>
  async (dispatch) => {
    dispatch({ type: DELETE_TOURNAMENT });
    try {
      const response = await axios.get(`${delete_Tournament}/${tour_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: DELETE_TOURNAMENT_SUCCESS });
      dispatch(getTournaments(params));
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: DELETE_TOURNAMENT_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update tournament status
export const updateTourStatus =
  (tour_id, payload, params) => async (dispatch) => {
    dispatch({ type: UPDATE_TOUR_STATUS });
    try {
      await axios.post(`${tour_status}/${tour_id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      // const { message } = response.data;
      dispatch(getTournaments(params));
      dispatch({ type: UPDATE_TOUR_STATUS_SUCCESS });
      // toast.success(message);
    } catch (error) {
      dispatch({ type: UPDATE_TOUR_STATUS_FAIL });

      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        const { message } = error?.response?.data;
        toast.error(message);
      }
    }
  };

// update tournament
export const updateTour =
  (tour_id, payload, params = {}, callBack) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_TOUR });
    try {
      const response = await axios.post(
        `${update_Tournament}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_TOUR_SUCCESS });
      dispatch(getTournaments(params));
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_TOUR_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update tournament running status
export const updateRunningStatus =
  (tour_id, payload, params, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_TOUR });
    try {
      const response = await axios.post(
        `${tour_running_status}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_TOUR_SUCCESS });
      dispatch(getTournaments(params));
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_TOUR_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// view tournament
export const viewTour = (tour_id) => async (dispatch) => {
  dispatch({ type: VIEW_TOUR });
  try {
    const response = await axios.get(`${tour_view}/${tour_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: VIEW_TOUR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VIEW_TOUR_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// ----------------------------------- TDM Plyers --------------------------------- //
export const gamePlayerList = (id) => async (dispatch) => {
  dispatch({ type: GAME_PLAYER_LIST });
  try {
    const response = await axios.get(`${game_player_list}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: GAME_PLAYER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GAME_PLAYER_LIST_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

export const gamePlayerView = (id) => async (dispatch) => {
  dispatch({ type: GAME_PLAYER_VIEW });
  try {
    const response = await axios.get(`${tdp_player_view}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: GAME_PLAYER_VIEW_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GAME_PLAYER_VIEW_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// ----------------------------------- ROOM ID ---------------------------------
export const updateRoomId = (tour_id, payload) => async (dispatch) => {
  dispatch({ type: UPDATE_ROOM_ID });
  try {
    const response = await axios.post(`${create_room_id}/${tour_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_ROOM_ID_SUCCESS });
    dispatch(viewTour(tour_id));
    toast.success(message);
  } catch (error) {
    dispatch({ type: UPDATE_ROOM_ID_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

export const settlementStatus = (payload) => async (dispatch) => {
  dispatch({ type: UPDATE_SETTLEMENT_STATUS });
  try {
    const response = await axios.post(settlement_status, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_SETTLEMENT_STATUS_SUCCESS });
    dispatch(viewTour(payload?.tournamentId));
    toast.success(message);
  } catch (error) {
    dispatch({ type: UPDATE_SETTLEMENT_STATUS_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// ------------------------------ Team RANK Update ---------------------------------- //
export const updateTeamRank =
  (tour_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_TEAM_RANK });
    try {
      const response = await axios.post(
        `${bulk_update_rank}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_TEAM_RANK_SUCCESS });
      dispatch(viewTour(tour_id));
      dispatch(teamList(`tournamentId=${tour_id}`));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_TEAM_RANK_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

export const declareSlots =
  (tour_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_TEAM_RANK });
    try {
      const response = await axios.post(
        `${declare_slots}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_TEAM_RANK_SUCCESS });
      dispatch(viewTour(tour_id));
      dispatch(teamList(`tournamentId=${tour_id}`));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_TEAM_RANK_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

// delete team
export const deleteTeam = (team_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_TEAM });
  try {
    const response = await axios.get(`${team_delete}/${team_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_TEAM_SUCCESS });
    // dispatch(viewTour())
    toast.success(message);
    callBack();
  } catch (error) {
    dispatch({ type: DELETE_TEAM_FAIL });
    if (error?.response?.status === 500) {
      toast.error(error?.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// delete team
export const joinDeleteTeam =
  (joinTournament_id, callBack) => async (dispatch) => {
    dispatch({ type: JOINED_DELETE_TEAM });
    try {
      const response = await axios.get(
        `${delete_joined_tournament}/${joinTournament_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: JOINED_DELETE_TEAM_SUCCESS });
      // dispatch(viewTour())
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: JOINED_DELETE_TEAM_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error?.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// delete tournament team player
export const deleteTeamPlayer = (player_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_TEAM_Player });
  try {
    const response = await axios.get(`${team_player_delete}/${player_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_TEAM_Player_SUCCESS });
    // dispatch(viewTour())
    toast.success(message);
    callBack();
  } catch (error) {
    dispatch({ type: DELETE_TEAM_Player_FAIL });
    if (error?.response?.status === 500) {
      toast.error(error?.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

export const allTeamList =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: ALL_TEAM_LIST });
    try {
      const response = await axios.get(`${all_team_list}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });

      dispatch({ type: ALL_TEAM_LIST_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: ALL_TEAM_LIST_FAIL });
      // if (error.response) {
      //   toast.error(error.message)
      // } else {
      //   const { message } = error?.response?.data
      //   toast.error(message)
      // }
    }
  };

// streaming link update
export const updateStreamingLink =
  (tournamentId, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_STREAMING_LINK });
    try {
      const response = await axios.post(
        `${update_streaming_link}/${tournamentId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_STREAMING_LINK_SUCCESS });
      toast.success(message);
      dispatch(viewTour(tournamentId));
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_STREAMING_LINK_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error?.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };
