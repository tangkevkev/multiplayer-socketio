import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import './newsbox.css'

export const NewsBox = () => {

    const { t, } = useTranslation();

    return (
        <Fragment>
            <div className="news-box">
                <h4><b>{t("news")}</b></h4>
                <div className="news-about" >
                    Notifications & Update
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
