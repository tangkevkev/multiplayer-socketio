import './gamelobby.css'

import { SocketContext } from './../context/socket'
import { Socket } from "socket.io-client"
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect, useContext } from "react";

import {
    selectAvatar,
    selectUsername
} from '../../redux/userSlice'
import {
    addParticipant,
    removeParticipant,
    selectParticipants,
    Participant
} from '../../redux/gameSlice'
import { ClientClientTypes, ClientServerTypes, emptyMessage, Message } from '../types';

export const GameLobby = () => {
    const socket: Socket = useContext(SocketContext).getSocket()
    const dispatch = useDispatch();

    const username = useSelector(selectUsername)
    const avatar = useSelector(selectAvatar)

    useEffect(() => {
        function leaveGameHandler(response: Message) {
            console.log("Leave game: " + response.payload.user?.username + ". " + response.payload.user?.id)
            let leaveID = response.payload.user?.id
            dispatch(removeParticipant(leaveID))
        }
        function newPlayerHandler(response: Message) {
            if (!response.payload.user) {
                return;
            } else {
                let newParticipant: Participant = {
                    avatar: Number(response.payload.user?.avatar),
                    id: String(response.payload.user?.id),
                    name: String(response.payload.user?.username)
                }
                dispatch(addParticipant(newParticipant))
                if (response.doReply) {
                    let replyMessage: Message = emptyMessage();
                    replyMessage.doReply = false;
                    replyMessage.payload.user = { avatar: avatar, id: socket.id, username: username }
                    socket.emit(ClientClientTypes.NEW_PLAYER, replyMessage)
                }
            }
        }

        socket.on(ClientServerTypes.LEAVE_GAME, leaveGameHandler);
        socket.on(ClientClientTypes.NEW_PLAYER, newPlayerHandler);

        return () => {
            socket.emit(ClientServerTypes.LEAVE_GAME)
            socket.off(ClientClientTypes.NEW_PLAYER, newPlayerHandler);
            socket.off(ClientServerTypes.LEAVE_GAME, leaveGameHandler);
            console.log("Clean up game")
        }
    }, [socket, avatar, username, dispatch]
    )



    return (
        <Fragment>

        </Fragment>
    );
}
