import {
  CREATE_LEAGUE_TOUR,
  CREATE_LEAGUE_TOUR_FAIL,
  CREATE_LEAGUE_TOUR_SUCCESS,
  CREATE_STAGE,
  CREATE_STAGE_FAIL,
  CREATE_STAGE_SUCCESS,
  GET_LEAGIE_TOUR_LIST,
  GET_LEAGIE_TOUR_LIST_FAIL,
  GET_LEAGIE_TOUR_LIST_SUCCESS,
  GET_STAGE_LIST,
  GET_STAGE_LIST_SUCCESS,
  GET_TOUR_STAGE,
  GET_TOUR_STAGE_FAIL,
  GET_TOUR_STAGE_SUCCESS,
  LEAGUE_TOUR_REMOVE,
  LEAGUE_TOUR_REMOVE_FAIL,
  LEAGUE_TOUR_REMOVE_SUCCESS,
  STAGE_REMOVE,
  STAGE_REMOVE_FAIL,
  STAGE_REMOVE_SUCCESS,
  UPDATE_LEAGUE_TOUR,
  UPDATE_LEAGUE_TOUR_FAIL,
  UPDATE_LEAGUE_TOUR_SUCCESS,
  UPDATE_STAGE,
  UPDATE_STAGE_FAIL,
  UPDATE_STAGE_SUCCESS,
  UPDATE_TOUR_STAGE,
  UPDATE_TOUR_STAGE_FAIL,
  UPDATE_TOUR_STAGE_SUCCESS,
  VIEW_LEAGUE_TOUR,
  VIEW_LEAGUE_TOUR_FAIL,
  VIEW_LEAGUE_TOUR_SUCCESS,
  GET_STAGE_ROUND,
  GET_STAGE_ROUND_FAIL,
  GET_STAGE_ROUND_SUCCESS,
  GET_STAGE_LIST_FAIL,
  ADD_STAGE_ROUND,
  ADD_STAGE_ROUND_SUCCESS,
  ADD_STAGE_ROUND_FAIL,
  GET_LEAGIE_TOUR_TEAM_LIST,
  GET_LEAGIE_TOUR_TEAM_LIST_SUCCESS,
  GET_LEAGIE_TOUR_TEAM_LIST_FAIL,
  ADD_ROUND_GROUP,
  ADD_ROUND_GROUP_SUCCESS,
  ADD_ROUND_GROUP_FAIL,
  VIEW_ROUND_GROUP,
  VIEW_ROUND_GROUP_SUCCESS,
  VIEW_ROUND_GROUP_FAIL,
  UPDATE_LOBBY_RESULT,
  UPDATE_LOBBY_RESULT_SUCCESS,
  UPDATE_LOBBY_RESULT_FAIL,
  GET_TEAMS_STAGE_WISE,
  GET_TEAMS_STAGE_WISE_SUCCESS,
  GET_TEAMS_STAGE_WISE_FAIL,
} from "../actions";

const initialState = {
  loading: false,
  fetchLoader: false,
  stageData: [],
  tourData: {},
  viewtour: {},
  tourStage: [],
  stageRound: [],
  leagueTeams: {},
  roundTeams: {},
  lobbyData: {},
  teamsStageWise: [],
};

const leagueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMS_STAGE_WISE:
      return { ...state, loading: true };
    case GET_TEAMS_STAGE_WISE_SUCCESS:
      return { ...state, teamsStageWise: action.payload, loading: false };
    case GET_TEAMS_STAGE_WISE_FAIL:
      return { ...state, loading: false };

    case UPDATE_LOBBY_RESULT:
      return { ...state, loading: true };
    case UPDATE_LOBBY_RESULT_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_LOBBY_RESULT_FAIL:
      return { ...state, loading: false };
    ///View Lobby :
    case VIEW_ROUND_GROUP:
      return { ...state, fetchLoader: true };
    case VIEW_ROUND_GROUP_SUCCESS:
      return { ...state, lobbyData: action.payload, fetchLoader: false };
    case VIEW_ROUND_GROUP_FAIL:
      return { ...state, fetchLoader: false, lobbyData: action.payload };
    ///GEt stage round
    case ADD_ROUND_GROUP:
      return { ...state, loading: true };
    case ADD_ROUND_GROUP_SUCCESS:
      return { ...state, roundTeams: action.payload, loading: false };
    case ADD_ROUND_GROUP_FAIL:
      return { ...state, loading: false, roundTeams: action.payload };
    case GET_STAGE_ROUND:
      return { ...state, fetchLoader: true };
    case GET_STAGE_ROUND_SUCCESS:
      return { ...state, stageRound: action.payload, fetchLoader: false };
    case GET_STAGE_ROUND_FAIL:
      return { ...state, fetchLoader: false };
    ///League teams
    case GET_LEAGIE_TOUR_TEAM_LIST:
      return { ...state, loading: true };
    case GET_LEAGIE_TOUR_TEAM_LIST_SUCCESS:
      return { ...state, leagueTeams: action.payload, loading: false };
    case GET_LEAGIE_TOUR_TEAM_LIST_FAIL:
      return { ...state, loading: false, leagueTeams: action.payload };

    ///ADd Stage rounf
    case ADD_STAGE_ROUND:
      return { ...state, loading: true };
    case ADD_STAGE_ROUND_SUCCESS:
      return { ...state, loading: false };
    case ADD_STAGE_ROUND_FAIL:
      return { ...state, loading: false };
    // Get STage List
    case GET_STAGE_LIST:
      return { ...state, fetchLoader: true };
    case GET_STAGE_LIST_SUCCESS:
      return { ...state, stageData: action.payload, fetchLoader: false };
    case GET_STAGE_LIST_FAIL:
      return { ...state, fetchLoader: false };

    // Get League Tour List
    case GET_LEAGIE_TOUR_LIST:
      return { ...state, fetchLoader: true };
    case GET_LEAGIE_TOUR_LIST_SUCCESS:
      return { ...state, tourData: action.payload, fetchLoader: false };
    case GET_LEAGIE_TOUR_LIST_FAIL:
      return { ...state, fetchLoader: false };

    // Remove Stage
    case STAGE_REMOVE:
      return { ...state, loading: true };
    case STAGE_REMOVE_SUCCESS:
      return { ...state, loading: false };
    case STAGE_REMOVE_FAIL:
      return { ...state, loading: false };

    // View League Tour
    case VIEW_LEAGUE_TOUR:
      return { ...state, fetchLoader: true };
    case VIEW_LEAGUE_TOUR_SUCCESS:
      return { ...state, viewtour: action.payload, fetchLoader: false };
    case VIEW_LEAGUE_TOUR_FAIL:
      return { ...state, fetchLoader: false };

    // Get Tour stage
    case GET_TOUR_STAGE:
      return { ...state, fetchLoader: true };
    case GET_TOUR_STAGE_SUCCESS:
      return { ...state, tourStage: action.payload, fetchLoader: false };
    case GET_TOUR_STAGE_FAIL:
      return { ...state, fetchLoader: false };

    // Update Tour stage
    case UPDATE_TOUR_STAGE:
      return { ...state, loading: true };
    case UPDATE_TOUR_STAGE_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_TOUR_STAGE_FAIL:
      return { ...state, loading: false };

    // Remove  Lagoue Tour
    case LEAGUE_TOUR_REMOVE:
      return { ...state, loading: true };
    case LEAGUE_TOUR_REMOVE_SUCCESS:
      return { ...state, loading: false };
    case LEAGUE_TOUR_REMOVE_FAIL:
      return { ...state, loading: false };

    // Create Stage
    case CREATE_STAGE:
      return { ...state, loading: true };
    case CREATE_STAGE_SUCCESS:
      return { ...state, loading: false };
    case CREATE_STAGE_FAIL:
      return { ...state, loading: false };

    // Create League Tour
    case CREATE_LEAGUE_TOUR:
      return { ...state, loading: true };
    case CREATE_LEAGUE_TOUR_SUCCESS:
      return { ...state, loading: false };
    case CREATE_LEAGUE_TOUR_FAIL:
      return { ...state, loading: false };

    // Update Stage
    case UPDATE_STAGE:
      return { ...state, loading: true };
    case UPDATE_STAGE_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_STAGE_FAIL:
      return { ...state, loading: false };

    // Update League Tour
    case UPDATE_LEAGUE_TOUR:
      return { ...state, loading: true };
    case UPDATE_LEAGUE_TOUR_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_LEAGUE_TOUR_FAIL:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default leagueReducer;
