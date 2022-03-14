import React from "react";
import xssFilters from "xss-filters";
import { SubmissionError } from "redux-form";
import _ from "lodash";

const XSSMessage = "Security issues with this form";

export const getFieldsWithScripts = valuesObj => {
    if (!valuesObj) return {};

    const errors = {};

    Object.keys(valuesObj).forEach(key => {
        const value = valuesObj[key];

        if (_.isPlainObject(value)) {
            const subErrors = getFieldsWithScripts(value);

            Object.keys(subErrors).forEach(subKey => {
                if (!errors[key]) errors[key] = {};

                errors[key][subKey] = subErrors[subKey];
            });
        } else if (value && typeof value === "string" && xssFilters.inHTMLData(value) !== value) {
            errors[key] = [XSSMessage];
        }
    });

    return errors;
};

const onSubmitGenerator = onSubmit => (values, dispatch, props) => {
    const errors = getFieldsWithScripts(values);

    return Object.keys(errors).length
        ? Promise.reject(new SubmissionError(errors))
        : onSubmit && onSubmit(values, dispatch, props);
};

export default onSubmitGenerator;