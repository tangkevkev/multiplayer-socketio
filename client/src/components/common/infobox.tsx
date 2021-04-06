import { Fragment } from "react";
import './infobox.css'
export const InfoBox = () => {
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
