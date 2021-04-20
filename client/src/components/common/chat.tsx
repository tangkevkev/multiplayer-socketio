import { Fragment, useContext, useEffect, useState } from 'react';
import { SocketContext } from './../context/socket'
import { Socket } from "socket.io-client"
import { useSelector, useDispatch } from "react-redux";
import {
    selectUsername
} from '../../redux/userSlice'
import {
    addMessage, ChatMessage, Participant, selectMessages, selectParticipants
} from '../../redux/gameSlice'
import { ClientClientTypes, emptyMessage, Message } from '../types';


export const Chat = () => {
    const socket: Socket = useContext(SocketContext).getSocket()
    const dispatch = useDispatch();
    const username = useSelector(selectUsername)
    const [currentMessage, setCurrentMessage] = useState("");
    const participants: Participant[] = useSelector(selectParticipants)
    const messages: ChatMessage[] = useSelector(selectMessages)

    function sendMessage() {
        let message: Message = emptyMessage();
        message.payload.message = currentMessage;
        message.payload.user = { username: username, id: socket.id }

        socket.emit(ClientClientTypes.CHAT_MESSAGE, message)
        let chatmessage: ChatMessage = {date: new Date().toLocaleTimeString(), message: currentMessage}
        dispatch(addMessage(chatmessage))
        setCurrentMessage("")
    }

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
            <form className="form-inline">
                <input type="text" id="gameID" placeholder="Message" maxLength={10} value={currentMessage}
                    onChange={(e) => { setCurrentMessage((e.target.value)) }}>
                </input>
                <button type="button" className="btn btn-primary" onClick={(e) => { sendMessage() }}>Send Message</button>
            </form>
            <ul>

                {messages.map((message) => (
                    <li>
                        {message.author?.name} : {message.message} : {message.date}
                    </li>
                ))}
            </ul>

        </Fragment>
    );


}