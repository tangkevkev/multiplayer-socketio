import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import './infobox.css'
export const InfoBox = () => {

    const { t, } = useTranslation();

    return (
        <Fragment>
            <div className="info-box">
                <h4><b>{t("about")}</b></h4>

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
