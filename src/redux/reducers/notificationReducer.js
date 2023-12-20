import {
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_FAIL,
  ADD_NOTIFICATION_SUCCESS,
  NOTIFICATION_LIST,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_LIST_SUCCESS,
  STATUS_NOTIFICATION,
  STATUS_NOTIFICATION_FAIL,
  STATUS_NOTIFICATION_SUCCESS,
} from "../actions";

const initialState = {
  loading: false,
  fetchLoading: false,
  notification: {},
  notification_status: true,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET Notification
    case NOTIFICATION_LIST:
      return { ...state, fetchLoading: true };
    case NOTIFICATION_LIST_SUCCESS:
      return { ...state, notification: action.payload, fetchLoading: false };
    case NOTIFICATION_LIST_FAIL:
      return { ...state, fetchLoading: false };

    // Add Notification
    case ADD_NOTIFICATION:
      return { ...state, loading: true };
    case ADD_NOTIFICATION_FAIL:
      return { ...state, loading: false };
    case ADD_NOTIFICATION_SUCCESS:
      return { ...state, loading: false };

    // Add Notification Status
    case STATUS_NOTIFICATION:
      return { ...state, notification_status: action.payload, loading: true };
    case STATUS_NOTIFICATION_FAIL:
      return { ...state, loading: false };
    case STATUS_NOTIFICATION_SUCCESS:
      return { ...state, notification_status: action.payload, loading: false };

    default:
      return state;
  }
};

export default notificationReducer;
