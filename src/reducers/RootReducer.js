import { combineReducers } from "redux";

export default function rootReducer(state, action) {
  const appReducer = combineReducers({
    // orgs,
  });
  return appReducer(state, action);
}
