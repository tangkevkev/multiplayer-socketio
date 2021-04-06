import http from "http"
import socketio, {Socket} from "socket.io"
import express, {Express} from "express"
import Connection from "./connection"


//const port = process.env.port || 8080
//const io = new socketio.Server(server, {cors: {origin: '*'}})


export class PokerServer{

    private server: http.Server
    private port = process.env.port || 8080
    private io: socketio.Server
    private connections: Connection[] = []

    constructor(){
        const app: Express = express()
        this.server = http.createServer(app)
        this.io = new socketio.Server(this.server, {cors: {origin: '*'}})
    }

    start_server(port?:number){
        this.server.listen(port||this.port, () => {
            console.log(`server started at http://localhost:${ this.port }`)
        })
        this.start_socket()
    }

    close_server(){
        this.inform_user_about_shutdown()
        this.server.close((err: Error) => {
            console.log("Server closed. Possible Error: " + err)
        })
    }

    getActiveConnections(): Connection[]{
        return this.connections;
    }

    private start_socket(){
        this.io.on('connection', (socket: Socket) => {
            let newConnection = new Connection(this.io, socket);
            this.connections.push(newConnection)
            console.log("New connection")
            socket.on("disconnect", () => {
                console.log("Disconnect")
                this.connections.splice(this.connections.indexOf(newConnection),1)
                newConnection.onDisconnect()
            })
        })
    }

    private close_socket(){

    }


    private inform_user_about_shutdown(){
        //TODO
    }



}