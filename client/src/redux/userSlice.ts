import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: '',
        avatar: 0,
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload
        }
    }
});

export const {setName, setAvatar} = userSlice.actions;
export const selectUsername = (state: { user: { name: string; }; }) => state.user.name;
export const selectAvatar = (state: {user: {avatar: number; }; }) => state.user.avatar
