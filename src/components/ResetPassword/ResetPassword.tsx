import React, { useState, Dispatch } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../common/components/TextInput';
import { OnChangeModel } from '../../common/types/Form.types';
import { resetPasswordAction } from '../../store/actions/account.actions';
import { IStateType } from '../../store/models/root.interface'

const ResetPassword: React.FC = () => {
    interface ParamTypes {
        token: string;
    }
    const dispatch: Dispatch<any> = useDispatch();
    const { token } = useParams<ParamTypes>();

    const resetPasswordSuccess = useSelector((state: IStateType) => state.account.resetPasswordSuccess)

    const [formState, setFormState] = useState({
        password: { error: "", value: "" },
        confirmPassword: { error: "", value: "" }
    })

    function hasFormValueChanged(model: OnChangeModel): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } })
    }

    const resetPassword = (e: any) => {
        e.preventDefault()
        const resetPasswordData = {
            password: formState.password.value,
            token: token,
        }
        dispatch(resetPasswordAction({ resetPasswordData }))
    }

    return (
        <>
            {resetPasswordSuccess && <div className="forgot-success">
                <i className="fa fa-check-circle fa-3x" aria-hidden="true"></i>
                <p>Your password has been reset successfully.<br />Please <a href="/login">click</a> here to login .</p>
            </div>}
            {!resetPasswordSuccess && <div className="container-fluid px-0 h-100 p-160-cont ">
                <div className="content page-notfound login-main login-content p-5">
                    <div className="col-lg-4 col-sm-12 mx-auto">
                    <div className="login-page-main mx-auto p-3">
                        <div className="login-heading">
                            <a data-toggle="tab">Reset Password</a>
                        </div>
                        <form id="resetPasswordForm" name="resetPasswordForm" className="frm-mains pt-5 pb-5 ">
                            <TextInput
                                id="password"
                                field="password"
                                type="password"
                                placeholder="Password"
                                value={formState.password.value}
                                onChange={hasFormValueChanged}
                                maxLength={50}
                                required={true}
                            />
                            <TextInput
                                id="confirmPassword"
                                field="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={hasFormValueChanged}
                                value={formState.confirmPassword.value}
                                required={true}
                                maxLength={50}
                            />
                            <div className="login-next mt-5">
                                <button
                                    onClick={(e) => resetPassword(e)}
                                    className="btn btn-next"
                                    disabled={
                                        !formState.password.value
                                        || !formState.confirmPassword.value
                                        || formState.password.value !== formState.confirmPassword.value
                                    }
                                >
                                    RESET PASSWORD
                                      </button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>}
            <div className="container br-container">
                <div className="hr-main"></div>
            </div>
        </>
    )
}
export default ResetPassword