import userReducer from '../reducers/reducers';
import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({userReducer});

export const Store = configureStore({
  reducer: rootReducer,
});