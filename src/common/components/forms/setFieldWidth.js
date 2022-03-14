const setFieldWidth = widthProp => {
    if (widthProp === undefined || widthProp > 100) {
        return { width: "100%" };
    } else if (widthProp < 5) {
        return { width: "5%" };
    } else {
        return { width: `${widthProp}%` };
    }
};
export default setFieldWidth;