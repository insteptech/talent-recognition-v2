import React from "react";
import _ from "lodash";

const asyncValidate = (values, dispatch, props) => {
    const promises = [];
    props.layout.fields.forEach(field => {
        if (field.asyncValidate) {
            promises.push(dispatch(field.asyncValidate(field.name, values[field.name])));
        }
    });
    return Promise.all(promises).then(data => {
        //basic async validation. Similar to "validation.js", but much simplier. Currently used only for "url" validation
        const validateFields = fields => {
            const validationResult = {};
            fields.forEach(field => {
                let messageErrorIndex = -1;
                function getFormattedMessage(messageId, vals = {}) {
                    const intlValues = vals;
                    intlValues.label = field.label;
                    messageErrorIndex += 1;
                    return vals;
                }
                const fieldError = data.find(d => d[field.name]);
                if (fieldError) {
                    validationResult[field.name] = [getFormattedMessage(fieldError[field.name])];
                }
            });

            return validationResult;
        };

        let results = {
            ...validateFields(props.layout.fields),
        };
        if (!_.isEmpty(results)) {
            return Promise.reject(results);
        }
    });
};
export default asyncValidate;