import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import espnRPI from './espnRPI';
import espnBPI from './espnBPI';
import confChamps from './confChamps';
import currentUserBrackets from './currentUserBrackets';
import userLastFours from './userLastFours';

const reducer = combineReducers({
  user,
  espnRPI,
  espnBPI,
  confChamps,
  currentUserBrackets,
  userLastFours
})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware);

export default store;
export * from './user';
export * from './espnRPI';
export * from './espnBPI';
export * from './confChamps';
export * from './currentUserBrackets';
export * from './userLastFours';
