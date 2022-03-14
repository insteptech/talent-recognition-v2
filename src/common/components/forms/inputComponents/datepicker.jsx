import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import ErrorMark from "../errorMark.jsx";
import SuccessMark from "../successMark.jsx";
import DatePickerLocalized from "./datePickerLocalized.jsx";
/**
 * Select Input Component: Displays Select Input based on options param.
 * See PropTypes below for full param list
 */
function DatePickerInput(props) {
    let statusIcon = "";
    let minDate, maxDate;
    const inputClass = classNames("form-control", props.inputClass);
    const { validation, meta, defaultValue, onChange } = props;

    if (meta.touched && meta.error) {
        statusIcon = <ErrorMark />;
    } else if (meta.touched) {
        statusIcon = <SuccessMark />;
    }

    if (validation.onlyFutureDate) {
        minDate = new Date();
    } else if (validation.minDate) {
        minDate = new Date(validation.minDate);
    }

    if (validation.onlyPastDate) {
        maxDate = new Date();
    } else if (validation.maxDate) {
        maxDate = new Date(validation.maxDate);
    }

    let openToDate = new Date();
    openToDate.setFullYear(new Date().getFullYear() - 75);

    return (
        <Fragment>
            <div>
                <DatePickerLocalized
                    onChange={value =>
                        props.input.onChange(value ? value  : null)
                    }
                    className={inputClass}
                    selected={props.input.value ? new Date(props.input.value) : null}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat="MM/DD/YYYY"
                    showYearDropdown
                    placeholderText="MM/DD/YYYY"
                    openToDate={validation && validation.openToPastDate ? openToDate : new Date()}
                />
            </div>
            {statusIcon}
        </Fragment>
    );
}

DatePickerInput.propTypes = {
    input: PropTypes.object.isRequired,
    inputClass: PropTypes.string,
    meta: PropTypes.object,
    validation: PropTypes.shape({
        required: PropTypes.bool,
        onlyFutureDate: PropTypes.bool,
        onlyPastDate: PropTypes.bool,
        minDate: PropTypes.string,
        maxDate: PropTypes.string,
    }),
};

DatePickerInput.defaultProps = {
    meta: {},
    validation: {},
};

export default DatePickerInput;
