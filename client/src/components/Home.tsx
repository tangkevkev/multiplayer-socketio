
import { Avatar, InfoBox, JoinBox, NewsBox } from './common'
import { Fragment } from "react";
import { Game } from './game/game';

export const HomeComponent = () => {
    return (
        <Fragment>
            <div className="row">
                <div className="col-md-2" />
                <div className="col-md-4" style={{ "padding": 0 }}>
                    <Avatar />
                </div>
                <div className="col-md-4" style={{ "padding": 0 }}>
                    <JoinBox />
                </div>
                <div className="col-md-2" />
                <div className="col-lg-2" />
                <div className="col-lg-4" style={{ "padding": 0 }}>
                    <InfoBox />
                </div>
                <div className="col-lg-4" style={{ "padding": 0 }}>
                    <NewsBox />
                </div>
                <div className="col-lg-2" />
            </div>
            <Game />

        </Fragment >
    );
}