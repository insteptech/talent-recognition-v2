import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

// Use span to use correct height even without label
const Label = ({ id, label, required, srOnly }) => (
    <label htmlFor={id} className={classNames("control-label bmd-label-static", { "sr-only": srOnly })}>
        {label || <span>&nbsp;</span>}
        {label && required && " *"}
    </label>
);

Label.propTypes = {
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    required: PropTypes.bool,
    srOnly: PropTypes.bool,
};
export default Label;