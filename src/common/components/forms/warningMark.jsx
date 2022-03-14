import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const WarningMark = props => (
    <span
        className={classNames("glyphicon glyphicon-exclamation-sign form-control-feedback", props.className)}
        aria-hidden="true"
    />
);
WarningMark.propTypes = {
    className: PropTypes.string,
};
export default WarningMark;