import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm, change } from "redux-form";
import * as _ from "lodash";
import GeneratedForm from "../../shared/forms/generatedFrom.jsx";
import validation from "../../shared/forms/validation.jsx";
import { getInitialValues } from "./formTools";

export default class FormGenerator extends Component {
    constructor(props) {
        super(props);

        this.connectedForm = this.getConnectedForm(props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.layout.name !== this.props.layout.name) {
            this.connectedForm = this.getConnectedForm(this.props);
        }
    }
    getConnectedForm = props => {
        const { initialValues, layout, destroyOnUnmount, shouldAsyncValidate, onSubmit } = props;
        const { name } = layout;
        const layoutInitialValues = layout.fields.value && getInitialValues(layout.fields);

        let connectParams = {
            form: name,
            initialValues: initialValues || layoutInitialValues,
            validate: validation,
            onChange: this.onFormChange(this.getDependentFieldsMap(layout)),
            destroyOnUnmount,
        };

        if (shouldAsyncValidate) {
            connectParams = { ...connectParams, shouldAsyncValidate };
        }
        return reduxForm(connectParams)(GeneratedForm);
    };

    render() {
        const { fields, sections = [] } = this.props.layout;

        return (
            <this.connectedForm
                layout={this.props.layout}
                isShowSubmitButton={this.props.isShowSubmitButton}
                isShowCancelButton={this.props.isShowCancelButton}
                SubmitButton={this.props.customSubmitButton}
                CancelButton={this.props.customCancelButton}
                onClickCancelButton={this.props.onClickCancelButton}
            />
        );
    }
    /**
     * Check if the modified value has any dependent fields and update
     */
    onFormChange = dependent => (values, dispatch, props) => {
        const formattedValues = this.toDotNotation(values);
        const changedField = this.getChangedField(formattedValues);
        const { dependentFields, onChange } = this.props;

        for (let key in dependentFields) {
            dependentFields[key].forEach(field => {
                if (field && changedField && field.split(".").pop() === changedField.split(".").pop()) {
                    dispatch(change(key, field, formattedValues[changedField] || null));
                }
            });
        }

        if (dependent[changedField]) {
            dependent[changedField].forEach(dependentField =>
                dispatch(change(props.form, dependentField, formattedValues[changedField] || null))
            );
        }

        onChange && onChange(values, dispatch, props);
    };

    getChangedField = values => {
        let changedField;
        this.values = this.values || [];
        // Find changed value
        for (let field in values) {
            if (values[field] !== this.values[field]) {
                changedField = field;
            } else {
                delete this.values[field];
            }
        }

        // If there is not changed field it means the field was removed
        if (!changedField) {
            changedField = _.keys(this.values)[0];
        }
        this.values = values;
        return changedField;
    };

    toDotNotation = values => {
        const formattedValues = {};

        for (let value in values) {
            if (typeof values[value] === "object") {
                for (let field in values[value]) {
                    formattedValues[`${value}.${field}`] = values[value][field];
                }
            } else {
                formattedValues[value] = values[value];
            }
        }

        return formattedValues;
    };

    /**
     * Create map of independentFields to their dependentFields
     */
    getDependentFieldsMap = layout => {
        const map = {};
        layout.fields &&
            layout.fields
                .filter(field => field.from)
                .forEach(field => {
                    map[field.from] ? map[field.from].push(field.name) : (map[field.from] = [field.name]);
                });

        layout.sections &&
            layout.sections.forEach(section => {
                section.fields
                    .filter(field => field.from)
                    .forEach(field => {
                        map[field.from]
                            ? map[field.from].push(`${section.name}.${field.name}`)
                            : (map[field.from] = [`${section.name}.${field.name}`]);
                    });
            });
        return map;
    };
    static propTypes = {
        layout: PropTypes.object.isRequired,
        dependentFields: PropTypes.object,
        onClickCancelButton: PropTypes.func,
        isShowSubmitButton: PropTypes.bool,
        isShowCancelButton: PropTypes.bool,
        customSubmitButton: PropTypes.any,
        customCancelButton: PropTypes.any,
        initialValues: PropTypes.object,
        destroyOnUnmount: PropTypes.bool,
        shouldAsyncValidate: PropTypes.func,
        onSubmit: PropTypes.func,
        onChange: PropTypes.func,
    };
    static defaultProps = {
        destroyOnUnmount: true,
    };
}