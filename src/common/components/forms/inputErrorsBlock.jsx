import React from "react";
import PropTypes from "prop-types";

const inputErrorsBlock = ({ errors }) => (
    <div>
        {Array.isArray(errors)
            ? errors.map((error, index) => (
                  <p className="error" key={index}>
                      {error}
                  </p>
              ))
            : [
                  <p className="error" key={0}> {errors.error}</p>,
              ]}
    </div>
);

inputErrorsBlock.propTypes = {
    errors: PropTypes.array.isRequired,
};
export default inputErrorsBlock;