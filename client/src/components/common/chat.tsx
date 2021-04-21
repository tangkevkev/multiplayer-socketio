import { Fragment, useContext, useEffect } from 'react';
import { SocketContext } from './../context/socket'
import { Socket } from "socket.io-client"
import { useSelector, useDispatch } from "react-redux";

import {
    addMessage, ChatMessage, Participant, selectMessages, selectParticipants
} from '../../redux/gameSlice'
import { ClientClientTypes, Message } from '../types';

import './chat.css'

import 'react-chat-widget/lib/styles.css';

export const Chat = () => {
    const socket: Socket = useContext(SocketContext).getSocket()
    const dispatch = useDispatch();
  //  const username = useSelector(selectUsername)
    const participants: Participant[] = useSelector(selectParticipants)
    const messages: ChatMessage[] = useSelector(selectMessages)


    /**const handleNewUserMessage = (newMessage: string) => {
        let message: Message = emptyMessage();
        message.payload.message = newMessage;
        message.payload.user = { username: username, id: socket.id }

        socket.emit(ClientClientTypes.CHAT_MESSAGE, message)

    }*/

    useEffect(() => {
        function messageHandler(response: Message) {
            let participant: Participant | undefined = participants.find((p => p.id === response.payload.user?.id));
            if (participant) {
                let date = new Date();
                let newMessage: ChatMessage = { author: participant, date: date.toLocaleTimeString(), message: String(response.payload.message) }
                dispatch(addMessage(newMessage))

            }
        }

        socket.on(ClientClientTypes.CHAT_MESSAGE, messageHandler);

        return () => {
            socket.off(ClientClientTypes.CHAT_MESSAGE, messageHandler)
        }
    }, [participants, messages, dispatch, socket])
    return (
        <Fragment>
          
        </Fragment>
    );


}