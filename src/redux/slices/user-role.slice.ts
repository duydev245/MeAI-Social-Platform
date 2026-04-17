import type { IRoleState } from '@/redux/type';
import { getLocalStorage } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const roleLocalStorage = getLocalStorage('role');

const initialState: IRoleState = {
  currentRole: roleLocalStorage || '',
};

const userRoleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: { payload: string }) => {
      state.currentRole = action.payload;
    },
    removeRole: (state) => {
      state.currentRole = '';
    },
  },
})

export const { setRole, removeRole } = userRoleSlice.actions; ``
export default userRoleSlice;