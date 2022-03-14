import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const ErrorMark = props => (
    <span
        className={classNames("glyphicon glyphicon-remove form-control-feedback", props.className)}
        aria-hidden="true"
    />
);

ErrorMark.propTypes = {
    className: PropTypes.string,
};

export default ErrorMark;