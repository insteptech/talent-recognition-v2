import React, { Component } from "react";
import PropTypes from "prop-types";
import Select, { Creatable } from "react-select";
import "react-select/dist/react-select.css";
import formattedString from "../../../../propTypes/form";
/**
 * Select Input Component: Displays Select Input based on options param.
 * See PropTypes below for full param list
 */
export default class SelectInput extends Component {
    onChange = data => {
        let value;
        if (this.props.multi) {
            value = data && data.map(item => item.value);
        } else {
            value = (data && data.value) || null;
        }
        this.props.input.onChange(value);
        this.props.onChange && this.props.onChange(data);
    };
    onInputChange = data => {
        this.props.onInputChange && this.props.onInputChange(data);
        return data;
    };
    render() {
        const { placeholder, placeholderId, input, id, clearable, creatable } = this.props;
        const SelectComponent = creatable ? Creatable : Select;

        return (
            <SelectComponent
                {...this.props}
                placeholder={placeholder || ""}
                name={id}
                value={input.value || ""}
                onChange={this.onChange}
                onInputChange={this.onInputChange}
                clearable={clearable}
            />
        );
    }
}

SelectInput.propTypes = {
    // The props from redux-form Field component
    input: PropTypes.object.isRequired,

    // The props created in the parent components
    id: PropTypes.string.isRequired,

    onOpen: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onInputChange: PropTypes.func,

    // The props defined by a user
    placeholder: formattedString,
    placeholderId: PropTypes.string,
    multi: PropTypes.bool,
    clearable: PropTypes.bool,
    creatable: PropTypes.bool,
};

SelectInput.defaultProps = {
    clearable: true,
    placeholderId: "Generic.Select",
};