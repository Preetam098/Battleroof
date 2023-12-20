import { combineReducers } from "redux";
import authReducer from "./authReducer";
import gameReducer from "./gameReducer";
import userReducer from "./userReducer";
import notificationReducer from "./notificationReducer";
import tournamentReducer from "./tournamentReducer";
import sponsorReducer from "./sponsorReducer";
import leagueReducer from './leagueReducer'
const rootReducer = combineReducers({
  authReducer,
  tournamentReducer,
  gameReducer,
  userReducer,
  notificationReducer,
  sponsorReducer,
  leagueReducer
});

export default rootReducer;
