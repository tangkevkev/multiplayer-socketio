import  configData from "../../config.json"

import {io, Socket, SocketOptions} from "socket.io-client"
import React from 'react'


export class MySocket{
   
    private socket: Socket = null as any;
    /**
     * We initialize the socket connection only when 
     * the user starts requests it explicitly (by clicking on one of the buttons)
     */
    private init(opt?:SocketOptions){
        if(this.socket == null){
            this.socket = io(configData.SERVER_URL, opt)
        }
    }

    getSocket(): Socket{
        this.init();
        return this.socket;
    }
}



export const socketWrapper: MySocket = new MySocket();
export const SocketContext = React.createContext(socketWrapper);



