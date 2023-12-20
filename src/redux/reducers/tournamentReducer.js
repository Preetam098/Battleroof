import {
  ADD_TOURNAMENT,
  ADD_TOURNAMENT_FAIL,
  ADD_TOURNAMENT_SUCCESS,
  DELETE_TEAM,
  DELETE_TEAM_FAIL,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_Player,
  DELETE_TEAM_Player_FAIL,
  DELETE_TEAM_Player_SUCCESS,
  TOURNAMENT_SUCCESS,
  UPDATE_ROOM_ID,
  UPDATE_ROOM_ID_FAIL,
  UPDATE_ROOM_ID_SUCCESS,
  UPDATE_TEAM_RANK,
  UPDATE_TEAM_RANK_FAIL,
  UPDATE_TEAM_RANK_SUCCESS,
  UPDATE_TOUR,
  UPDATE_TOUR_FAIL,
  UPDATE_TOUR_SUCCESS,
  VIEW_TOUR_SUCCESS,
  ALL_TEAM_LIST,
  ALL_TEAM_LIST_SUCCESS,
  ALL_TEAM_LIST_FAIL,
  UPDATE_STREAMING_LINK,
  UPDATE_STREAMING_LINK_SUCCESS,
  UPDATE_STREAMING_LINK_FAIL,
  TOURNAMENT_FAIL,
} from "../actions";

const initialState = {
  loading: false,
  isLoading: false,
  tournaments: {},
  viewtour: {},
  allTeam: [],
};

const tournamentReducer = (state = initialState, action) => {
  switch (action.type) {
    // get lists
    case TOURNAMENT_SUCCESS:
      return { ...state, tournaments: action.payload, loading: false };
    case TOURNAMENT_FAIL:
      return { ...state, tournaments: action.payload, loading: false };

    // view tour
    case VIEW_TOUR_SUCCESS:
      return { ...state, viewtour: action.payload, loading: false };

    // add tournament
    case ADD_TOURNAMENT:
      return { ...state, loading: true };
    case ADD_TOURNAMENT_SUCCESS:
      return { ...state, loading: false };
    case ADD_TOURNAMENT_FAIL:
      return { ...state, loading: false };

    // Create room id & password
    case UPDATE_ROOM_ID:
      return { ...state, loading: true };
    case UPDATE_ROOM_ID_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_ROOM_ID_FAIL:
      return { ...state, loading: false };

    // update tournament
    case UPDATE_TOUR:
      return { ...state, loading: true };
    case UPDATE_TOUR_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_TOUR_FAIL:
      return { ...state, loading: false };

    // update team rank
    case UPDATE_TEAM_RANK:
      return { ...state, loading: true };
    case UPDATE_TEAM_RANK_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_TEAM_RANK_FAIL:
      return { ...state, loading: false };

    // delete team
    case DELETE_TEAM:
      return { ...state, loading: true };
    case DELETE_TEAM_SUCCESS:
      return { ...state, loading: false };
    case DELETE_TEAM_FAIL:
      return { ...state, loading: false };

    // delete team player
    case DELETE_TEAM_Player:
      return { ...state, loading: true };
    case DELETE_TEAM_Player_SUCCESS:
      return { ...state, loading: false };
    case DELETE_TEAM_Player_FAIL:
      return { ...state, loading: false };

    // ALL TEAM
    case ALL_TEAM_LIST:
      return { ...state, loading: true, allTeam: action.payload };
    case ALL_TEAM_LIST_SUCCESS:
      return { ...state, loading: false, allTeam: action.payload };
    case ALL_TEAM_LIST_FAIL:
      return { ...state, loading: false };

    // update streaming link
    case UPDATE_STREAMING_LINK:
      return { ...state, isLoading: true };
    case UPDATE_STREAMING_LINK_SUCCESS:
      return { ...state, isLoading: false };
    case UPDATE_STREAMING_LINK_FAIL:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default tournamentReducer;
