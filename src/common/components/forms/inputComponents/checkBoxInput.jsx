import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import formattedString from "../../../../propTypes/form";

//TODO move the input outside of the label
const CheckBoxInput = ({ validation, input, label, label2, inputWrapperClass }) => (
    <div className={classNames("checkbox", inputWrapperClass)}>
        <label>
            <input type="checkbox" {...input} /> {label}{validation && validation.iccb && (
                <p className="checkp"> {label2} {validation && validation.iccb}</p>
            )}
            {validation && validation.required && " *"}
        </label>
    </div>
);

CheckBoxInput.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,

    inputWrapperClass: PropTypes.string,

    // The props defined by a user
    label: formattedString,
    label2: formattedString,
    validation: PropTypes.object,
};

export default CheckBoxInput;
