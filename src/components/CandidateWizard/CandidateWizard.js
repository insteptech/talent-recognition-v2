import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import Webcam from "react-webcam";
import logoIcon from "../../assets/logo-icon.png";
import avatar from "../../assets/Ellipse16.png";
import frame from "../../assets/shape-recognition-frame.png";
import TextInput from "../../common/components/TextInput";
import { saveCampaignWizard, getCampaign, getIp, uploadToBfm, setCompleted, createCampaign, cameraSelfieError } from '../../store/actions/campaign.actions';
import shutterSound from '../../assets/camera-shutter-click.mp3';

const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    },
        [playing]
    );

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);
    return [playing, toggle];
};

const CandidateWizard = () => {
    const dispatch = useDispatch();
    const selectCampaign = useSelector((state) => state.campaign.selectCampaign);
    const isCompleted = useSelector((state) => state.campaign.completed);
    const userId = useSelector((state) => state.campaign.userId);
    const errorUploading = useSelector((state) => state.campaign.error)

    const [step, setStep] = useState("step1");
    const [cv, setCv] = useState("");
    const [cvError, setCvError] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [coverLetterError, setCoverLetterError] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capture, setCapture] = useState(false);
    const location = useLocation();
    const [percentage, setPercentage] = React.useState(null);
    const [playing, toggle] = useAudio(shutterSound);

    let shots = [];
    const webcamRef = useRef(null);

    const [formState, setFormState] = useState({
        fullName: { error: "", value: "" },
        email: { error: "", value: "" },
        phone: { error: "", value: "" },
        resume: { error: "", value: "" },
        coverLetter: { error: "", value: "" },
        personalSummary: { error: "", value: "" },
        campaignQuestion1: { error: "", value: "" },
        campaignQuestion2: { error: "", value: "" },
        campaignQuestion3: { error: "", value: "" },
        campaignQuestion4: { error: "", value: "" },
        authorise: { value: false },
        termsAndConditions: { value: false },
    });

    const num = new RegExp(/^[A-Za-z]+$/g)

    function hasFormValueChanged(model) {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    const orgId = location && location.pathname && location.pathname.split('/')[2];
    useEffect(() => {
        dispatch(getIp());
        if (orgId) {
            localStorage.setItem('organizationID', orgId);
            dispatch(getCampaign(orgId));
        }
    }, [dispatch]);

    const changeValue = (e) => {
        setFormState({ ...formState, [e.target.id]: { error: "", value: e.target.value } });
    }

    const onSelectCV = (event) => {
        if (!event.target.files) {
            return;
        }
        const size = event.target.files[0].size / 1048576;
        const type = event.target.files[0].type;
        if ((type === "application/pdf") && size < 20) {
            setFormState({ ...formState, resume: { error: "", value: event.target.files[0].name } });
            const file = event.target.files[0];
            const myReader = new FileReader();
            const that = this;
            myReader.onloadend = (loadEvent) => {
                setTimeout(() => {
                    if (loadEvent === null) {
                        setCvError(true);
                        return
                    } else {
                        setCv(loadEvent && loadEvent.target && loadEvent.target.result ? loadEvent.target.result : "");
                    }
                }, 500);
            };

            myReader.readAsDataURL(file);
        }
        else {
            setCvError(true)
        }
    }

    const onSelectCover = (event) => {
        const size = event.target.files[0].size / 1048576;
        const type = event.target.files[0].type;
        if ((type === "application/pdf") && size < 20) {
            setFormState({ ...formState, coverLetter: { error: "", value: event.target.files[0].name } });
            const file = event.target.files[0];
            const myReader = new FileReader();
            const that = this;
            myReader.onloadend = (loadEvent) => {
                setTimeout(() => {
                    if (loadEvent === null) {
                        setCoverLetterError(true);
                        return
                    } else {
                        setCoverLetter(loadEvent && loadEvent.target && loadEvent.target.result ? loadEvent.target.result : "");
                    }
                }, 500);
            };
            myReader.readAsDataURL(file);
        }
        else {
            setCoverLetterError(true)
        }
    }

    const nextClickHandle = () => {
        const data = {
            AccountNo: selectCampaign.companyAccount,
            ApplicationID: userId !== null ? userId : 0,
            Campaign: selectCampaign.campaignID,
            Link: selectCampaign.link,
            checkbox: formState.termsAndConditions.value,
            coverLetters: coverLetter || "",
            cv: cv || "",
            email: formState.email.value,
            name: formState.fullName.value,
            organizationID: selectCampaign.link,
            phone: formState.phone.value,
            personalSummary: formState.personalSummary.value,
            CampaignQ1Answer: formState.campaignQuestion1.value,
            CampaignQ2Answer: formState.campaignQuestion2.value,
            CampaignQ3Answer: formState.campaignQuestion3.value,
            CampaignQ4Answer: formState.campaignQuestion4.value,
        }
        dispatch(saveCampaignWizard(data));
        setStep("step2");
    }

    const cameraReady = () => {
        setShowCamera(true);
        setCapture(true);
    }

    const b64toBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    const capture1 = async (e) => {
        const imageSrc = webcamRef.current.getScreenshot();

        shots.push({ image: b64toBlob(imageSrc) });

        var formData = new FormData();
        formData.append("image", b64toBlob(imageSrc));
        formData.append("requests", shots.length);
        setPercentage((shots.length * 16) + 4);
        dispatch(uploadToBfm(formData));
        if (shots && shots.length === 6) {
            toggle();
            dispatch(setCompleted(true));
            return;
        } else {
            toggle();
            setTimeout(() => {
                capture1();
            }, 2000);
        }
    };

    const tryAgain = (e) => {
        dispatch(setCompleted(false));
        dispatch(cameraSelfieError(undefined))
        setStep('step2');
    };

    return (
        <>
            <div className="col-lg-9 m-auto col-md-12 col-sm-12 create-campaign-main border-bottom ">
                <div className="row justify-content-center ">
                    <div className="logo-div">
                        {selectCampaign && selectCampaign.companyLogo ? (
                            <img src={selectCampaign.companyLogo} alt="" />
                        ) : (
                                <img className="img-fluid" src={logoIcon} alt="" />
                            )}

                        <p>{selectCampaign.companyName}</p>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mb-3">
                <div className="d-flex justify-content-center heading-p">
                    <h3 className="mt-3">{selectCampaign.advertTitle}</h3>
                </div></div>
            {!isCompleted && (<div className="d-flex justify-content-center mb-3 bread-crumbs">
                <ul className="list-unstyled d-flex">
                    <li className="first-c">Application  -</li>
                    <li className={step === "step1" ? "active" : "d-active"} onClick={() => setStep("step1")}>Step 1 <i className="fa fa-angle-right" ></i> </li>
                    <li className={step === "step2" ? "active" : "d-active"} >Step 2</li>
                </ul>
            </div>)}
            {step === "step1" && !isCompleted && (
                <>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-main m-auto">
                        <div className="row">
                            <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left border-top pt-3">
                                <h4>Personal Details</h4>
                                <p>Please enter your personal details </p>
                            </div>
                            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                                <div className="create-rigth-back">
                                    <form className="candidateWizard" >
                                        <div className="form-group">
                                            <TextInput
                                                id="fullName"
                                                field="fullName"
                                                value={formState.fullName.value}
                                                onChange={hasFormValueChanged}
                                                required={true}
                                                maxLength={100}
                                                label="Full Name*"
                                                placeholder=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextInput
                                                id="email"
                                                field="email"
                                                value={formState.email.value}
                                                onChange={hasFormValueChanged}
                                                required={true}
                                                maxLength={100}
                                                label="Email*"
                                                placeholder=""
                                                isEmail={true}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <TextInput
                                                id="phone"
                                                field="phone"
                                                value={formState.phone.value && formState.phone.value.replaceAll(num, "")}
                                                onChange={hasFormValueChanged}
                                                required={false}
                                                maxLength={100}
                                                label="Phone"
                                                placeholder=""
                                                numericality={true}
                                                type="number"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-12 col-sm-12 m-auto create-campaign-main">
                        <div className="create-devider"></div>
                        <div className="row">
                            <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                                <h4>Profile</h4>
                                <p>Upload your CV and a covering letter.</p>
                                <p>Documents need to be in PDF Format.</p>
                                <p>If you need to convert your document to PDF please follow this link.</p>
                            </div>
                            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                                <div className="create-rigth-back pb-4">
                                    <div><p className="m-0 mt-4">Résumé/CV*</p>
                                        <p className="sub-head-p">Document needs to be in PDF</p>
                                    </div>
                                    <form>
                                        <div className="upload-btn-wrapper">
                                            <button className="btn">
                                                {formState.resume.value ? formState.resume.value : <><i className="fas fa-link"></i>Attach</>}
                                            </button>
                                            <input
                                                type="file"
                                                name="resume"
                                                accept=".pdf"
                                                onChange={onSelectCV}
                                            />
                                        </div>
                                    </form>
                                    <div><p className="m-0 mt-4">Cover letter</p>
                                        <p className="sub-head-p">Document needs to be in PDF</p>
                                    </div>
                                    <form>
                                        <div className="upload-btn-wrapper">
                                            <button className="btn">
                                                {formState.coverLetter.value ? formState.coverLetter.value : <><i className="fas fa-link"></i>Attach</>}
                                            </button>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                name="coverLetter"
                                                onChange={onSelectCover}
                                            />
                                        </div>
                                    </form>
                                    <div><p className="m-0 mt-4">Personal Summary</p>
                                        <p className="sub-head-p">Document needs to be in PDF</p>
                                    </div>
                                    <textarea
                                        id="personalSummary"
                                        onChange={changeValue}
                                        className="form-control"
                                    ></textarea>

                                    {selectCampaign.campaignQuestion1 && selectCampaign.campaignQuestion1 !== null ? (<><div>
                                        <p className="m-0 mt-4">{selectCampaign.campaignQuestion1}</p></div>
                                        <TextInput
                                            type="text"
                                            id="campaignQuestion1"
                                            field="campaignQuestion1"
                                            value={formState.campaignQuestion1.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            placeholder=""
                                        /> </>) : ""}

                                    {selectCampaign.campaignQuestion2 && selectCampaign.campaignQuestion2 !== null ? (<><div>
                                        <p className="m-0 mt-4">{selectCampaign.campaignQuestion2}</p></div>
                                        <TextInput
                                            type="text"
                                            id="campaignQuestion2"
                                            field="campaignQuestion2"
                                            value={formState.campaignQuestion2.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            placeholder=""
                                        /> </>) : ""}

                                    {selectCampaign.campaignQuestion3 && selectCampaign.campaignQuestion3 !== null ? (<><div>
                                        <p className="m-0 mt-4">{selectCampaign.campaignQuestion3}</p></div>
                                        <TextInput
                                            type="text"
                                            id="campaignQuestion3"
                                            field="campaignQuestion3"
                                            value={formState.campaignQuestion3.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            placeholder=""
                                        /> </>) : ""}

                                    {selectCampaign.campaignQuestion4 && selectCampaign.campaignQuestion4 !== null ? (<><div>
                                        <p className="m-0 mt-4">{selectCampaign.campaignQuestion4}</p></div>
                                        <TextInput
                                            type="text"
                                            id="campaignQuestion4"
                                            field="campaignQuestion4"
                                            value={formState.campaignQuestion4.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            placeholder=""
                                        /> </>) : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 m-auto col-md-12   col-sm-12 create-campaign-main">
                        <div className="create-devider"></div>
                        <div className="row">
                            <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                                <h4>TR Recruiter authorization</h4>
                                <p>You will take a photo on your webcam from which we extract a psychometric profile which will accompany your application.</p>
                                <p>If you don't have a webcam on your PC please use your phone!</p>
                            </div>
                            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                                <div className="create-rigth-back">
                                    <div className="pt-4 ">
                                        <div className="p-3 pink-box">  <p>We are using TR Recruiter to create an accurate psychometric profile, which will accompany your application.</p>
                                            <p>
                                                Once authorised we will take a short series of rapid fire photos using the camera on your device to create this profile. Once your profile has been created your image will be immediately deleted from our files and records.</p>
                                        </div>
                                        <div>
                                            <div className="form-check mt-3 cust-check">
                                                <Form.Check
                                                    type="checkbox"
                                                    id="authorise"
                                                    onChange={(e) => setFormState({ ...formState, authorise: { value: e.target.checked } })}
                                                    checked={formState.authorise.value}
                                                />
                                                <label className="form-check-label" htmlFor="exampleCheck1">I authorise the use of TR Recruiter*</label>
                                            </div>
                                        </div>
                                        <div className="form-check mt-1 cust-check">
                                            <Form.Check
                                                type="checkbox"
                                                id="termsAndConditions"
                                                onChange={(e) => setFormState({ ...formState, termsAndConditions: { value: e.target.checked } })}
                                                checked={formState.termsAndConditions.value}
                                            />
                                            <label className="form-check-label" htmlFor="exampleCheck1">I agree with the Terms and Conditions and the Privacy Policy*</label>
                                        </div>
                                        <div className="mb-3 mt-3 last-btn-sec">
                                            <button
                                                className="px-3 ml-0 mr-2 btn campaign-btn-new"
                                                disabled={
                                                    !formState.fullName.value ||
                                                    !formState.email.value ||
                                                    !formState.resume.value ||
                                                    !formState.authorise.value ||
                                                    !formState.termsAndConditions.value
                                                }
                                                onClick={nextClickHandle}
                                            >
                                                Next
                                                     </button>
                                            <span>Make sure you have a webcam on your PC or please use your phone for your application!</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="d-flex justify-content-center mb-3 bread-crumbs">
                                        <ul className="list-unstyled d-flex">
                                            <li className="first-c">Application  -</li>
                                            <li className={step === "step1" ? "active" : "d-active"} onClick={() => setStep("step1")}>Step 1 <i className="fa fa-angle-right" ></i> </li>
                                            <li className={step === "step2" ? "active" : "d-active"} >Step 2 <i className="fa fa-angle-right" ></i> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="create-devider"></div>
                </>)
            }
            {/* photo div */}
            {step === "step2" && !isCompleted && (
                <div className="photo-div mb-5">
                    <div className="col-lg-9 col-md-12 m-auto   col-sm-12 create-campaign-main">
                        <div className="row">
                            <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left border-top pt-4">
                                <h5>Taking your photo</h5>
                                <p>Please authorize any requested permissions in your browser to allow us to use your webcam</p>
                                <div className="p-3 pink-box2 mt-3">
                                    <p> We are using TR Recruiter to create an accurate psychometric profile, which will accompany your application.</p>
                                    <p> We will take a short series of rapid fire photos using the camera on your device to create this profile. </p>
                                    <p> Once your profile has been created your image will be immediately deleted from our files and records.</p>
                                </div>
                            </div>
                            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right photo-box">
                                <div className="create-rigth-back pb-4">
                                    <div className="row py-3">
                                        <div className="col-md-5 text-center justify-content-center">
                                            <div className="rounded-div">
                                                <img src={frame} className="frame-img img-fluid" />
                                                {!showCamera && (<img src={avatar} className="avatarImg img-fluid" />)}
                                                {showCamera && (
                                                    <div className="camera-set">
                                                        <Webcam
                                                            width="300px"
                                                            height="250px"
                                                            mirrored
                                                            id="webcam"
                                                            audio={false}
                                                            ref={webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            screenshotQuality={0.8}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {!capture ? (
                                                <button
                                                    className="px-3 ml-0 mr-2 btn campaign-btn-new mt-4 px-5"
                                                    onClick={cameraReady}> Ready
                                                </button>
                                            ) : (
                                                    < button
                                                        className="px-3 ml-0 mr-2 btn campaign-btn-new mt-4 px-5"
                                                        onClick={(e) => capture1(e)} > Capture
                                                    </button>
                                                )}
                                        </div>
                                        <div className="col-md-7">
                                            <ul className="avatar-ul">
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Please adopt a passport pose</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Ensure your head and shoulders fills the lens</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Ensure both ears are showing or both edges of your face</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Avoid smiling or having your mouth open</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Remove any glasses</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>Do not rotate or tilt your head</span></li>
                                                <li><i className="mr-3 fa fa-check" aria-hidden="true"></i><span>When ready please click the button</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="create-devider"></div>
                                    {errorUploading && errorUploading === 400 ? <p>Face not found. Please Try again</p> : ""}
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: percentage === null ? "0%" : `${percentage}%` }}
                                        >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isCompleted && (
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-12 left-img ">
                        </div>

                        <div className="col-lg-8 col-md-8 col-sm-12 right-content pb-3 pt-3">
                            {errorUploading && errorUploading === 400 || errorUploading === 401 || errorUploading === 403 || errorUploading === 404 ?
                                <><div className="col-lg-12 col-md-12 col-sm-12 section-form pt-4 pb-5 text-center">
                                    <h3 > We can't take the Photo. Please try again </h3>
                                </div>
                                    <div style={{ display: 'flex', justifyContent: "center" }}>
                                        < button
                                            className="px-3 ml-0 mr-2 btn campaign-btn-new mt-4 px-5 d-flex justify-content-center"
                                            style={{ display: 'flex', justifyContent: "center" }}
                                            onClick={(e) => tryAgain(e)}
                                        >    Try Again
                                        </button>
                                    </div>
                                </>
                                : <>
                                    <div className="col-lg-12 col-md-12 col-sm-12 section-form pt-4 pb-5 text-center">
                                        {/* { errorUploading && errorUploading === 400 || errorUploading === 401 || errorUploading === 403 || errorUploading === 404 ? <h3 > Please try again </h3> : <h3>Application Complete</h3>} */}
                                        <h3>Application Complete</h3>
                                    </div>

                                    <div className="col-lg-8 col-md-12 col-sm-12 mx-auto p-0 selfie-intro">
                                        <p>Thank you {formState.fullName.value} for your application for the role of {selectCampaign && selectCampaign.advertTitle}.</p>
                                        <p>Your details have been uploaded and we will get in touch in the event that we
                                            wish to take your application further.</p>
                                    </div>
                                </>}
                        </div>
                        <div className="col-lg-2 col-md-2 col-sm-12 left-img ">
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default CandidateWizard;