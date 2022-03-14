import React from "react";
import DatePicker from "./inputComponents/datepicker.jsx";
import TextInput from "./inputComponents/textInput.jsx";
import SelectInput from "./inputComponents/selectInput.jsx";
import CheckBoxInput from "./inputComponents/checkBoxInput.jsx";
import RadioInput from "./inputComponents/radioInput.jsx";
import NumericInputComponent from "./inputComponents/numberInput.jsx";
import TextareaInput from "./inputComponents/textareaInput.jsx";
import CollapsedComponent from "./collapsedComponent.jsx";
import RadioInputSingle from "./inputComponents/radioInputSingle.jsx";

const getComponent = field => {
    let showLabel = true,
        Component;
    const props = {};
    switch (field.type) {
        case "text":
            Component = TextInput;
            props.type = field.type;
            props.subType = field.subType
            break;
        case "checkbox":
            showLabel = false;
            Component = CheckBoxInput;
            break;
        case "date":
            Component = DatePicker;
            break;
        case "radioGroup":
            Component = RadioInput;
            break;
        case "select":
            Component = SelectInput;
            break;
        case "textarea":
            Component = TextareaInput;
            break;
        case "number":
            Component = NumericInputComponent;
            break;
        case "password":
            Component = TextInput;
            break;
        case "radio":
            Component = RadioInputSingle;
            break;
        default:
            return <h1 style={{ color: "red" }}>Bad field type {field.type}</h1>;
    }

    if (showLabel) {
        return (
            <CollapsedComponent {...field} {...props}>
                <Component {...field} {...props} />
            </CollapsedComponent>
        );
    } else {
        return <Component {...field} />;
    }
};
export default getComponent;