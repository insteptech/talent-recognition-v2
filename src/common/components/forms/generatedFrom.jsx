import React from "react";
import PropTypes from "prop-types";
import { FormSection } from "redux-form";
import Field from "./field.jsx";

const GeneratedForm = ({
    layout,
    handleSubmit,
    isShowSubmitButton,
    isShowCancelButton,
    onClickCancelButton,
    CancelButton,
    SubmitButton,
    submitting,
    invalid,
    asyncValidating,
}) => {
    const { fields, sections = [], name, submitLabelId, alwaysEnableSubmit } = layout;
    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field, i) => <Field {...field} key={field.name + i} formName={name} />)}
            {sections.map(section => (
                <FormSection name={section.name} key={section.name} className={section.className}>
                    {section.label && <h3>{section.label}</h3>}
                    {section.fields.map(field => (
                        <Field {...field} key={field.name} sectionName={section.name} formName={name} />
                    ))}
                </FormSection>
            ))}
            {isShowSubmitButton ? (
                <SubmitButton
                    disabled={submitting || invalid || !!asyncValidating}
                    submitLabelId={submitLabelId}
                    alwaysEnableSubmit={alwaysEnableSubmit}
                />
            ) : null}
            {isShowCancelButton ? <CancelButton onClick={onClickCancelButton} /> : null}
        </form>
    );
};

GeneratedForm.propTypes = {
    isShowSubmitButton: PropTypes.bool,
    isShowCancelButton: PropTypes.bool,
    onClickCancelButton: PropTypes.func,
    layout: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    CancelButton: PropTypes.any,
    SubmitButton: PropTypes.any,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const DefaultCancelButton = ({ onClick }) => (
    <button
        className="btn btn-default pull-left btn-lg"
        onClick={e => {
            e.preventDefault();
            if (onClick) onClick(e);
        }}
    > Cancel</button>
);

const DefaultSubmitButton = ({ disabled, submitLabelId, alwaysEnableSubmit }) => (
    <button
        className="btn btn-primary pull-right btn-lg form-generator__submit-button"
        type="submit"
        disabled={alwaysEnableSubmit ? false : disabled}
    > Submit </button>
);

DefaultCancelButton.propTypes = {
    onClick: PropTypes.func,
};

DefaultSubmitButton.propTypes = {
    disabled: PropTypes.bool,
    submitLabelId: PropTypes.string,
    alwaysEnableSubmit: PropTypes.bool,
};

GeneratedForm.defaultProps = {
    isShowSubmitButton: true,
    isShowCancelButton: false,
    SubmitButton: DefaultSubmitButton,
    CancelButton: DefaultCancelButton,
};

export default GeneratedForm;