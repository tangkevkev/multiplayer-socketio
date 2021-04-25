import React, { Component, useEffect } from "react";
import Phaser from 'phaser'
import { IonPhaser } from '@ion-phaser/react'
import Scene from "./scene";

export class Game extends Component {
      state={
        initialize: true,
        game: {
            type: Phaser.AUTO,
            parent: "phaser-example",
            width: 400,
            height: 400,
            scene: [
                Scene
            ]
        }
    }

    render(){
        const { initialize, game } = this.state
        return (
            <IonPhaser game={game} initialize={initialize} />
          )
    }


} 

    
