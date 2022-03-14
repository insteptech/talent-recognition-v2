import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Textarea from "react-textarea-autosize";
import formattedString from "../../../../propTypes/form";
import ErrorMark from "../errorMark.jsx";
import SuccessMark from "../successMark.jsx";
import setFieldWidth from "../setFieldWidth";

export default function TextareaFieldView(props) {
    let statusIcon = "";
    const inputClass = classNames("form-control limited-textarea", props.inputClass, props.inputWrapperClass);
    const { meta } = props;
    if ((meta.dirty || meta.touched) && meta.error) {
        statusIcon = <ErrorMark />;
    } else if (meta.touched) {
        statusIcon = <SuccessMark />;
    }

    return (
        <Fragment>
            <Textarea
                {...props.input}
                className={inputClass}
                style={setFieldWidth(props.width)}
                id={props.id}
                maxRows={props.textareaMaxRows}
                minRows={props.textareaRows}
                placeholder={props.placeholder}
            />
            {statusIcon}
      
        </Fragment>
    );
}

TextareaFieldView.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,

    // The props created in the parent components
    id: PropTypes.string.isRequired,

    inputClass: PropTypes.string,
    inputWrapperClass: PropTypes.string,

    // The props defined by a user
    label: formattedString,
    placeholder: formattedString,
    textareaRows: PropTypes.number,
    textareaMaxRows: PropTypes.number,
    width: PropTypes.number,
    validation: PropTypes.object,
};