import { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';


export const Header: FunctionComponent<{}> = () => {
    const {t, i18n} = useTranslation();

    return (
        <div>
            <nav className="navbar navbar-expand-sm  navbar-light">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul className="navbar-nav ml-auto" >
                        <li className="nav-item " >
                            <div className="dropdown" >
                                <button type="button" className="btn btn-primary dropdown-toggle " data-toggle="dropdown">
                                    {t("Language")+": "+ i18n.language}
                                </button>
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" style={{cursor: "pointer"}} onClick={() => { i18n.changeLanguage("en")}}>English</div>
                                    <div className="dropdown-item" style={{cursor: "pointer"}} onClick={() => { i18n.changeLanguage("fr")}}>Francais</div>
                                    <div className="dropdown-item"  style={{cursor: "pointer"}} onClick={() => { i18n.changeLanguage("de")}}>Deutsch</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

        </div >
    );
}