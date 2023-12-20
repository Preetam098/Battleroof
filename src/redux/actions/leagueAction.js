import axios from "axios";
import {
  ADD_ROUND_GROUP,
  ADD_ROUND_GROUP_FAIL,
  ADD_ROUND_GROUP_SUCCESS,
  ADD_STAGE_ROUND,
  ADD_STAGE_ROUND_FAIL,
  ADD_STAGE_ROUND_SUCCESS,
  CREATE_LEAGUE_TOUR,
  CREATE_LEAGUE_TOUR_FAIL,
  CREATE_LEAGUE_TOUR_SUCCESS,
  CREATE_STAGE,
  CREATE_STAGE_FAIL,
  CREATE_STAGE_SUCCESS,
  DELETE_STAGE_ROUND,
  DELETE_STAGE_ROUND_FAIL,
  DELETE_STAGE_ROUND_SUCCESS,
  DELETE_TOUR_STAGE,
  DELETE_TOUR_STAGE_FAIL,
  DELETE_TOUR_STAGE_SUCCESS,
  GET_LEAGIE_TOUR_LIST,
  GET_LEAGIE_TOUR_LIST_FAIL,
  GET_LEAGIE_TOUR_LIST_SUCCESS,
  GET_LEAGIE_TOUR_TEAM_LIST,
  GET_LEAGIE_TOUR_TEAM_LIST_FAIL,
  GET_LEAGIE_TOUR_TEAM_LIST_SUCCESS,
  GET_STAGE_LIST,
  GET_STAGE_LIST_FAIL,
  GET_STAGE_LIST_SUCCESS,
  GET_STAGE_ROUND,
  GET_STAGE_ROUND_FAIL,
  GET_STAGE_ROUND_SUCCESS,
  GET_TEAMS_STAGE_WISE,
  GET_TEAMS_STAGE_WISE_FAIL,
  GET_TEAMS_STAGE_WISE_SUCCESS,
  GET_TOUR_STAGE,
  GET_TOUR_STAGE_FAIL,
  GET_TOUR_STAGE_SUCCESS,
  LEAGUE_TOUR_REMOVE,
  LEAGUE_TOUR_REMOVE_FAIL,
  LEAGUE_TOUR_REMOVE_SUCCESS,
  LEAGUE_TOUR_STATUS_UPDATE,
  LEAGUE_TOUR_STATUS_UPDATE_FAIL,
  LEAGUE_TOUR_STATUS_UPDATE_SUCCESS,
  STAGE_REMOVE,
  STAGE_REMOVE_FAIL,
  STAGE_REMOVE_SUCCESS,
  STAGE_STATUS_UPDATE,
  STAGE_STATUS_UPDATE_FAIL,
  STAGE_STATUS_UPDATE_SUCCESS,
  UPDATE_LEAGUE_TOUR,
  UPDATE_LEAGUE_TOUR_FAIL,
  UPDATE_LEAGUE_TOUR_SUCCESS,
  UPDATE_LOBBY_RESULT,
  UPDATE_LOBBY_RESULT_FAIL,
  UPDATE_LOBBY_RESULT_SUCCESS,
  UPDATE_STAGE,
  UPDATE_STAGE_FAIL,
  UPDATE_STAGE_SUCCESS,
  UPDATE_TOUR_STAGE,
  UPDATE_TOUR_STAGE_FAIL,
  UPDATE_TOUR_STAGE_SUCCESS,
  VIEW_LEAGUE_TOUR,
  VIEW_LEAGUE_TOUR_FAIL,
  VIEW_LEAGUE_TOUR_SUCCESS,
  VIEW_ROUND_GROUP,
  VIEW_ROUND_GROUP_FAIL,
  VIEW_ROUND_GROUP_SUCCESS,
} from ".";
import {
  create_round_group,
  create_stage,
  delete_league_tour_stage,
  delete_stages,
  get_stage_round_list,
  get_stages_list,
  league_tour_create,
  league_tour_delete,
  league_tour_list,
  league_tour_running_status,
  league_tour_stage,
  league_tour_status,
  league_tour_teams,
  league_tour_update,
  league_tour_view,
  update_league_tour_stage,
  update_round_group,
  update_stage_status,
  update_stages,
} from "../../utils/endpoints";
import toast from "react-hot-toast";

// stages lists
export const getStages =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: GET_STAGE_LIST });
    try {
      const response = await axios.get(get_stages_list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      dispatch({ type: GET_STAGE_LIST_SUCCESS, payload: response?.data });
    } catch (error) {
      dispatch({ type: GET_STAGE_LIST_FAIL });
    }
  };

// Remove Status
export const deleteStage = (stage_id, callBack) => async (dispatch) => {
  dispatch({ type: STAGE_REMOVE });
  try {
    const response = await axios.get(`${delete_stages}/${stage_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: STAGE_REMOVE_SUCCESS });
    dispatch(getStages());
    toast.success(message);
    callBack();
  } catch (error) {
    dispatch({ type: STAGE_REMOVE_FAIL });

    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
    callBack();
  }
};

// Stage Status Update
export const updateStageStatus = (stage_id, payload) => async (dispatch) => {
  dispatch({ type: STAGE_STATUS_UPDATE });
  try {
    await axios.post(`${update_stage_status}/${stage_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    dispatch(getStages());
    dispatch({ type: STAGE_STATUS_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({ type: STAGE_STATUS_UPDATE_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// Create Stage
export const addStage = (payload, callBack) => async (dispatch) => {
  dispatch({ type: CREATE_STAGE });
  try {
    const response = await axios.post(create_stage, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: CREATE_STAGE_SUCCESS });
    dispatch(getStages());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: CREATE_STAGE_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// update stage
export const updateStage =
  (stage_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_STAGE });
    try {
      const response = await axios.post(
        `${update_stages}/${stage_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_STAGE_SUCCESS });
      dispatch(getStages());
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_STAGE_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// ------------------------ League Tournaments
export const getLeagueTour =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: GET_LEAGIE_TOUR_LIST });
    try {
      const response = await axios.get(league_tour_list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response.data;
      // if (data?.results?.length === 0) {
      //   // toast.error("No Record Found!");
      // }
      dispatch({ type: GET_LEAGIE_TOUR_LIST_SUCCESS, payload: data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server Error");
      dispatch({ type: GET_LEAGIE_TOUR_LIST_FAIL });
    }
  };
export const getLeagueTourTeams =
  (params = {}, id) =>
  async (dispatch) => {
    dispatch({ type: GET_LEAGIE_TOUR_TEAM_LIST });
    try {
      const response = await axios.get(`${league_tour_teams}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response.data;
      if (data?.results?.length === 0) {
        // toast.error("No Record Found!");
        dispatch({
          type: GET_LEAGIE_TOUR_TEAM_LIST_SUCCESS,
          payload: { result: [], paginnation: {} },
        });
      } else {
        dispatch({ type: GET_LEAGIE_TOUR_TEAM_LIST_SUCCESS, payload: data });
      }
    } catch (error) {
      // toast.error(error?.response?.data?.message || "Server Error");
      dispatch({
        type: GET_LEAGIE_TOUR_TEAM_LIST_FAIL,
        payload: {
          result: [],
          paginnation: {},
        },
      });
    }
  };

// add tournament
export const addLeagueTournament =
  (payload, callBack, params = {}) =>
  async (dispatch) => {
    dispatch({ type: CREATE_LEAGUE_TOUR });
    try {
      const response = await axios.post(league_tour_create, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: CREATE_LEAGUE_TOUR_SUCCESS });
      toast.success(message);
      dispatch(getLeagueTour(params));
      callBack();
    } catch (error) {
      dispatch({ type: CREATE_LEAGUE_TOUR_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update tournament
export const updateLeagueTour =
  (tour_id, payload, callBack, params = {}) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_LEAGUE_TOUR });
    try {
      const response = await axios.post(
        `${league_tour_update}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_LEAGUE_TOUR_SUCCESS });
      dispatch(getLeagueTour(params));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_LEAGUE_TOUR_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update tournament status
export const updateLeagueTourStatus =
  (tour_id, payload, params = {}) =>
  async (dispatch) => {
    dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE });
    try {
      await axios.post(`${league_tour_status}/${tour_id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      // const { message } = response.data;
      dispatch(getLeagueTour(params));
      dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE_SUCCESS });
      // toast.success(message);
    } catch (error) {
      dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE_FAIL });

      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        const { message } = error?.response?.data;
        toast.error(message);
      }
    }
  };

// delete tournament
export const deleteLeagueTournament =
  (tour_id, callBack, params) => async (dispatch) => {
    dispatch({ type: LEAGUE_TOUR_REMOVE });
    try {
      const response = await axios.get(`${league_tour_delete}/${tour_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: LEAGUE_TOUR_REMOVE_SUCCESS });
      dispatch(getLeagueTour(params));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: LEAGUE_TOUR_REMOVE_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update tournament running status
export const updateLeagurTourRunningStatus =
  (tour_id, payload, callBack, params = {}) =>
  async (dispatch) => {
    dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE });
    try {
      const response = await axios.post(
        `${league_tour_running_status}/${tour_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE_SUCCESS });
      dispatch(getLeagueTour(params));
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: LEAGUE_TOUR_STATUS_UPDATE_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// view tournament
export const viewLeaguTournament = (tour_id) => async (dispatch) => {
  dispatch({ type: VIEW_LEAGUE_TOUR });
  try {
    const response = await axios.get(`${league_tour_view}/${tour_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: VIEW_LEAGUE_TOUR_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VIEW_LEAGUE_TOUR_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// view tournament
export const getTourStages = (tour_id) => async (dispatch) => {
  dispatch({ type: GET_TOUR_STAGE });
  try {
    const response = await axios.get(`${league_tour_stage}/${tour_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: GET_TOUR_STAGE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TOUR_STAGE_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// update league tournaments
export const updateTourStages =
  (tour_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_TOUR_STAGE });
    try {
      const response = await axios.post(
        `${update_league_tour_stage}/${tour_id}/stages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_TOUR_STAGE_SUCCESS });
      dispatch(viewLeaguTournament(tour_id));
      dispatch(getTourStages(tour_id));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_TOUR_STAGE_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
///Delete League Tournmaent Stage
export const deleteTourStage = (stage_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_TOUR_STAGE });
  try {
    const response = await axios.get(
      `${delete_league_tour_stage}/${stage_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      }
    );
    const { message } = response.data;
    dispatch({ type: DELETE_TOUR_STAGE_SUCCESS });
    // dispatch(viewLeaguTournament(tour_id));
    // dispatch(getTourStages(tour_id));
    toast.success(message);
    callBack();
  } catch (error) {
    dispatch({ type: DELETE_TOUR_STAGE_FAIL });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      toast.error(message);
    } else {
      toast.error("Something went wrong!");
    }
  }
};

/// Stage Rounds

export const getStageRounds = (tour_id, stage_id) => async (dispatch) => {
  dispatch({ type: GET_STAGE_ROUND });
  try {
    const response = await axios.get(
      `${get_stage_round_list}/${tour_id}/stages/${stage_id}/rounds`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      }
    );
    const { data } = response.data;
    dispatch({ type: GET_STAGE_ROUND_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_STAGE_ROUND_FAIL });
  }
};

export const getTeamsStageWise = (stage_id, params) => async (dispatch) => {
  dispatch({ type: GET_TEAMS_STAGE_WISE });
  try {
    const response = await axios.get(
      `${get_stage_round_list}/tournament-stage/${stage_id}/get-teams`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      }
    );
    const { data } = response.data;
    dispatch({ type: GET_TEAMS_STAGE_WISE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TEAMS_STAGE_WISE_FAIL });
  }
};

export const createNextStageTeams =
  (payload, roundId, callBack) => async (dispatch) => {
    dispatch({ type: GET_TEAMS_STAGE_WISE });
    try {
      const response = await axios.post(
        `${get_stage_round_list}/stages/rounds/${roundId}/create-group`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { data } = response.data;
      // dispatch({ type: GET_TEAMS_STAGE_WISE_SUCCESS, payload: data });

      callBack();
    } catch (error) {
      dispatch({ type: GET_TEAMS_STAGE_WISE_FAIL });
    }
  };

export const AddStageRound =
  (tour_id, stage_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: ADD_STAGE_ROUND });
    try {
      const response = await axios.post(
        `${get_stage_round_list}/${tour_id}/stages/${stage_id}/create-round`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;

      dispatch({ type: ADD_STAGE_ROUND_SUCCESS });
      // dispatch(viewLeaguTournament(tour_id));
      dispatch(getStageRounds(tour_id, stage_id));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: ADD_STAGE_ROUND_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

export const deleteStageRound =
  (tour_id, round_id, callBack) => async (dispatch) => {
    dispatch({ type: DELETE_STAGE_ROUND });
    try {
      const response = await axios.get(
        `${get_stage_round_list}/stages/${round_id}/delete-round`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: DELETE_STAGE_ROUND_SUCCESS });
      // dispatch(viewLeaguTournament(tour_id));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: DELETE_STAGE_ROUND_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

///Add Group for round
export const AddroundGroup =
  (roundId, payload, callBack) => async (dispatch) => {
    dispatch({ type: ADD_ROUND_GROUP });
    try {
      const response = await axios.post(
        `${create_round_group}/${roundId}/create-group/automated`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;

      dispatch({ type: ADD_ROUND_GROUP_SUCCESS });
      // dispatch(viewLeaguTournament(tour_id));
      // dispatch(getStageRounds(tour_id, stage_id));
      dispatch(getroundGroup(roundId));
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: ADD_ROUND_GROUP_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
export const getroundGroup = (roundId) => async (dispatch) => {
  dispatch({ type: ADD_ROUND_GROUP });
  try {
    const response = await axios.get(
      `${create_round_group}/${roundId}/groups`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      }
    );

    dispatch({ type: ADD_ROUND_GROUP_SUCCESS, payload: response?.data });
    // dispatch(viewLeaguTournament(tour_id));
    // dispatch(getStageRounds(tour_id, stage_id));
  } catch (error) {
    dispatch({ type: ADD_ROUND_GROUP_FAIL, payload: { data: [] } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      // toast.error(message);
    } else {
      toast.error("Something went wrong!");
    }
  }
};
export const updateroundGroup =
  (lobbyId, roundId, payload, callBack) => async (dispatch) => {
    dispatch({ type: ADD_ROUND_GROUP });
    try {
      await axios.post(`${update_round_group}/${lobbyId}/date-time`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });

      dispatch(getroundGroup(roundId));
      callBack();
      // dispatch(viewLeaguTournament(tour_id));
      // dispatch(getStageRounds(tour_id, stage_id));
    } catch (error) {
      dispatch({ type: ADD_ROUND_GROUP_FAIL, payload: { data: [] } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        // toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

export const viewroundGroup = (lobbyId) => async (dispatch) => {
  dispatch({ type: VIEW_ROUND_GROUP });
  try {
    const res = await axios.get(`${create_round_group}/${lobbyId}/view-lobby`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    dispatch({ type: VIEW_ROUND_GROUP_SUCCESS, payload: res?.data });
    // dispatch(viewLeaguTournament(tour_id));
    // dispatch(getStageRounds(tour_id, stage_id));
  } catch (error) {
    dispatch({ type: VIEW_ROUND_GROUP_FAIL, payload: { data: [] } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      // toast.error(message);
    } else {
      toast.error("Something went wrong!");
    }
  }
};

export const updateLobbyStatus =
  (lobbyId, payload, roundId, callBack) => async (dispatch) => {
    dispatch({ type: VIEW_ROUND_GROUP });
    try {
      await axios.post(
        `${update_round_group}/${lobbyId}/running-status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      dispatch(getroundGroup(roundId));
      callBack();
      // dispatch(viewLeaguTournament(tour_id));
      // dispatch(getStageRounds(tour_id, stage_id));
    } catch (error) {
      dispatch({ type: VIEW_ROUND_GROUP_FAIL, payload: { data: [] } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        // toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

export const updateLobbyTeamsStatus =
  (lobbyId, payload) => async (dispatch) => {
    dispatch({ type: VIEW_ROUND_GROUP });
    try {
      const response = await axios.post(
        `${update_round_group}/${lobbyId}/promoted-status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      toast.success(response?.data?.message);
      // dispatch(viewLeaguTournament(tour_id));
      // dispatch(getStageRounds(tour_id, stage_id));
    } catch (error) {
      dispatch({ type: VIEW_ROUND_GROUP_FAIL, payload: { data: [] } });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        // toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
export const updateLobbyDetails = (lobbyId, payload) => async (dispatch) => {
  dispatch({ type: VIEW_ROUND_GROUP });
  try {
    await axios.post(`${update_round_group}/${lobbyId}/room-details`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    dispatch(viewroundGroup(lobbyId));
    // dispatch(viewLeaguTournament(tour_id));
    // dispatch(getStageRounds(tour_id, stage_id));
  } catch (error) {
    dispatch({ type: VIEW_ROUND_GROUP_FAIL, payload: { data: [] } });
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      // toast.error(message);
    } else {
      toast.error("Something went wrong!");
    }
  }
};

export const updateLobbyRank =
  (lobbyId, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_LOBBY_RESULT });
    try {
      await axios.post(`${update_round_group}/${lobbyId}/lobby-rank`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      // dispatch(viewroundGroup(lobbyId));
      dispatch({ type: UPDATE_LOBBY_RESULT_SUCCESS });
      dispatch(viewroundGroup(lobbyId));
      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_LOBBY_RESULT_FAIL });
      if (error?.response?.data) {
        const { message } = error?.response?.data;
        // toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
