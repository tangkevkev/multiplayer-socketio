import { Fragment, useEffect, useContext, useState } from "react";
import { Avatar } from './common'
import { useTranslation } from 'react-i18next';
import { useHistory, RouteComponentProps } from "react-router-dom";
import { SocketContext } from './context/socket'
import { Socket } from "socket.io-client"
import { ClientServerTypes, emptyMessage, ErrorType, Message } from './types'
import toast, { Toaster } from 'react-hot-toast';


import './Join.css'

interface JoinProps extends RouteComponentProps<{ id: string }> { }


export const JoinComponent = (props: JoinProps) => {
    const { t, } = useTranslation();
    const socket: Socket = useContext(SocketContext).getSocket()
    const [connectCount, setConnectCount] = useState(0)

    const history = useHistory();

    let id = props.match.params.id

    function joinGame(){
        history.push({pathname:"/game/"+id})
    }

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
        socket.on(ClientServerTypes.GAME_EXISTS, responseHandler);


        let message: Message = emptyMessage();
        message.payload.gameID = id;
        socket.emit(ClientServerTypes.GAME_EXISTS, message);


        return () => {
            socket.off(ClientServerTypes.GAME_EXISTS, responseHandler)
            socket.off("connect_error", errorHandler);
        }
    }, [socket, history, connectCount]);


    return (
        <Fragment>
            <Toaster></Toaster>
            <div className="row">
                <div className="join-center">
                    <Avatar />
                    <button type="button" className="btn btn-primary" onClick={(e) => {joinGame()}}>{t("join game")}</button>
                </div>
            </div>
        </Fragment>
    );
}