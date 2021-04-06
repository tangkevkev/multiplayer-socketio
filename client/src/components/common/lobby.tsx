import { Fragment } from "react";
import './lobby.css'


export const Lobby = () => {
    return (
        <Fragment>
            <div className="info-box">
                <h4><b>About</b></h4>

                <div className="about" >
                    Description
                     <ul>
                        <li key='0'>
                            ...
                        </li>
                        
                    </ul>
                </div>

            </div>
        </Fragment>
    );
}
