import React, { useState, ChangeEvent } from "react";
import { TextInputProps } from "../types/TextInput.types";

function TextInput(props: TextInputProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [, setValue] = useState("");
 
    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        let [error, validClass, elementValue] = ["", "", event.target.value];

        [error, validClass] = (!elementValue && props.required) ?
            ["Value cannot be empty", "is-invalid"] : ["", "is-valid"];

        if (!error) {
            [error, validClass] = (props.maxLength && elementValue && elementValue.length > (props.maxLength)) ?
                [`Value can't have more than ${props.maxLength} characters`, "is-invalid"] : ["", "is-valid"];
        }

        if (!error && props.numericality) {
            [error, validClass] = (props.numericality && elementValue && !/^\d+$/.test(elementValue) ) ?
                [`Not valid number`, "is-invalid"] : ["", "is-valid"];
        }

        if (!error && props.isEmail) {
            [error, validClass] = (props.isEmail && elementValue && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(elementValue).toLowerCase())) ?
                [`Not valid email`, "is-invalid"] : ["", "is-valid"];
        }

        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });
        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }
    
    return (
        <div>
            {props.label && (<label htmlFor={props.id.toString()}>{props.label}</label>)}
            <input
                onBlur={props.onblur}
                value={props.value}
                type={props.type}
                onChange={onValueChanged}
                className={`form-control ${props.inputClass} ${htmlClass}`}
                id={`id_${props.label}`}
                placeholder={props.placeholder}
                autoFocus={props.autofocus}
            />
            {error ?
                <div className="invalid-feedback">
                    {error}
                </div> : null
            }
        </div>
    );
}
export default TextInput;