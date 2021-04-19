import socketio, { Socket } from "socket.io"
import { ClientServerTypes, ErrorType, Message, emptyMessage, ClientClientTypes } from "./types"
/**
 * For each client, we create an instance of the class Connection.
 * @field 
 */
export default class Connection {

    private io: socketio.Server
    private game_socket: Socket
    private game_id: number = -1

    static AVAILABLE_GAMES_ID: number[] = []
    static CURRENT_GAMES_ID: Map<number, number> = new Map()

    private static MAX_PLAYERS = 10;



    /**
      * Should only be called once when (re-)starting the server! 
      * Generate a pool of game id's. 
      * Each game is assigned upon creation a unique id.
      *  
      * 
      * @param number_of_ids Number of id's for the game pool
      * @param min_length_ids Minimum length of the id string
    */
    static GENERATE_GAME_IDS(number_of_ids: number = 1000, min_length_ids: number = 6) {
        if (min_length_ids <= 0 || number_of_ids <= 0) {
            console.log("Invalid arguments")
            return;
        }

        let start_id = Math.pow(10, min_length_ids)
        let offset = Math.round(Math.random() * 10000);

        for (let i = 0; i < number_of_ids; i++) {
            start_id += offset
            offset = Math.round(Math.random() * 10000) + 1

            this.AVAILABLE_GAMES_ID.push(start_id)
        }
        this.AVAILABLE_GAMES_ID = this.shuffle(this.AVAILABLE_GAMES_ID)
        console.log(this.AVAILABLE_GAMES_ID)
    }

    static RESET_GAME_IDS() {
        this.CURRENT_GAMES_ID = new Map()
        this.AVAILABLE_GAMES_ID = []
    }

    private static shuffle(array: number[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    constructor(io: socketio.Server, gameSocket: Socket) {
        this.io = io
        this.game_socket = gameSocket

        this.start_listener()
    }

    private start_listener() {
        this.game_socket.on(ClientServerTypes.NEW_GAME, this.create_game)
        this.game_socket.on(ClientServerTypes.JOIN_GAME, this.join_game)
        this.game_socket.on(ClientServerTypes.LEAVE_GAME, this.leave_game)
        this.game_socket.on(ClientServerTypes.GAME_EXISTS, this.game_exists)
        this.game_socket.onAny(this.forward_message)
    }

    private close_listener() {
        this.game_socket.off(ClientServerTypes.NEW_GAME, this.create_game)
        this.game_socket.off(ClientServerTypes.JOIN_GAME, this.join_game)
        this.game_socket.off(ClientServerTypes.LEAVE_GAME, this.leave_game)
        this.game_socket.off(ClientServerTypes.GAME_EXISTS, this.game_exists)
        this.game_socket.off(ClientServerTypes.DISCONNECT, this.game_exists)
        this.game_socket.offAny(this.forward_message)
    }

    /**
     * This function is called whenever a client requests to create a game.
     * 1. We check if the client is already part of any game game_id != -1. (Should in theory not happen)
     * 2. 
     */
    private create_game = (): void => {
        let response: Message = emptyMessage();

        if (this.game_id != -1) {
            response.error = ErrorType.NEW_GAME;
            response.errorMessage = "You're already in a game. Refresh the webpage.";
            this.game_socket.emit(ClientServerTypes.NEW_GAME, response)
            return;
        }

        if (Connection.AVAILABLE_GAMES_ID.length == 0) {
            response.error = ErrorType.NEW_GAME;
            response.errorMessage = "Game max capacity reached";
        } else {
            let current_id = Connection.AVAILABLE_GAMES_ID.pop()
            Connection.CURRENT_GAMES_ID.set(current_id, 1)
            response.error = ErrorType.NONE;
            response.payload.gameID = current_id.toString();
        }

        this.game_socket.emit(ClientServerTypes.NEW_GAME, response)
    }

    private game_exists = (request: Message): void => {
        let game_id = Number(request.payload.gameID);
        let response: Message = emptyMessage();

        if (Connection.CURRENT_GAMES_ID.get(game_id)) {
            if (Connection.CURRENT_GAMES_ID.get(game_id) >= Connection.MAX_PLAYERS) {
                response.error = ErrorType.EXISTS_GAME
                response.errorMessage = "Maximal amount of players reached for this game"
            } else {
                response.payload.gameID = game_id.toString();
            }
        } else {
            response.error = ErrorType.EXISTS_GAME
            response.errorMessage = "Game with id " + game_id.toString() + " does not exist."
        }
        this.game_socket.emit(ClientServerTypes.GAME_EXISTS, response);
    }


    private join_game = (request: Message): void => {
        let response: Message = emptyMessage();
        let game_id = Number(request.payload.gameID);

        if (Connection.CURRENT_GAMES_ID.get(game_id) !== undefined) {
            this.game_socket.join(game_id.toString())
            Connection.CURRENT_GAMES_ID.set(game_id, Connection.CURRENT_GAMES_ID.get(game_id) + 1)
            response.payload.gameID = game_id.toString();
            this.game_id = game_id
            this.game_socket.to(game_id.toString()).broadcast.emit(ClientClientTypes.NEW_PLAYER, request)
        } else {
            response.error = ErrorType.JOIN_GAME;
            response.errorMessage = "Game with " + game_id + " does not exist!"
        }
        this.game_socket.emit(ClientServerTypes.JOIN_GAME, response)

    }


    private leave_game = () => {
        if (Connection.CURRENT_GAMES_ID.get(this.game_id)) {
            console.log("Leave game");
            let numPlayer = Connection.CURRENT_GAMES_ID.get(this.game_id) - 1
            if (numPlayer <= 0) {
                Connection.CURRENT_GAMES_ID.delete(this.game_id)
            } else {
                let response: Message = emptyMessage();
                response.payload.user.id = this.getSocketId();

                //Send a message to the remaining players that the player has left the game
                this.game_socket.to(this.game_id.toString()).broadcast.emit(ClientServerTypes.LEAVE_GAME, response)
                this.game_socket.leave(this.game_id.toString())

                //Adjust the number of currently playing
                Connection.CURRENT_GAMES_ID.set(this.game_id, numPlayer)
            }
        }
        this.game_id = -1;
    }

    private forward_message = (eventName: string, message: Message) => {
        if (Object.values(ClientServerTypes).includes(eventName)) {
            return
        } else if (Object.values(ClientClientTypes).includes(eventName)){
            console.log("Eventname: " + eventName)
            this.game_socket.to(this.game_id.toString()).broadcast.emit(eventName, message)
        }


    }



    onDisconnect = () => {
        //TODO message every player in the same game that you left the game
        /*
        If player was in a game
        1: Send a message to all players, that the player has left
        
        Always: Deregister all listener
        */
        this.leave_game();

        this.close_listener()

    }

    getSocketId(): string {
        return this.game_socket.id
    }

}
