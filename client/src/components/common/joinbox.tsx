import './joinbox.css'
import { useTranslation } from 'react-i18next';
import { Fragment, useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/socket'
import { Socket } from "socket.io-client"
import { ClientServerTypes, emptyMessage, ErrorType, Message } from '../types'
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    selectUsername
} from '../../redux/userSlice'




export const JoinBox = () => {
    const { t, } = useTranslation();
    const username = useSelector(selectUsername)

    const socket: Socket = useContext(SocketContext).getSocket()
    const [connectCount, setConnectCount] = useState(0)
    const [gameID, setGameID] = useState("");

    const history = useHistory();


    function newGame() {
        if(username.length === 0){
            toast.error(String(t("no name")), { "duration": 2000 });
            return;
        }

        if (connectCount >= 1){
            socket.close()
            toast.error(String(t("connection failed")), { "duration": 2000 });
        }
        else{
            socket.emit(ClientServerTypes.NEW_GAME)
        }
    }

    function joinGame(){
        if(username.length === 0){
            toast.error(String(t("no name")), { "duration": 2000 });
            return;
        }
        if (connectCount >= 1){
            socket.close()
            toast.error(String(t("connection failed")), { "duration": 5000 });
        }else{
            if(isNaN(+gameID)){
                toast.error(String(t("invalid id")), {"duration": 2000})
                return;
            }
            let message: Message = emptyMessage();
            message.payload.gameID = gameID;
            socket.emit(ClientServerTypes.GAME_EXISTS, message)
        }
    }

    function playGame(){
        if(username.length === 0){
            toast.error(String(t("no name")), { "duration": 2000 });
            return;
        }
        if(connectCount >= 1){
            socket.close();
            toast.error(String(t("connection failed")), { "duration": 5000 });
        }
        //TODO
    }

    function playSolo(){
        socket.close();
        //TODO
    }

    useEffect(() => {
        function newGameHandler(response: Message){
            if (response.error === ErrorType.NONE) {
                history.push("/game/" + response.payload.gameID)
            }
            else
            toast.error(String(t("invalid id")), {"duration": 2000})
        }

        function joinGameHandler(response: Message){
            if (response.error === ErrorType.NONE){
                history.push("/game/" + response.payload.gameID)
            }else{
                toast.error(response.error + ": " + response.errorMessage)
            }
        }

        function errorHandler() {
            setConnectCount(connectCount + 1)
            if (connectCount === 1) {
                socket.close();
            }
        }

        socket.on(ClientServerTypes.NEW_GAME, newGameHandler);
        socket.on(ClientServerTypes.GAME_EXISTS, joinGameHandler)
        socket.on("connect_error", errorHandler)

        return () => {
            socket.off(ClientServerTypes.NEW_GAME, newGameHandler)
            socket.off(ClientServerTypes.GAME_EXISTS, joinGameHandler)
            socket.off(ClientServerTypes.CONNECT_ERROR, errorHandler)
        }
    }, [socket, history, connectCount, t]);


    return (
        <Fragment>
            <Toaster></Toaster>
            <div className="join-box" style={{ marginTop: '5px'}}>
                <button className="btn btn-warning" style ={{color:"white"}} onClick={() => { playSolo() }}>
                        {t("Play Solo!")}
                    </button>
            </div>
            <div className="join-box" style={{ marginTop: '0px' }}>
                <div className="row join-sub-box">
                    <button className="btn btn-success" onClick={() => { playGame() }}>
                        {t("play")}!
                    </button>
                    <button className="btn btn-danger" onClick={() => { newGame() }}>
                        {t("create private game")}
                    </button>
                </div>
            </div>
            <div className="join-box" style={{ marginTop: '5px' }}>
                <form className="form-inline">
                    <input type="number" className={(isNaN(+gameID)?"form-control is-invalid":"form-control")} id="gameID" placeholder={t("game identification")} maxLength={10} 
                    onChange={(e) => { setGameID((e.target.value))}}>
                    </input>
                    <button type="button" className="btn btn-primary" onClick={(e) => { joinGame()}}>{t("join game")}</button>
                </form>
            </div>
        
        </Fragment>
    );
}
