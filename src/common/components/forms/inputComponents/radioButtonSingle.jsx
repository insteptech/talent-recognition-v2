import React from "react";
import PropTypes from "prop-types";
import formattedString from "../../../../propTypes/form";
/**
 * Radio Button Component: Displays single radio input given a label
 * See PropTypes below for full param list
 */
export default function RadioButtonSingle(props) {
    return (
        <div className={props.layout === "horizontal" ? "radio-inline" : "radio"}>

            <label>
                <input
                    name="RadioSingle"
                    type="radio"
                    value={props.value}
                    checked={props.selected}
                    onChange={props.onChange}
                    disabled={props.disabled}
                />
                {/* <span className="bmd-radio" /> */}
                <span className="mbt-small-radio">{props.label1} <small className="mbt-small">{props.label2}</small></span>
            </label>
            {/* <span> {props.rightLable}</span> */}
        </div>
    );
}

RadioButtonSingle.propTypes = {
    label1: formattedString.isRequired,
    label2: formattedString,
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    layout: PropTypes.string,
    disabled: PropTypes.bool,
};