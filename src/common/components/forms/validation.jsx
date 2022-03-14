import React from "react";
import _ from "lodash";
import validate from "validate.js";
import moment from "moment";

const emailPattern = /^(?=.{6,254}$)([-.\w]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

validate.validators.email.PATTERN = emailPattern;
validate.validators.email = function (value) {
    if (!emailPattern.test(value)) {
        const message = "Invalid email format";
        return validate.format(message, { value });
    }
};
export default function validateValue(values, props) {
    const validateFields = (fields, section) => {
        const validationResult = {};
        fields &&
            fields.forEach(field => {
                const { showField, showOn, hidden } = field;
                let hideDependentField = false;

                if (showField && Array.isArray(showOn)) {
                    hideDependentField = !showOn.includes(values[showField]);
                } else if (showField) {
                    hideDependentField = showOn !== values[showField];
                }
                const hideField = hidden || hideDependentField;
                // If field is not being shown, don't run its validation
                if (hideField) {
                    return;
                }

                const validator = Object.assign({}, field.validation);
                let messageErrorIndex = -1;
                let validationResults = null;
                if (validator.required || validator.presence) {
                    delete validator.required;
                    validator.presence = {
                        allowEmpty: false,
                        message: `${field.label} is required.`,
                    };
                }
                if (validator.email) {
                    delete validator.email;
                    validator.email = {
                        message: "Invalid email",
                    };
                }
                if (validator.format) {
                    validator.format = {
                        ...validator.format,
                        message: validator.format.message,
                    };
                }
                //for async validation use "validateUrlAdress" action
                if (validator.urlAddress) {
                    delete validator.urlAddress;
                    validator.format = {
                        pattern: /^$|(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
                        message: "Invalid URL",
                    };
                }
                if (validator.validateName) {
                    delete validator.validateName;
                    validator.format = {
                        pattern: /[^ -&(-,.-@[-`{-¿]+$/g,
                        message: "Invalid name",
                    };
                }
                if (validator.validateNameWithSpace) {
                    delete validator.validateNameWithSpace;
                    validator.format = {
                        pattern: /[^-&(-,.-@[-`{-¿!$"#%']+$/g,
                        message: "Invalid name",
                    };
                }
                if (validator.validateNameWithSpaceAndHyphens) {
                    delete validator.validateNameWithSpaceAndHyphens;
                    validator.format = {
                        pattern: /^[A-Za-z -]+$/g,
                        message: "Invalid name",
                    };
                }
                if (validator.equal) {
                    const originField = _.find(props.layout.fields, { name: validator.equal });
                    const originKey = originField.name;
                    const originLabel = originField.label;
                    const comparableKey = field.name;
                    const comparableLabel = field.comparableLabel;
                    validator[comparableKey] = {
                        equality: {
                            attribute: originKey,
                            message: `not equal to ${comparableLabel}`,
                        },
                    };
                }
                if (validator.length) {
                    if (validator.length.minimum) {
                        validator.length.tooShort = `Min character length is ${validator.length.minimum}`;
                    }
                    if (validator.length.maximum) {
                        validator.length.tooLong = `Max character length is ${validator.length.maximum}`;
                    }
                }
                if (validator.numericality) {
                    delete validator.numericality;
                    validator.numericality = {
                        notValid: "Not valid number",
                    };
                }
                validate.extend(validate.validators.datetime, {
                    parse: value => moment.utc(value),
                    format: value => moment.utc(value).format("MM/DD/YYYY"),
                });
                if (validator.minDate || validator.onlyFutureDate) {
                    validator.date = validator.date || {};
                    validator.date.earliest = validator.onlyFutureDate ? moment() : validator.minDate;
                    delete validator.minDate;
                    delete validator.onlyFutureDate;
                }
                if (validator.hasOwnProperty("minNumber")) {
                    validator.numericality = validator.numericality || {};
                    validator.numericality.greaterThanOrEqualTo = validator.minNumber;
                    validator.numericality.notGreaterThanOrEqualTo = `min character length ${validator.minNumber}`;
                    delete validator.minNumber;
                }
                if (validator.maxNumber) {
                    validator.numericality = validator.numericality || {};
                    validator.numericality.lessThanOrEqualTo = validator.maxNumber;
                    validator.numericality.notLessThanOrEqualTo = `min character length ${validator.maxNumber}`;
                    delete validator.maxNumber;
                }
                if (validator.maxDate || validator.onlyPastDate) {
                    validator.date = validator.date || {};
                    validator.date.latest = validator.onlyPastDate ? moment() : validator.maxDate;
                    delete validator.maxDate;
                    delete validator.onlyPastDate;
                }
                if (validator.equal) {
                    const originField = _.find(props.layout.fields, { name: validator.equal });
                    const originKey = originField.name;
                    const comparableKey = field.name;
                    const equalValidator = { [comparableKey]: validator[comparableKey] };
                    const data = {
                        [originKey]: values[originKey] || "",
                        [comparableKey]: values[comparableKey] || "",
                    };
                    const result = validate(data, equalValidator);
                    validationResults = result && result[comparableKey] ? [result[comparableKey]] : undefined;

                    delete validator.equal;
                    delete validator[comparableKey];
                }
                if (!validationResults) {
                    const value = section
                        ? values[section.name] && values[section.name][field.name]
                        : values[field.name];

                    validationResults = validate.single(value, validator);
                }
                if (validationResults) {
                    //show one error message at a time.
                    validationResult[field.name] = [validationResults[0]];
                }
            });
        return validationResult;
    };
    let results = {
        ...validateFields(props.layout.fields),
    };
    const validateFieldsWithSections = sections => {
        sections.forEach(section => {
            results[section.name] = validateFields(section.fields, section);
        });
    };
    props.layout.hasOwnProperty("sections") && validateFieldsWithSections(props.layout.sections);
    return results;
}
function validateReserved(value, options) {
    return validate.validators.reserved(value, options);
}
export { validateReserved };