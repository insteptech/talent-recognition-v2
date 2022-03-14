import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TextInput from "../../../common/components/TextInput";
import { OnChangeModel } from "../../../common/types/Form.types";
import { IStateType } from "../../../store/models/root.interface";
import {
        onboardingWizardSignUp, 
        setUserData,
        onboardingWizardAddressUpdate,
          } from '../../../store/actions/onboardingWizard.action'

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory()

  const wizardUserData = useSelector((state: IStateType) => state.onboardingWizard.wizardUserData)
  const account = useSelector((state: IStateType) => state.onboardingWizard.accountNumber)

  const [step, setStep] = useState("step1")
  const [formState, setFormState] = useState({
    fullName: { error: "", value: "" },
    email: { error: "", value: "" },
    companyName: { error: "", value: "" },
    password: { error: "", value: "" },
    confirmPassword: { error: "", value: "" },
    address: { error: "", value: "" },
    city: { error: "", value: "" },
    postalCode: { error: "", value: "" },
    nosOfEmployee: { error: "", value: "" },
    contactNumber: { error: "", value: "" }
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } })
    dispatch(setUserData({ ...wizardUserData, [model.field]: model.value }))
  }

  const nextClickHandle = (e: any) => {
    e.preventDefault()
    const userData = {
      token: "",
      fullName: formState.fullName.value,
      email: formState.email.value,
      companyName: formState.companyName.value,
      contactNumber: formState.contactNumber.value,
      password: formState.password.value,
      confirmPassword: formState.confirmPassword.value,
      address: formState.address.value,
      city: formState.city.value,
      postalCode: formState.postalCode.value,
      nosOfEmployee: Number(formState.nosOfEmployee.value),
    }
    dispatch(onboardingWizardSignUp({ userData }));
    setStep("step2")
  }

  const nextClickHandle2 = (e: any) => {
    e.preventDefault()
    const userData = {
      token: "",
      fullName: formState.fullName.value,
      email: formState.email.value,
      companyName: formState.companyName.value,
      contactNumber: formState.contactNumber.value,
      password: formState.password.value,
      confirmPassword: formState.confirmPassword.value,
      address: formState.address.value,
      city: formState.city.value,
      postalCode: formState.postalCode.value,
      nosOfEmployee: Number(formState.nosOfEmployee.value),
      accountNumber: Number(account)
    }
    dispatch(onboardingWizardAddressUpdate({ userData }));
    setStep('step3')
  }
  const closeButton = (e: any) => {
    e.preventDefault()
    history.push(`/login`)
  }

  return (
    <>
      {step === 'step1' && (
        <>
          <div className="container">
            <div className=" col-md-8 mx-auto sign-onbrdg mt-1 pt-5" >
              <h6>Start Your Introductory Offer Now</h6>
              <form name="signUpForm">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="fullName"
                        type="text"
                        field='fullName'
                        value={formState.fullName.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Full Name*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="companyName"
                        type="text"
                        field='companyName'
                        value={formState.companyName.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Company Name*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="email"
                        field='email'
                        value={formState.email.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Email*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="contactNumber"
                        field='contactNumber'
                        value={formState.contactNumber.value}
                        onChange={hasFormValueChanged }
                        required={true}
                        maxLength={100}
                        label="Contact Number*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="password"
                        type="password"
                        field='password'
                        value={formState.password.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Password*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <TextInput
                        id="confirmPassword"
                        type="password"
                        field='confirmPassword'
                        value={formState.confirmPassword.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Confirm Password*"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="company-signup mb-3 mt-3 last-btn-sec">
                      <button
                        className="btn btn-next px-3 ml-0 mr-2 btn campaign-btn-new"
                        type="submit"
                        onClick={(e) => nextClickHandle(e)}
                        disabled={
                          !formState.fullName.value ||
                          !formState.companyName.value ||
                          !formState.email.value ||
                          !formState.password.value ||
                          !formState.confirmPassword.value ||
                          formState.password.value !== formState.confirmPassword.value
                        }
                      >NEXT
                    </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-5">
              <div className="d-flex justify-content-center mb-3 bread-crumb">
                <ul className="list-unstyled d-flex">
                  <li className="first-c"></li>
                  <li className={step === 'step1' ? "active" : 'd-active'} style={{ cursor: "pointer" }}>Step 1<i className="fa fa-angle-right"></i></li>
                  <li className="d-active" >Step 2 <i className="fa fa-angle-right"></i> </li>
                  <li className="d-active"  > Step 3 <i className="fa fa-angle-right"></i> </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="create-devider"></div>
        </>
      )
      }

      {step === 'step2' && (
        <>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 pt-5 mx-auto">
                <div className=" sign-onbrdg mt-3">
                  <h6>We need a little more information about your company</h6>
                  <form name='signUpForm'>
                    <div className="form-group">
                      <TextInput
                        id="address"
                        type="text"
                        field='address'
                        value={formState.address.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Address"
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <TextInput
                        id="city"
                        type="text"
                        field="city"
                        value={formState.city.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="City"
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <TextInput
                        id="postalCode"
                        field="postalCode"
                        value={formState.postalCode.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Post Code"
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <TextInput
                        id="nosOfEmployee"
                        numericality={true}
                        field="nosOfEmployee"
                        value={formState.nosOfEmployee.value}
                        onChange={hasFormValueChanged}
                        label="No. of Employee"
                        required={true}
                        maxLength={1000000000000}
                        placeholder=""
                        type="number"
                      />
                    </div>

                    <div className="cod-lg-12 col-md-12 col-sm-12 d-flex company-infobtn">
                      <button
                        className="btn btn-next mx-auto"
                        type="submit"
                        onClick={(e) => nextClickHandle2(e)}
                        style={{ cursor: "pointer" }}
                        disabled={
                          !formState.address.value ||
                          !formState.city.value ||
                          !formState.postalCode.value ||
                          !formState.nosOfEmployee.value
                        }
                      >Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="d-flex justify-content-center mb-3 bread-crumb">
              <ul className="list-unstyled d-flex">
                <li className="first-c"></li>
                <li className={step !== 'step2' ? "active" : 'd-active'} style={{ cursor: "pointer" }}>Step 1 <i className="fa fa-angle-right"></i></li>
                <li className={step === 'step2' ? "active" : "d-active"} style={{ cursor: "pointer" }}>Step 2 <i className="fa fa-angle-right"></i> </li>
                <li className={step !== 'step2' ? "active" : "d-active"} style={{ cursor: "pointer" }}>Step 3 <i className="fa fa-angle-right"></i> </li>
              </ul>
            </div>
          </div>

          <div className="create-devider"></div>
        </>
      )}
      { step === 'step3' && (
        <>
         <div className="login-banner mt-4">
                <div className="container login-text">
                    <div className="row">
                        <div className="col-lg-6">
                            <h1 className="cd-headline zoom norm-40-wide font-white sm-mt-20  sm-mb-20">
                            <span>&nbsp;<br /><br />TR Recruiter<br /></span></h1>
                        </div>
                    </div>
                </div>
            </div>
          <div className="container">
            <div className="row">
              <div className="company-infobtn mx-auto sign-onbrig close-onbrdg mt-5 ">
                <p> Your account has been set up.</p>
                <p>To activate your account please respons to the confirmation email sent to you.</p>
                <p>Once activated, you can then set up your first recruitment campaign at the introductory rate of 50%</p>
                <button
                  className="btn btn-next"
                  data-target="myModal"
                  data-toggle="modal"
                  data-backdrop="static"
                  data-keyboard="false"
                  onClick={(e) => closeButton(e)}
                  type="submit" >
                  CLOSE
                  </button>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="d-flex justify-content-center mb-3 bread-crumb">
              <ul className="list-unstyled d-flex">
                <li className="first-c"></li>
                <li className={step === 'step3' ? "active" : 'd-active'} style={{ cursor: "pointer" }}>Step 1<i className="fa fa-angle-right"></i></li>
                <li className={step === 'step3' ? "active" : "d-active"} style={{ cursor: "pointer" }}>Step 2 <i className="fa fa-angle-right"></i> </li>
                <li className={step === 'step3' ? "active" : "d-active"} style={{ cursor: "pointer" }} > Step 3 <i className="fa fa-angle-right"></i> </li>
              </ul>
            </div>
          </div>
          <div className="create-devider"></div>
        </>
      )}
    </ >
  )
}
export default Signup;