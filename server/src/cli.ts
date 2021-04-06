import Connection from "./server/connection";
import { PokerServer } from "./server/pokerServer";

export function Start_Terminal(){
    console.log("---------- Starting Terminal ----------")
    const readline = require('readline')

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    rl.prompt();

    let server: PokerServer = new PokerServer();

    rl.on('line', (input: string) => {
        input = input.toLowerCase();
        console.log("Received line: " + input)

        if (input == "start"){
            server.start_server()
            Connection.GENERATE_GAME_IDS()
        }
        else if(input == "close"){
            server.close_server()
            Connection.RESET_GAME_IDS()
        }
        else if(input == "info"){
            let connections = server.getActiveConnections()
            for (let i = 0; i < connections.length; i++){
                console.log(connections[i].getSocketId())   
            }
        }

    });
}