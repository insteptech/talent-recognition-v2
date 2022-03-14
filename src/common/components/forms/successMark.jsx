import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const SuccessMark = props => (
    <span className={classNames("glyphicon glyphicon-ok form-control-feedback", props.className)} aria-hidden="true" />
);
SuccessMark.propTypes = {
    className: PropTypes.string,
};
export default SuccessMark;