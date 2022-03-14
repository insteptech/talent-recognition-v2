import React, { Component } from "react";
import PropTypes from "prop-types";
import RadioButtonSingle from "./radioButtonSingle.jsx";
/**
 * Radio Input Component: takes list of options from option parameter and displays list of radio buttons
 * See PropTypes below for full param list
 */
export default class RadioInputSingle extends Component {
    handleChange = event => {      
        const value = event.target.value;
        this.props.input.onChange(value);
    };
    render() {
        const { value, label1, label2, input, layout, disabled, rightLable } = this.props;
        return (
            <div>

                <RadioButtonSingle
                    key={value}
                    selected={input.value}
                    onChange={this.handleChange}
                    layout={layout}
                    value={value}
                    label1={label1}
                    label2={label2}
                    rightLable={rightLable}
                    disabled={disabled}
                />
            </div>
        );
    }
}

RadioInputSingle.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,
    rightLable: PropTypes.string,
    // The props defined by a user
    value: PropTypes.string.isRequired,
    label1: PropTypes.string,
    label2: PropTypes.string,
    layout: PropTypes.string,
    disabled: PropTypes.bool,
};