import './gamelobby.css'
import avatar from '../../assets/avatars'

import { SocketContext } from './../context/socket'
import { Socket } from "socket.io-client"
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect, useContext } from "react";
import toast, { Toaster } from 'react-hot-toast';

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
    const avatarID = useSelector(selectAvatar)
    const participants = useSelector(selectParticipants)

    useEffect(() => {
        function leaveGameHandler(response: Message) {
            let leaveID = response.payload.user?.id
            let leavingParticipant: Participant | undefined = participants.find((p) => p.id === leaveID)
            if (leavingParticipant) {
                toast.error(leavingParticipant.name + " has left the game")
            }
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
                    replyMessage.payload.user = { avatar: avatarID, id: socket.id, username: username }
                    socket.emit(ClientClientTypes.NEW_PLAYER, replyMessage)
                }
            }
        }

        socket.on(ClientClientTypes.NEW_PLAYER, newPlayerHandler);
        socket.on(ClientServerTypes.LEAVE_GAME, leaveGameHandler);

        return () => {
            socket.off(ClientClientTypes.NEW_PLAYER, newPlayerHandler);
            socket.off(ClientServerTypes.LEAVE_GAME, leaveGameHandler);
        }
    }, [participants, avatarID, username, socket, dispatch])


    useEffect(() => {
        return () => {
            socket.emit(ClientServerTypes.LEAVE_GAME)
            console.log("Clean up game")
        }
    }, [socket]
    )

    return (
        <Fragment>
            <Toaster></Toaster>
            {participants.map((participant) => (
                <div className="participant" key={participant.id}>
                    <img alt='logo' className="img-thumbnail avatar-image " src={avatar[participant.avatar]} />
                    <div>                        
                         {participant.name}
                    </div>
                </div>

            ))}
        </Fragment>
    );
}
