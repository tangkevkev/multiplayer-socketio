import { Fragment } from "react";
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from "react-router";



interface ErrorProps extends RouteComponentProps<{ errorMessage: string }> { }


export const ErrorComponent = (props: ErrorProps) => {
    const { t, } = useTranslation();

    let message = props.match.params.errorMessage
    return (
        <Fragment>
            <div style={{ display: "block" , textAlign:"center"}}>
                <b>{t("error")}: </b> {message || "Invalid page"}
                <br/>
                <a href="/">{t("back to homepage")}</a>
            </div>

        </Fragment>
    );
}