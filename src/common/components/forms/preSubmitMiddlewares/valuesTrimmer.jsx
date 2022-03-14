//array of fields, for which "trim" shouldn't be used.
import _ from "lodash";

const FIELDS_TO_AVOID = ["password"];
const trimValue = value => (typeof value === "string" ? value.trim() : value);
const formValuesSource = valuesObj => key => {
    const value = valuesObj[key];

    if (FIELDS_TO_AVOID.indexOf(key) >= 0) {
        return value;
    }
    return trimValue(value);
};

export const getTrimmedValues = valuesObj => {
    if (!valuesObj) return {};

    const trimmedValuesObj = {};
    const getValueByKey = formValuesSource(valuesObj);

    Object.keys(valuesObj).forEach(key => {
        const value = getValueByKey(key);

        if (_.isPlainObject(value)) {
            trimmedValuesObj[key] = getTrimmedValues(value);
        } else {
            trimmedValuesObj[key] = value;
        }
    });
    return trimmedValuesObj;
};

const valuesTrimmer = onSubmit => (values, dispatch, props) => onSubmit(getTrimmedValues(values), dispatch, props);
export default valuesTrimmer;