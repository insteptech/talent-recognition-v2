import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, formValueSelector, clearFields } from "redux-form";
import { connect } from "react-redux";
import FieldComponent from "./fieldComponent.jsx";

const fieldId = field => {
    if (field.sectionName) {
        return `${field.formName}.${field.sectionName}.${field.name}`;
    }
    return `${field.formName}.${field.name}`;
};

const isHidden = ({ showField, showOn, showFieldValue, hidden }) => {
    let hideDependentField = false;

    if (showField && Array.isArray(showOn)) {
        hideDependentField = !showOn.includes(showFieldValue);
    } else if (showField) {
        hideDependentField = showOn !== showFieldValue;
    }

    return hidden || hideDependentField;
};

/**
 * XBField adds to FieldComponent the showFieldValue prop if field depends from another field value
 */
class XBField extends Component {
    componentDidUpdate(prevProps) {
        const wasHidden = isHidden(prevProps);
        if (!wasHidden && isHidden(this.props)) {
            this.props.reset(this.props.formName, this.props.name);
        }
    }

    render() {
        return isHidden(this.props) ? null : (
            <Field
                {...this.props}
                component={FieldComponent}
                id={fieldId(this.props)}
                validation={this.props.validation || {}}
            />
        );
    }
}

const fieldValuePropType = PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]);

XBField.propTypes = {
    showField: PropTypes.string,
    showOn: PropTypes.oneOfType([fieldValuePropType, PropTypes.arrayOf(fieldValuePropType)]),
    showFieldValue: PropTypes.string,
    hidden: PropTypes.bool,
    reset: PropTypes.func,
    formName: PropTypes.string,
    name: PropTypes.string,
    validation: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
    // The value of the field that controls this field
    showFieldValue: formValueSelector(ownProps.formName)(state, ownProps.showField),
});

const mapDispatchToProps = dispatch => ({
    reset: (form, name) => dispatch(clearFields(form, false, false, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(XBField);