export const getInitialValues = fields => {
    const initialValues = {};
    fields && fields.length > 0 && fields.forEach(field => {
        if (field.value !== undefined) {
            initialValues[field.name] = field.value;
        }
    });
    return initialValues;
};