import React from "react";
import PropTypes from "prop-types";

const CharsCounterLabel = ({ maxChars, currentLength, className }) => (
    <label className={className}>
        {/* {`max ${maxChars} character allowed or ${currentLength}`} */}
        {`${currentLength} Characters`}
    </label>
);

CharsCounterLabel.propTypes = {
    maxChars: PropTypes.number.isRequired,
    currentLength: PropTypes.number.isRequired,
    className: PropTypes.string,
};

CharsCounterLabel.defaultProps = {
    className: "pull-right",
};

export default CharsCounterLabel;