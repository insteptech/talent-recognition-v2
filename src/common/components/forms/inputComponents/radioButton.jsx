import React from "react";
import PropTypes from "prop-types";
import formattedString from "../../../../propTypes/form";
/**
 * Radio Button Component: Displays single radio input given a label
 * See PropTypes below for full param list
 */
export default function RadioButton(props) {
    return (
        <div className={props.layout === "horizontal" ? "radio-inline" : "radio"}>

            <label>
                <input
                    type="radio"
                    value={props.value}
                    checked={props.selected}
                    onChange={props.onChange}
                    disabled={props.disabled}
                />
                <span className="bmd-radio" />
                {props.label}
                {props.label2}
            </label>
            <span> {props.rightLable}</span>
        </div>
    );
}
RadioButton.propTypes = {
    label: formattedString.isRequired,
    label2: formattedString,
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    layout: PropTypes.string,
    disabled: PropTypes.bool,
};