import React, { useState, FormEvent, Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { OnChangeModel } from "../../common/types/Form.types";
import { loginApi } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import Loader from '../../common/components/loader';
import { IStateType } from "../../store/models/root.interface";

const Login: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const history = useHistory();
  const loader: any = useSelector((state: IStateType) => state.account.loginLoader);
  const deptsAccess = useSelector((state: IStateType) => state.account.deptsAccess);
  const [formState, setFormState] = useState({
    email: { error: "", value: "" },
    password: { error: "", value: "" }
  });
  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }
  useEffect(() => {
    loginApi()
  }, [deptsAccess])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isFormInvalid()) { return; }
    let result: any = await dispatch(loginApi({ username: formState.email.value, password: formState.password.value }));
    if (result.success) {
      if (result.deptsAccess && result.deptsAccess.includes('dep8') || result.deptsAccess.includes('dep9')) {
        history.push('/campaign-dashboard');
        return
      }
      else if (result.deptsAccess.includes('dep10')) {
        history.push('/Accounts')
        return
      }
    }
  }

  function isFormInvalid() {
    return (formState.email.error || formState.password.error
      || !formState.email.value || !formState.password.value);
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }
  if (loader) {
    return (
      <Loader children={''} isLoading={loader} type={"circle"} />
    );
  }

  return (
    <div className="container-fluid bg-login-image-main">
      <div className="row h-100">
        <div className="col-xl-4 col-lg-4 col-md-1"></div>
        <div className="col-xl-3 col-lg-3 col-md-6 align-self-center">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="col-lg-12">
                <div className="pt-3 pb-4 pl-2 pr-2">
                  <div className="login-heading">
                    <div className="logo-image"></div>
                    <h2 className="h4 text-gray-900 mb-3 mt-2">Log in</h2>
                  </div>
                  <form className="user" onSubmit={submit}>
                    <div className="form-group">
                      <TextInput id="input_email"
                        field="email"
                        value={formState.email.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Email"
                        placeholder="Email" />
                    </div>
                    <div className="form-group">
                      <TextInput id="input_password"
                        field="password"
                        value={formState.password.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        type="password"
                        label="Password"
                        placeholder="Password" />
                    </div>
                    <button className={`btn btn-primary btn-user btn-block `}
                      type="submit"> Log in </button>

                    <div className="login-forget-main">
                      <a href="/forgetPassword">Forgot password?</a>
                    </div>
                  </form>
                  <hr />
                  <div className="login-bottom-links text-right">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
export default Login;