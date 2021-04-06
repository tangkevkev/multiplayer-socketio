import { Fragment } from "react";
import { RouteComponentProps } from "react-router";



interface ErrorProps extends RouteComponentProps<{ errorMessage: string }> { }


export const ErrorComponent = (props: ErrorProps) => {
    let message = props.match.params.errorMessage
    return (
        <Fragment>
            <b>Error: </b> {message||"Invalid page"}
        </Fragment>
    );
}