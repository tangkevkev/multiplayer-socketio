

import { createSlice } from '@reduxjs/toolkit'

export interface Participant{
    id: string,
    name: string,
    avatar: number;
}

export interface ChatMessage{
    message: string,
    author?: Participant,
    date: string   
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        participants: [] as Participant[],
        messages: [] as ChatMessage[],
    },
    reducers: {
        addParticipant: (state, action) => {
            state.participants = state.participants.filter(participant => participant.id !== action.payload.id)
            state.participants.push(action.payload)
            console.log(state.participants)

        },
        removeParticipant: (state, action) => {
            console.log("Remove action: " + action)
             state.participants = state.participants.filter(participant => participant.id !== action.payload)
             console.log(state.participants)
        },

        addMessage:(state, action) => {
            state.messages.push(action.payload)
        },

        resetState:(state) => {
            state.participants = []
            state.messages = []
        }       
    }
});

export const {addParticipant, removeParticipant, addMessage} = gameSlice.actions;
export const selectParticipants = (state: {game: {participants: Participant[] }}) => state.game.participants;
export const selectMessages = (state: {game: {messages: ChatMessage[]}}) => state.game.messages
