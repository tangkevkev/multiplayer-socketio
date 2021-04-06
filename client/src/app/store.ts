import {configureStore} from '@reduxjs/toolkit'
import {userSlice} from '../redux/userSlice'
import { useDispatch } from 'react-redux'


export const store = configureStore({
    reducer:{
        user: userSlice.reducer
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()