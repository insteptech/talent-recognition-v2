import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { confirmSignup, setSignupConfirmation } from '../../../store/actions/onboardingWizard.action'
import { IStateType } from '../../../store/models/root.interface';

const ConfirmSignup: React.FC = () => {
    interface ParamTypes {
        token: string;
    }
    const dispatch = useDispatch();
    const token = useParams<ParamTypes>();
    const confirmSignedUp = useSelector((state: IStateType) => state.onboardingWizard.confirmSignedUp)

    useEffect(() => {
        dispatch(confirmSignup(token.token))
    }, [token.token])

    return (
        <>
            <div className="login-banner ">
                <div className="container login-text">
                    <div className="row">
                        <div className="col-lg-6">
                            <h1 className="cd-headline zoom norm-40-wide font-white sm-mt-20  sm-mb-20">
                                <span>&nbsp;<br /><br />TR Recruiter<br /></span></h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container px-0 h-100 p-160-cont ">
                {confirmSignedUp !== 0 && confirmSignedUp !== 200 &&
                    <div className="content error-confirm login-main" style={{ marginTop: "60px" }}>
                        Oops! Looks like confirmation token has been expired.
                    </div>
                }
                {confirmSignedUp === 200 &&
                    <div className="content success login-main text-center thnx-txt" style={{ marginTop: "60px" }}>
                        Your email has been confirmed, please click below to login.
                    </div>
                }
                {
                    confirmSignedUp === 200 &&
                    <div className="login-next mt-5" style={{ display: "flex", justifyContent: " center" }}>

                        <a className="btn btn-next login-thnx" href="/login">Login</a>
                    </div>
                }
            </div>
        </ >
    )
}
export default ConfirmSignup;