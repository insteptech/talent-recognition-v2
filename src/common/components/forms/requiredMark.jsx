import React from "react";
import PropTypes from "prop-types";
export default function RequiredDisplay(props) {
    return <span style={{ color: "red" }}>{props.show ? "*" : ""}</span>;
}
RequiredDisplay.propTypes = {
    show: PropTypes.bool.isRequired,
};