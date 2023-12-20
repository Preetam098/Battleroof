import {
  ADD_GAME,
  ADD_GAME_FAIL,
  ADD_GAME_SUCCESS,
  DELETE_GAME,
  DELETE_GAME_FAIL,
  DELETE_GAME_SUCCESS,
  GAME_LIST_SUCCESS,
  GAME_TYPE_LIST,
  GAME_TYPE_LIST_FAIL,
  GAME_TYPE_LIST_SUCCESS,
  UPDATE_GAME,
  UPDATE_GAME_FAIL,
  UPDATE_GAME_SUCCESS,
  VIEW_GAME_SUCCESS,
  GAME_PLAYER_LISTS,
  GAME_PLAYER_LISTS_SUCCESS,
  GAME_PLAYER_LISTS_FAIL,
  GET_PLACEMENT_POINTS_SUCCESS,
  ADD_PLACEMENT_POINTS,
  ADD_PLACEMENT_POINTS_SUCCESS,
  ADD_PLACEMENT_POINTS_FAIL,
} from "../actions";

const initialState = {
  loading: false,
  games: {},
  viewgame: {},
  gameTypes: {},
  gamePlayerLists: {},
  gamePlayersDetails: {},
  placementPoints: [],
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    // game lists
    case GAME_LIST_SUCCESS:
      return { ...state, games: action.payload };

    // game lists
    case GET_PLACEMENT_POINTS_SUCCESS:
      return { ...state, placementPoints: action.payload };

    // GAME view
    case VIEW_GAME_SUCCESS:
      return { ...state, viewgame: action.payload };

    case DELETE_GAME:
      return { ...state, loading: true };
    case DELETE_GAME_SUCCESS:
      return { ...state, loading: false };
    case DELETE_GAME_FAIL:
      return { ...state, loading: false };

    // GET GAME TYPE
    case GAME_TYPE_LIST:
      return { ...state };
    case GAME_TYPE_LIST_SUCCESS:
      return { ...state, gameTypes: action.payload };
    case GAME_TYPE_LIST_FAIL:
      return { ...state };

    // ADD GAME & GAME TYPE
    case ADD_GAME:
      return { ...state, loading: true };
    case ADD_GAME_SUCCESS:
      return { ...state, loading: false };
    case ADD_GAME_FAIL:
      return { ...state, loading: false };

    // ADD Placement Points
    case ADD_PLACEMENT_POINTS:
      return { ...state, loading: true };
    case ADD_PLACEMENT_POINTS_SUCCESS:
      return { ...state, loading: false };
    case ADD_PLACEMENT_POINTS_FAIL:
      return { ...state, loading: false };

    // UPDATE GAME & GAME TYPE
    case UPDATE_GAME:
      return { ...state, loading: true };
    case UPDATE_GAME_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_GAME_FAIL:
      return { ...state, loading: false };

    // UPDATE GAME PLAYER
    case GAME_PLAYER_LISTS:
      return { ...state, loading: true, gamePlayerLists: action.payload };
    case GAME_PLAYER_LISTS_SUCCESS:
      return { ...state, loading: false, gamePlayerLists: action.payload };
    case GAME_PLAYER_LISTS_FAIL:
      return { ...state, loading: false };

    // UPDATE GAME PLAYER DETAILS
    // case GAME_PLAYER_LISTS:
    //   return { ...state, loading: true, gamePlayersDetails: action.payload };
    // case GAME_PLAYER_LISTS_SUCCESS:
    //   return { ...state, loading: false, gamePlayersDetails: action.payload };
    // case GAME_PLAYER_LISTS_FAIL:
    //   return { ...state, loading: false };

    default:
      return state;
  }
};

export default gameReducer;
