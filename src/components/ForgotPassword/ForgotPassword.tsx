import React, { useState, Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../common/components/TextInput';
import { OnChangeModel } from '../../common/types/Form.types';
import { forgotPasswordAction } from '../../store/actions/account.actions';
import { IStateType } from '../../store/models/root.interface'

const ForgetPassword: React.FC = () => {

    const dispatch: Dispatch<any> = useDispatch();
    const forgotPasswordSuccess = useSelector((state: IStateType) => state.account.forgotPasswordSuccess)

    const [formState, setFormState] = useState({
        email: { error: "", value: "" }
    })

    function hasFormValueChanged(model: OnChangeModel): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } })
    }

    const forgotPassword = (e: any) => {
        e.preventDefault()
        dispatch(forgotPasswordAction({ email: formState.email.value }))
    }

    return (
        <>
            {forgotPasswordSuccess && <div className="forgot-success">
                <i className="fa fa-check-circle fa-3x" aria-hidden="true"></i>
                <p>Email has been sent to {formState.email.value && formState.email.value}. <br />Please check your email for resetting password.</p>
            </div>}
            {!forgotPasswordSuccess && <div className="container px-0 h-100 p-160-cont ">
                <div className="content page-notfound login-main login-content mt-5">
                    <div className="col-lg-6 col-sm-12 mx-auto">
                        <div className="login-page-main mx-auto p-5">
                            <div className="login-heading">
                                <a data-toggle="tab">Forgot Password</a>
                            </div>
                            <form id="forgetPasswordForm" name="forgetPasswordForm" className="frm-mains pt-5 pb-5 ">
                                <TextInput
                                    id="Email"
                                    type="email"
                                    field="email"
                                    placeholder="Email"
                                    value={formState.email.value}
                                    onChange={hasFormValueChanged}
                                    required={true}
                                    label="Email"
                                    maxLength={50}
                                />
                                <div className="login-next mt-5">
                                    <button
                                        className="btn btn-next"
                                        onClick={(e) => forgotPassword(e)}
                                        style={{ cursor: "pointer" }}
                                        disabled={
                                            !formState.email.value
                                        }
                                    >
                                        FORGOT PASSWORD
                                      </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className="container br-container">
                <div className="hr-main"></div>
            </div>
        </ >
    )
}
export default ForgetPassword;