

import { createSlice } from '@reduxjs/toolkit'

export interface Participant{
    id: string,
    name: string,
    avatar: number;
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        participants: [] as Participant[],
    },
    reducers: {
        addParticipant: (state, action) => {
            state.participants = state.participants.filter(participant => participant.id !== action.payload.id)
            state.participants.push(action.payload)
        },
        removeParticipant: (state, action) => {
            console.log("Remove action: " + action)
             state.participants = state.participants.filter(participant => participant.id !== action.payload)
        }
    }
});

export const {addParticipant, removeParticipant} = gameSlice.actions;
export const selectParticipants = (state: {participants: Participant[] }) => state.participants;
