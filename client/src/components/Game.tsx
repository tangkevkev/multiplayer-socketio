import { Fragment, useEffect, useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SocketContext } from './context/socket'
import { Socket } from "socket.io-client"
import { useHistory, RouteComponentProps } from "react-router-dom";
import { ClientServerTypes, emptyMessage, ErrorType, Message } from './types'
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";
import {
    selectAvatar,
    selectUsername
} from '../redux/userSlice'
import { GameLobby } from '../components/common/gamelobby'

interface GameProps extends RouteComponentProps<{ id: string }> { }

export const GameComponent = (props: GameProps) => {
    const socket: Socket = useContext(SocketContext).getSocket()
    const [connectCount, setConnectCount] = useState(0)

    const dispatch = useDispatch();


    const history = useHistory();
    const { t, } = useTranslation();

    const username = useSelector(selectUsername)
    const avatar = useSelector(selectAvatar)


    let id = props.match.params.id

    if (isNaN(+id)) {
        socket.close()
        history.push({ pathname: "/error/Invalid game identifier " + id })
    }



    useEffect(() => {
        function joinGameHandler(response: Message) {
            console.log("Reponse: " + response.payload.user?.username + ". " + response.payload.user?.id)
            if (response.error !== ErrorType.NONE) {
                history.push({ pathname: "/error/Server response -> " + response.errorMessage })
            }
        }

        function errorHandler() {
            setConnectCount(connectCount + 1)
            if (connectCount === 1) {
                toast.error(String(t("connection failed")), { "duration": 15000 });
                socket.close();
            }
        }

        if (username.length === 0) {
            history.push({ pathname: "/join/" + id })
        } else {
            socket.on(ClientServerTypes.JOIN_GAME, joinGameHandler);
            socket.on("connect_error", errorHandler)

            let message: Message = emptyMessage();
            message.payload.gameID = id;
            message.doReply = true;
            message.payload.user = { username: username, avatar: avatar, id: socket.id }
            socket.emit(ClientServerTypes.JOIN_GAME, message);
        }

        return () => {
            socket.off(ClientServerTypes.CONNECT_ERROR, errorHandler);
            socket.off(ClientServerTypes.JOIN_GAME, joinGameHandler);
        }
    }, [socket, connectCount, history, id, avatar, username, t, dispatch]
    )

    return (
        <Fragment>
            <div className="row">
                    <GameLobby />
            </div>
            

        </Fragment>
    );
}