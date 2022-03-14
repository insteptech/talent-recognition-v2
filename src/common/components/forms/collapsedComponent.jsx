import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import PropTypes from "prop-types";
import classNames from "classnames";
import Label from "./labelComponent.jsx";
import CharsCounterLabel from "./charsCounterLabel.jsx";
import InputErrorsBlock from "./inputErrorsBlock.jsx";
import formattedString from "../../../propTypes/form";

class CollapsedComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: props.collapsed,
        };
    }

    //by default we show counter only for textarea. If you want to add length counter to other fields =>
    //=> set "true" to "showCounter" field in "validation.length" object
    showLimitCounter = ({ type, length }) => {
        const { maximum, showCounter } = length;
        if (!maximum) {
            return false;
        }
        if (typeof showCounter === "boolean") {
            //case when showCounter is obviously set
            return showCounter;
        } else if (type === "textarea") {
            //Some default behavior. May be extended
            //for "textarea"s show counter
            return true;
        }
        return false;
    };

    onClickCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {
            validation,
            meta,
            inputWrapperClass,
            alwaysValidate,
            children,
            label,
            id,
            fieldWrapper,
            srOnly,
            input,
            type,
        } = this.props;
        let className = classNames("form-group", "has-feedback", inputWrapperClass);
        let errors = "";

        const message = input.value || "";
        const length = validation && validation.length;
        const showCharsCounter = length && this.showLimitCounter({ length, type });
        const dirtyOrTouched = type === "textarea" ? meta.dirty || meta.touched : meta.touched;

        if ((dirtyOrTouched || alwaysValidate) && !meta.asyncValidating) {
            if (meta.error) {
                errors = <InputErrorsBlock errors={meta.error} />;
                className = classNames(className, "has-error", inputWrapperClass);
            } else if (showCharsCounter && length && length.maximum && length.maximum < message.length + 10) {
                className = classNames(className, "has-warning", inputWrapperClass);
            } else {
                className = classNames(className, "has-success", inputWrapperClass);
            }
        }
        const resultField = (
            <div className={className}>
                <Label id={id} label={label} required={validation && validation.required} srOnly={srOnly} />
                {this.props.collapsed && (
                    <Glyphicon
                        className="form-group__collapse-icon"
                        glyph={this.state.collapsed ? "triangle-bottom" : "triangle-top"}
                        onClick={this.onClickCollapse}
                    />
                )}
                {showCharsCounter && <CharsCounterLabel maxChars={length.maximum} currentLength={message.length} />}
                {!this.state.collapsed && children}
                {errors}
            </div>
        );

        if (fieldWrapper) {
            return <div {...fieldWrapper}>{resultField}</div>;
        }

        return resultField;
    }
}

CollapsedComponent.propTypes = {
    // The props from redux-form Field component
    meta: PropTypes.object.isRequired,

    // The props created in the parent components
    id: PropTypes.string.isRequired,

    inputWrapperClass: PropTypes.string,
    fieldWrapper: PropTypes.object,
    children: PropTypes.any,
    input: PropTypes.object,
    type: PropTypes.string,

    // The props defined by a user
    label: formattedString,
    validation: PropTypes.object,
    alwaysValidate: PropTypes.bool,
    collapsed: PropTypes.bool,
    srOnly: PropTypes.bool,
};

export default CollapsedComponent;