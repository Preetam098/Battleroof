import { applyMiddleware, createStore } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const isDevelopment = process.env.NODE_ENV === "development";

const store = createStore(
  rootReducer,
  isDevelopment
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)
);

export default store;
