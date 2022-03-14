import React, { Fragment } from "react";
import PropTypes from "prop-types";
import NumericInput from "./numericInputComponent";
import classNames from "classnames";
import formattedString from "../../../../propTypes/form";
import ErrorMark from "../errorMark.jsx";
import SuccessMark from "../successMark.jsx";

export default function NumberInputComponent(props) {
    let statusIcon = "";
    const inputClass = classNames("form-control", props.inputClass);
    const { validation, meta } = props;

    if (meta.touched && meta.error) {
        statusIcon = <ErrorMark />;
    } else if (meta.touched) {
        statusIcon = <SuccessMark />;
    }

    const min = validation.minNumber && validation.minNumber;
    const max = validation.maxNumber && validation.maxNumber;

    return (
        <Fragment>
            <NumericInput
                value={props.input.value}
                className={inputClass}
                onChange={value => props.input.onChange(value)}
                min={min}
                max={max}
                label={props.label}
                disabled={props.disabled}
                id={props.id}
                size={props.size}
                placeholder={props.placeholder}
            />
            {statusIcon}
        </Fragment>
    );
}

NumberInputComponent.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,

    inputClass: PropTypes.string,
    label: formattedString,
    id: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    placeholder: PropTypes.string,

    // The props defined by a user
    validation: PropTypes.shape({
        required: PropTypes.bool,
        minNumber: PropTypes.number,
        maxNumber: PropTypes.number,
    }),
};