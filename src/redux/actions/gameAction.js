import axios from "axios";
import {
  DELETE_GAME,
  GAME_LIST,
  GAME_LIST_FAIL,
  GAME_LIST_SUCCESS,
  DELETE_GAME_SUCCESS,
  DELETE_GAME_FAIL,
  UPDATE_GAME_STATUS,
  UPDATE_GAME_STATUS_SUCCESS,
  UPDATE_GAME_STATUS_FAIL,
  GAME_TYPE_LIST,
  GAME_TYPE_LIST_SUCCESS,
  GAME_TYPE_LIST_FAIL,
  ADD_GAME,
  ADD_GAME_SUCCESS,
  ADD_GAME_FAIL,
  UPDATE_GAME,
  UPDATE_GAME_SUCCESS,
  UPDATE_GAME_FAIL,
  VIEW_GAME,
  VIEW_GAME_SUCCESS,
  VIEW_GAME_FAIL,
  GAME_PLAYER_LISTS,
  GAME_PLAYER_LISTS_FAIL,
  GAME_PLAYER_DETAILS,
  GAME_PLAYER_DETAILS_SUCCESS,
  GAME_PLAYER_DETAILS_FAIL,
  ADD_PLACEMENT_POINTS,
  ADD_PLACEMENT_POINTS_SUCCESS,
  ADD_PLACEMENT_POINTS_FAIL,
  GET_PLACEMENT_POINTS,
  GET_PLACEMENT_POINTS_SUCCESS,
  GET_PLACEMENT_POINTS_FAIL,
} from ".";
import {
  add_game,
  add_game_type,
  add_placement,
  delete_game,
  delete_game_type,
  game__type_list,
  game_list,
  game_played_list,
  game_status,
  game_status_type,
  game_view,
  get_placement,
  player_view,
  update_game,
  update_game_type,
} from "../../utils/endpoints";
import { toast } from "react-hot-toast";

// game list
export const getGames =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: GAME_LIST });
    try {
      const response = await axios.get(game_list, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        params,
      });
      const { data } = response.data;
      dispatch({ type: GAME_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: GAME_LIST_FAIL });
    }
  };

// add game
export const addGame = (payload, callBack) => async (dispatch) => {
  dispatch({ type: ADD_GAME });
  try {
    const response = await axios.post(add_game, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: ADD_GAME_SUCCESS });
    dispatch(getGames());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: ADD_GAME_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// add placement points
export const addPlacementPoints =
  (payload, gameId, callBack) => async (dispatch) => {
    dispatch({ type: ADD_PLACEMENT_POINTS });
    try {
      const response = await axios.post(`${add_placement}/${gameId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      const { message } = response.data;
      dispatch({ type: ADD_PLACEMENT_POINTS_SUCCESS });
      toast.success(message);
      callBack();
    } catch (error) {
      dispatch({ type: ADD_PLACEMENT_POINTS_FAIL });
      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// get placement points
export const getPlacementPoints = (gameId, callBack) => async (dispatch) => {
  dispatch({ type: GET_PLACEMENT_POINTS });
  try {
    const response = await axios.get(`${get_placement}/${gameId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { placementPoints } = response.data.data;
    callBack && callBack(placementPoints);
    dispatch({ type: GET_PLACEMENT_POINTS_SUCCESS, payload: placementPoints });
  } catch (error) {
    dispatch({ type: GET_PLACEMENT_POINTS_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// update game
export const updateGame = (game_id, payload, callBack) => async (dispatch) => {
  dispatch({ type: UPDATE_GAME });
  try {
    const response = await axios.post(`${update_game}/${game_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: UPDATE_GAME_SUCCESS });
    dispatch(getGames());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: UPDATE_GAME_FAIL });
    if (error?.response?.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// delete game
export const deleteGame = (game_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_GAME });
  try {
    const response = await axios.get(`${delete_game}/${game_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_GAME_SUCCESS });
    dispatch(getGames());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: DELETE_GAME_FAIL });

    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
    callBack();
  }
};

// view game
export const viewGame = (game_id) => async (dispatch) => {
  dispatch({ type: VIEW_GAME });
  try {
    const response = await axios.get(`${game_view}/${game_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: VIEW_GAME_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: VIEW_GAME_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// update game status
export const updateGameStatus = (game_id, payload) => async (dispatch) => {
  dispatch({ type: UPDATE_GAME_STATUS });
  try {
    await axios.post(`${game_status}/${game_id}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    // const { message } = response.data;
    dispatch(getGames());
    dispatch({ type: UPDATE_GAME_STATUS_SUCCESS });
    // toast.success(message);
  } catch (error) {
    dispatch({ type: UPDATE_GAME_STATUS_FAIL });

    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      const { message } = error?.response?.data;
      toast.error(message);
    }
  }
};

// -------------------------------- Game Types --------------------------------//

// game types list
export const getGameTypes = () => async (dispatch) => {
  dispatch({ type: GAME_TYPE_LIST });
  try {
    const response = await axios.get(game__type_list, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;
    dispatch({ type: GAME_TYPE_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GAME_TYPE_LIST_FAIL });
  }
};

// add game type
export const addGameType = (payload, callBack) => async (dispatch) => {
  dispatch({ type: ADD_GAME });
  try {
    const response = await axios.post(add_game_type, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: ADD_GAME_SUCCESS });
    dispatch(getGameTypes());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: ADD_GAME_FAIL });
    if (error.response.status === 500) {
      toast.error(error.message);
    } else {
      // const { msg } = error?.response?.data?.error?.errors?.[0];
      // toast.error(msg);
    }
  }
};

// delete game type
export const deleteGameType = (game__type_id, callBack) => async (dispatch) => {
  dispatch({ type: DELETE_GAME });
  try {
    const response = await axios.get(`${delete_game_type}/${game__type_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { message } = response.data;
    dispatch({ type: DELETE_GAME_SUCCESS });
    dispatch(getGameTypes());
    toast.success(message);

    callBack();
  } catch (error) {
    dispatch({ type: DELETE_GAME_FAIL });

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
export const updateGameType =
  (game_type_id, payload, callBack) => async (dispatch) => {
    dispatch({ type: UPDATE_GAME });
    try {
      const response = await axios.post(
        `${update_game_type}/${game_type_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      const { message } = response.data;
      dispatch({ type: UPDATE_GAME_SUCCESS });
      dispatch(getGameTypes());
      toast.success(message);

      callBack();
    } catch (error) {
      dispatch({ type: UPDATE_GAME_FAIL });
      if (error?.response?.status === 500) {
        toast.error(error.message);
      } else {
        // const { msg } = error?.response?.data?.error?.errors?.[0];
        // toast.error(msg);
      }
    }
  };

// update game type status
export const updateGameTypeStatus =
  (game_type_id, payload) => async (dispatch) => {
    dispatch({ type: UPDATE_GAME_STATUS });
    try {
      await axios.post(`${game_status_type}/${game_type_id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });
      dispatch(getGameTypes());
      dispatch({ type: UPDATE_GAME_STATUS_SUCCESS });
    } catch (error) {
      dispatch({ type: UPDATE_GAME_STATUS_FAIL });

      if (error.response.status === 500) {
        toast.error(error.message);
      } else {
        const { message } = error?.response?.data;
        toast.error(message);
      }
    }
  };

// game player Lists
export const gamePlayerList = (query) => async (dispatch) => {
  dispatch({ type: GAME_PLAYER_LISTS });
  try {
    const response = await axios.get(`${game_played_list}/${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
      },
    });
    const { data } = response.data;

    dispatch({ type: GAME_PLAYER_LISTS, payload: data });
  } catch (error) {
    dispatch({ type: GAME_PLAYER_LISTS_FAIL });
  }
};

// game player details
export const gamePlayersTdmDetails = (query) => async (dispatch) => {
  dispatch({ type: GAME_PLAYER_DETAILS });

  try {
    const response = await axios.get(`${player_view}/${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        "Content-Type": "application/json",
      },
    });
    const { data } = response.data;
    dispatch({ type: GAME_PLAYER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GAME_PLAYER_DETAILS_FAIL });
  }
};
