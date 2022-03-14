import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import formattedString from "../../../../propTypes/form";
import ErrorMark from "../errorMark.jsx";
import SuccessMark from "../successMark.jsx";
import setFieldWidth from "../setFieldWidth";
/**
 * Text Input Component: Renders a labeled text input field.
 * See PropTypes below for full param list
 */
export function TextInput(props) {
    const { intl, meta } = props;
    const inputClass = classNames("form-control", props.inputClass);
    let statusIcon = "";
    let loader = "";

    const formattedPlaceholder = props.placeholderId && intl.formatMessage({ id: props.placeholderId });
    const input = (
        <input
            {...props.input}
            style={setFieldWidth(props.width)}
            type={props.subType ? props.subType : props.type}
            id={props.id}
            className={inputClass}
            placeholder={props.placeholder || formattedPlaceholder}
            disabled={props.disabled}
            autoComplete="off"
        />
    );

    let inputGroup = input;

    if (props.loader && meta.asyncValidating) {
        // This loader is from the react-select library
        loader = (
            <span className="form-control-feedback input-loader">
                <span className="Select-loading" />
            </span>
        );
    }

    if (props.staticPrefix) {
        inputGroup = (
            <div className="input-group">
                <div className="input-group-addon">{props.staticPrefix}</div>
                {input}
            </div>
        );
    }

    //touched and has error or always param validate true
    if ((meta.touched || props.alwaysValidate) && !meta.asyncValidating) {
        if (meta.error) {
            statusIcon = <ErrorMark />;
        } else {
            statusIcon = <SuccessMark />;
        }
    }
    return (
        <Fragment>
            {inputGroup}
            {loader}
            {statusIcon}
        </Fragment>
    );
}

TextInput.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,

    // The props created in the parent components
    id: PropTypes.string.isRequired,

    inputWrapperClass: PropTypes.string,
    inputClass: PropTypes.string,
    staticPrefix: PropTypes.string,
    loader: PropTypes.bool,
    fieldWrapper: PropTypes.object,
    placeholderId: PropTypes.string,

    // The props defined by a user
    type: PropTypes.string.isRequired,
    label: formattedString,
    placeholder: formattedString,
    disabled: PropTypes.bool,
    validation: PropTypes.object,
    alwaysValidate: PropTypes.bool,
    width: PropTypes.number,
    disableAutoComplete: PropTypes.bool,
};

export default TextInput;