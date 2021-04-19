export const ENDPOINT: string = "localhost:8080"


/**
 * Messages exchanged between client/player and server
 */
export const ClientServerTypes = {
    NEW_GAME : "createGame",
    DISCONNECT : "disconnect",
    JOIN_GAME : "joinGame",
    LEAVE_GAME : "leaveGame",
    GAME_EXISTS : "gameExists",
    CONNECT_ERROR : "connect_error"
}

export const ErrorType={
    NONE: "none",
    NEW_GAME:"newGameFail",
    JOIN_GAME: "joinGameFail",   
    EXISTS_GAME: "existGameFail"
}
type ErrorType = typeof ErrorType[keyof typeof ErrorType]

/**
 * Messages exchanged directly between clients/players
 */
export const ClientClientTypes = {
    NEW_PLAYER : "newPlayer",
    CHAT_MESSAGE : "message",
    FOLD : "fold",
    RAISE : "raise",
    CHECK : "check",
    SET_BALANCE : "setBalance",
}


//Message interface
export interface Message{
    error: ErrorType,
    errorMessage?: string,
    doReply?: boolean,
    payload:{
        message?: string,
        gameID?: string,
        user?:GameUser,
        game?: GameMessage
    }
}

export function emptyMessage(): Message{
    let message: Message = {
        error: ErrorType.NONE,
        doReply: false,
        payload: { 
            game: {},
            user: {},
        }
    };
    return message
}

export interface GameUser{
    id?: string,
    username?: string,
    avatar?: number,
}

export interface GameMessage{
    balance?:number,
    raiseAmount?: number,
}
