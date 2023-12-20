import {
  SPONSOR_LIST,
  SPONSOR_LIST_FAIL,
  SPONSOR_LIST_SUCCESS,
  ADD_SPONSOR,
  ADD_SPONSOR_FAIL,
  ADD_SPONSOR_SUCCESS,
  UPDATE_SPONSOR,
  UPDATE_SPONSOR_FAIL,
  UPDATE_SPONSOR_SUCCESS,
} from "../actions";

const initialState = {
  loading: false,
  sponsor: {},
};

const sponsorReducer = (state = initialState, action) => {
  switch (action.type) {
    //Get Sponsor
    case SPONSOR_LIST:
      return { ...state };
    case SPONSOR_LIST_SUCCESS:
      return { ...state, sponsor: action.payload };
    case SPONSOR_LIST_FAIL:
      return { ...state };

    //Add sponsor
    case ADD_SPONSOR:
      return { ...state, loading: true };
    case ADD_SPONSOR_SUCCESS:
      return { ...state, loading: false };
    case ADD_SPONSOR_FAIL:
      return { ...state, loading: false };

    // UPDATE Sponsor
    case UPDATE_SPONSOR:
      return { ...state, loading: true };
    case UPDATE_SPONSOR_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_SPONSOR_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default sponsorReducer;
