import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import userRoleSlice from '@/redux/slices/user-role.slice'
import currentUserSlice from '@/redux/slices/current-user.slice'
import envConfig from '@/config'

const rootReducer = combineReducers({
  [userRoleSlice.name]: userRoleSlice.reducer,
  [currentUserSlice.name]: currentUserSlice.reducer,
})

const store = configureStore({
  reducer: rootReducer,
  devTools: envConfig.NODE_ENV === 'development'
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
