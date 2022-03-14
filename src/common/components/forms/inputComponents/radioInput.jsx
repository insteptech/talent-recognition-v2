import React, { Component } from "react";
import PropTypes from "prop-types";
import RadioButton from "./radioButton.jsx";
/**
 * Radio Input Component: takes list of options from option parameter and displays list of radio buttons
 * See PropTypes below for full param list
 */
export default class RadioInput extends Component {
    handleChange = event => {
        const value = event.target.value;
        this.props.input.onChange(value);
    };
    render() {
        const { options, input, layout, disabled,rightLable } = this.props;
        return (
            <div>
                {options.map(option => (
                    <RadioButton
                        key={option.value}
                        selected={option.value === input.value}
                        onChange={this.handleChange}
                        layout={layout}
                        value={option.value}
                        label={option.label}
                        rightLable={rightLable}
                        disabled={disabled}
                    />
                ))}
            </div>
        );
    }
}
RadioInput.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,
    rightLable:PropTypes.string,
    // The props defined by a user
    options: PropTypes.array.isRequired,
    layout: PropTypes.string,
    disabled: PropTypes.bool,
};