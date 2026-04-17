import { getLocalStorage } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

interface IRoleState {
  currentRole: string[];
}

const roleLocalStorage = getLocalStorage('role');

const initialState: IRoleState = {
  currentRole: roleLocalStorage || [],
};

const userRoleSlice = createSlice({
  name: 'userRole',
  initialState,
  reducers: {
    setRole: (state, action: { payload: string }) => {
      state.currentRole = [...state.currentRole, action.payload];
    },
    removeRole: (state, action: { payload: string }) => {
      state.currentRole = state.currentRole.filter((role) => role !== action.payload);
    },
  },
})

export const { setRole, removeRole } = userRoleSlice.actions;
export default userRoleSlice;