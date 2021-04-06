import './joinbox.css'
import { useTranslation } from 'react-i18next';
import { Fragment, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/socket'
import { Socket } from "socket.io-client"
import { ClientServerTypes, ErrorType, Message } from '../types'
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from "react-router-dom";




export const JoinBox = () => {
    const { t, } = useTranslation();

    const socket: Socket = useContext(SocketContext).getSocket()
    const [connectCount, setConnectCount] = useState(0)
    const history = useHistory();


    function newGame() {
        socket.emit(ClientServerTypes.NEW_GAME)
    }

    useEffect(() => {
        function responseHandler(response: Message){
            if (response.error === ErrorType.NONE) {
                history.push("/game/" + response.payload.gameID)
            }
            else
                toast.error(response.error + ": " + response.errorMessage)
        }

        function errorHandler() {
            setConnectCount(connectCount + 1)
            if (connectCount === 1) {
                toast.error("Connection to the server failed. Try later again and refresh the webpage", { "duration": 15000 });
                socket.close();
            }
        }

        socket.on(ClientServerTypes.NEW_GAME, responseHandler);
        socket.on("connect_error", errorHandler)

        return () => {
            socket.off(ClientServerTypes.NEW_GAME, responseHandler)
            socket.off(ClientServerTypes.CONNECT_ERROR, errorHandler)
        }
    }, [socket, history, connectCount]);


    return (
        <Fragment>
            <Toaster></Toaster>
            <div className="join-box" style={{ marginTop: '5px'}}>
                <button className="btn btn-warning" style ={{color:"white"}} onClick={() => { }}>
                        {t("Play Solo!")}
                    </button>
            </div>
            <div className="join-box" style={{ marginTop: '0px' }}>
                <div className="row join-sub-box">
                    <button className="btn btn-success" onClick={() => { }}>
                        {t("play")}!
                    </button>
                    <button className="btn btn-danger" onClick={() => { newGame() }}>
                        {t("create private game")}
                    </button>
                </div>
            </div>
            <div className="join-box" style={{ marginTop: '5px' }}>
                <form className="form-inline">
                    <input type="number" className="form-control" id="gameID" placeholder={t("game identification")} maxLength={6} onChange={(e) => { }}>
                    </input>
                    <button type="button" className="btn btn-primary" onClick={(e) => { }}>{t("join game")}</button>
                </form>
            </div>
        
        </Fragment>
    );
}
