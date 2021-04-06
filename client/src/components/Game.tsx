import { Fragment, useEffect, useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SocketContext } from './context/socket'
import { Socket } from "socket.io-client"
import { useHistory, RouteComponentProps } from "react-router-dom";
import { ClientServerTypes, emptyMessage, ErrorType, Message } from './types'
import toast, { Toaster } from 'react-hot-toast';

interface GameProps extends RouteComponentProps<{ id: string }> { }

export const GameComponent = (props: GameProps) => {
    const socket: Socket = useContext(SocketContext).getSocket()
    const [connectCount, setConnectCount] = useState(0)

    const history = useHistory();

    let id = props.match.params.id

    if (isNaN(+id)) {
        socket.close()
        history.push({ pathname: "/error/Invalid game identifier " + id })
    }


    useEffect(() => {

        function responseHandler(response: Message) {
            console.log("Reponse: " + response)
            if (response.error !== ErrorType.NONE) {
                history.push({ pathname: "/error/Server response -> " + response.errorMessage })
            }
        }

        function errorHandler() {
            setConnectCount(connectCount + 1)
            if (connectCount === 1) {
                toast.error("Connection to the server failed. Try later again and refresh the webpage", { "duration": 15000 });
                socket.close();
            }
        }

        socket.on("connect_error", errorHandler)
        socket.on(ClientServerTypes.JOIN_GAME, responseHandler);

        let message: Message = emptyMessage();
        message.payload.gameID = id;
        message.doReply = true;
        socket.emit(ClientServerTypes.JOIN_GAME, message);

        return () => {
            socket.emit(ClientServerTypes.LEAVE_GAME)
            socket.off(ClientServerTypes.CONNECT_ERROR, errorHandler);
            socket.off(ClientServerTypes.JOIN_GAME, responseHandler)
            console.log("Clean up game")
        }
    }, [socket]
    )

    return (
        <Fragment>
            Game
        </Fragment>
    );
}