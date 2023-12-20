import {
  LOG_IN,
  LOG_IN_FAIL,
  LOG_IN_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_SETTING,
  UPDATE_SETTING_FAIL,
  UPDATE_SETTING_SUCCESS,
  VIEW_SETTING_SUCCESS,
} from "../actions";

const initialState = {
  loading: false,
  setting: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // login
    case LOG_IN:
      return { ...state, loading: true };
    case LOG_IN_SUCCESS:
      return { ...state, loading: false };
    case LOG_IN_FAIL:
      return { ...state, loading: false };

    // view setting
    case VIEW_SETTING_SUCCESS:
      return { ...state, setting: action.payload, loading: false };

    // update profile
    case UPDATE_PROFILE:
      return { ...state, loading: true };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_PROFILE_FAIL:
      return { ...state, loading: false };

    // update profile
    case UPDATE_SETTING:
      return { ...state, loading: true };
    case UPDATE_SETTING_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_SETTING_FAIL:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default authReducer;
