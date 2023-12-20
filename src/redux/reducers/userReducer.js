import {
  DELETE_USER,
  DELETE_USER_FAIL,
  DELETE_USER_SUCCESS,
  PLAYER_LIST_SUCCESS,
  PLAYER_VIEW_SUCCESS,
  TEAM_LIST_SUCCESS,
  TEAM_VIEW_SUCCESS,
  TRANSACTION_LOGS_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_WALLET,
  UPDATE_USER_WALLET_FAIL,
  UPDATE_USER_WALLET_SUCCESS,
  USER_LIST,
  USER_LIST_FAIL,
  USER_LIST_SUCCESS,
  WITHDRAW_REQUEST_SUCCESS,
  TDM_PLAYER_LISTS,
  TDM_PLAYER_LISTS_SUCCESS,
  TDM_PLAYER_LISTS_FAIL,
  TDM_PLAYER_DETAILS,
  TDM_PLAYER_DETAILS_SUCCESS,
  TDM_PLAYER_DETAILS_FAIL,
  RECORD_COUNT,
  RECORD_COUNT_SUCCESS,
  RECORD_COUNT_FAIL,
  TOTAL_AMOUNT,
  TOTAL_AMOUNT_SUCCESS,
  TOTAL_AMOUNT_FAIL,
  TRANSACTION_LIST,
  TRANSACTION_LIST_SUCCESS,
  TRANSACTION_LIST_FAIL,
  TRANSACTION_LIST_BY_Id,
  TRANSACTION_LIST_SUCCESS_BY_Id,
  TRANSACTION_LIST_FAIL_BY_Id,
  View_SUPPORT,
  View_SUPPORT_SUCCESS,
  View_SUPPORT_FAIL,
  TRANSACTION_LOGS_FAIL,
  TRANSACTION_LOGS,
  WITHDRAW_REQUEST_FAIL,
  WITHDRAW_REQUEST,
  REGISTRATION_RECORD_COUNT,
  REGISTRATION_RECORD_COUNT_SUCCESS,
  REGISTRATION_RECORD_COUNT_FAIL,
  DEVICE_RECORD_COUNT,
  DEVICE_RECORD_COUNT_SUCCESS,
  DEVICE_RECORD_COUNT_FAIL,
} from "../actions";

const initialState = {
  loading: false,
  fetchLoader: false,
  users: {},
  teams: {},
  teamview: {},
  players: [],
  playerview: {},
  transactions: [],
  withdraw_list: [],
  tdmPlayerList: {},
  tdmPlayerDetails: {},
  recordCount: {},
  registrationCount: [],
  totalAmount: {},
  transactionList: [],
  viewSupportData: [],
  deviceCount: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // GET USER LIST
    case USER_LIST:
      return { ...state, fetchLoader: true };
    case USER_LIST_SUCCESS:
      return { ...state, fetchLoader: false, users: action.payload };
    case USER_LIST_FAIL:
      return { ...state, fetchLoader: false };

    // GET TEAM LIST
    case TEAM_LIST_SUCCESS:
      return { ...state, teams: action.payload };

    // GET TEAM VIEW
    case TEAM_VIEW_SUCCESS:
      return { ...state, teamview: action.payload };

    // GET Transactions
    case TRANSACTION_LOGS:
      return { ...state, fetchLoader: true };
    case TRANSACTION_LOGS_SUCCESS:
      return { ...state, transactions: action.payload, fetchLoader: false };
    case TRANSACTION_LOGS_FAIL:
      return { ...state, fetchLoader: false };

    // GET PLayer VIEW
    case PLAYER_VIEW_SUCCESS:
      return { ...state, playerview: action.payload };

    // GET Player LIST
    case PLAYER_LIST_SUCCESS:
      return { ...state, players: action.payload };

    // GET Withdraw Requests
    case WITHDRAW_REQUEST:
      return { ...state, fetchLoader: true };
    case WITHDRAW_REQUEST_SUCCESS:
      return { ...state, withdraw_list: action.payload, fetchLoader: false };
    case WITHDRAW_REQUEST_FAIL:
      return { ...state, fetchLoader: false };

    // UPDATE USER
    case UPDATE_USER:
      return { ...state, loading: true };
    case UPDATE_USER_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_USER_FAIL:
      return { ...state, loading: false };

    // Delete USER
    case DELETE_USER:
      return { ...state, loading: true };
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false };
    case DELETE_USER_FAIL:
      return { ...state, loading: false };

    // UPDATE USER Wallet
    case UPDATE_USER_WALLET:
      return { ...state, loading: true };
    case UPDATE_USER_WALLET_SUCCESS:
      return { ...state, loading: false };
    case UPDATE_USER_WALLET_FAIL:
      return { ...state, loading: false };

    // GET TDM Player LIST
    case TDM_PLAYER_LISTS:
      return { ...state, tdmPlayerList: action.payload };
    case TDM_PLAYER_LISTS_SUCCESS:
      return { ...state, loading: false, tdmPlayerList: action.payload };
    case TDM_PLAYER_LISTS_FAIL:
      return { ...state, loading: false };

    case TDM_PLAYER_DETAILS:
      return { ...state, tdmPlayerDetails: action.payload };
    case TDM_PLAYER_DETAILS_SUCCESS:
      return { ...state, loading: false, tdmPlayerDetails: action.payload };
    case TDM_PLAYER_DETAILS_FAIL:
      return { ...state, loading: false };

    case RECORD_COUNT:
      return { ...state, recordCount: action.payload };
    case RECORD_COUNT_SUCCESS:
      return { ...state, loading: false, recordCount: action.payload };
    case RECORD_COUNT_FAIL:
      return { ...state, loading: false };

    case REGISTRATION_RECORD_COUNT:
      return { ...state, loading: true, registrationCount: action.payload };
    case REGISTRATION_RECORD_COUNT_SUCCESS:
      return { ...state, loading: false, registrationCount: action.payload };
    case REGISTRATION_RECORD_COUNT_FAIL:
      return { ...state, loading: false };
    case DEVICE_RECORD_COUNT:
      return { ...state, deviceCount: action.payload };
    case DEVICE_RECORD_COUNT_SUCCESS:
      return { ...state, loading: false, deviceCount: action.payload };
    case DEVICE_RECORD_COUNT_FAIL:
      return { ...state, loading: false };

    case TOTAL_AMOUNT:
      return { ...state, totalAmount: action.payload };
    case TOTAL_AMOUNT_SUCCESS:
      return { ...state, loading: false, totalAmount: action.payload };
    case TOTAL_AMOUNT_FAIL:
      return { ...state, loading: false };

    case TRANSACTION_LIST:
      return { ...state, fetchLoader: true };
    case TRANSACTION_LIST_SUCCESS:
      return { ...state, fetchLoader: false, transactionList: action.payload };
    case TRANSACTION_LIST_FAIL:
      return { ...state, fetchLoader: false };

    case TRANSACTION_LIST_BY_Id:
      return { ...state };
    case TRANSACTION_LIST_SUCCESS_BY_Id:
      return { ...state, loading: false, transactionList: action.payload };
    case TRANSACTION_LIST_FAIL_BY_Id:
      return { ...state, loading: false };

    case View_SUPPORT:
      return { ...state, viewSupportData: action.payload };
    case View_SUPPORT_SUCCESS:
      return { ...state, loading: false, viewSupportData: action.payload };
    case View_SUPPORT_FAIL:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default userReducer;
