import React, { useState, Dispatch, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Form, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextInput from "../../../../common/components/TextInput";
import { OnChangeModel } from "../../../../common/types/Form.types";
import { IStateType, IRootPageStateType } from "../../../../store/models/root.interface";
import {
    setCampaignData,
    fetchCampaignRoles,
    fetchCampaignMbti,
    fetchPreSpendRatio,
    setCampaignMode,
    createCampaign,
    deleteDraftCampaign,
    setExtraversionRed,
    fetchCampaignPreferences,
    fetchProcessRoleSelected,
    setCampaignPreferences,
    fetchCampaignDetails,
    setCampaignInProcessID,
    updateCampaignTypeAction,
} from '../../../../store/actions/CustService/custServiceCampaign.action';
import Loader from '../../../../common/components/loader';
import { closeCampaign } from "../../../../store/actions/CustService/custServiceProducts.action";
import { fetchPaymentMethod } from '../../../../store/actions/CustService/custService.action';
const CSCreateCampaign: React.FC = () => {
    interface ISelectedMbti {
        type: any;
        show: any;
    }
    const history = useHistory();
    const dispatch: Dispatch<any> = useDispatch();
    const location = useLocation()
    const campaignInfo: any = useSelector((state: IStateType) => state.custServiceCampaign.campaign);
    const mbtiLoader: any = useSelector((state: IStateType) => state.custServiceCampaign.mbtiLoader);
    const roles: any = useSelector((state: IStateType) => state.custServiceCampaign.roles);
    const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
    const mbti: any = useSelector((state: IStateType) => state.custServiceCampaign.mbti);
    const preferences: any = useSelector((state: IStateType) => state.custServiceCampaign.preferences);
    const preSpendRatio: any = useSelector((state: IStateType) => state.custServiceCampaign.preSpendRatio);
    const extraversionRed: any = useSelector((state: IStateType) => state.custServiceCampaign.extraversion);
    const selectedCampaignID: any = useSelector((state: IStateType) => state.custServiceCampaign.id);
    const creditCard: any = useSelector((state: IStateType) => state.custService.paymentMethod.cardNumber)

    const [expertMode, toggleExpertMode] = useState<boolean>(false);
    const [mbtyType, setMbtyType] = useState('');
    const [extraversion, setExtraversion] = useState<number[]>([]);
    const [neuroticism, setNeuroticism] = useState<number[]>([]);
    const [agreeableness, setAgreeableness] = useState<number[]>([]);
    const [opennesstoExperience, setOpennesstoExperience] = useState<number[]>([]);
    const [conscienciousness, setConscienciousness] = useState<number[]>([]);
    const [showCloseModal, setCloseShow] = useState(false);
    const [isRangeChange, setRangeChange] = useState(false);
    const [key, setKey] = useState('Role');
    const [selectedMbtiType, setSelectedMbtiType] = useState<ISelectedMbti>({ type: '', show: false });
    const [selectedExpertMbtiType, setSelectedExpertMbtiType] = useState<ISelectedMbti>({ type: '', show: false });
    const [roleSelected, setSelectedRole] = useState('');
    const [closeDate, setCloseDate] = useState(new Date());
    const [campaignType, setCampaignType] = useState(1);

    const handleCloseCampaignModal = () => setCloseShow(false);
    const handleShowCampaignModal = () => { setCloseShow(true) };
    const selectedCampaignCS = window.sessionStorage.getItem("selectedCampaignCS");

    let cid = location && location.pathname && location.pathname.split('/')[3]
    const { campaignName } = campaignInfo || {};

    const [formState, setFormState] = useState({
        companyInternalReference: { error: "", value: "" },
        advertTitle: { error: "", value: "" },
        campaignQuestion1: { error: "", value: "" },
        campaignQuestion2: { error: "", value: "" },
        campaignQuestion3: { error: "", value: "" },
        campaignQuestion4: { error: "", value: "" },
        spendingCap: { value: 500 },
        roleId: { value: null },
        MBTITypes: { value: null },
    });
    useEffect(() => {
        dispatch(fetchPaymentMethod());
    }, [creditCard])

    function hasFormValueChanged(model: OnChangeModel): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
        dispatch(setCampaignData({ ...campaignInfo, [model.field]: model.value }));
    }
    const update = () => {
        dispatch(createCampaign(campaignInfo));
        history.push(`/customerService/createCampaign/${selectedCampaignID}`)
    }
    useEffect(() => {
        if (cid && cid !== null && cid !== undefined) {
            dispatch(fetchCampaignDetails(cid));
            dispatch(setCampaignInProcessID(parseInt(cid)));
        }
    }, [cid]);

    useEffect(() => {
        setExtraversion(extraversionRed);
    }, [isRangeChange]);

    const goBack = () => { history.push('/customerService/companycampaign') }

    const activeCampaign = () => {
        if (creditCard) {
            dispatch(setCampaignData({ ...campaignInfo, published: 1, MBTITypes: preferences, campaignType: campaignType }));
            dispatch(createCampaign(campaignInfo));
            history.push('/customerService/companycampaign');
            window.location.reload()
        } else if (!creditCard) {
            history.push('/customerService/useraccount')
        }
    }

    useEffect(() => {
        if (preferences && preferences.length === 1 && preferences[0] && preferences[0].selected === 0) {
            handlePreference(preferences[0]);
        }
    }, [preferences])

    useEffect(() => {
        if (campaignInfo.campaignType == 2) {
            setKey('MBTI');
            dispatch(fetchCampaignMbti());
            toggleExpertMode(true);
        }
        if (campaignInfo.campaignType == 3) {
            setKey('FFM');
            toggleExpertMode(true);
        }
        if (selectedCampaignCS && Number(selectedCampaignCS) != 0) {
            dispatch(fetchCampaignDetails(window.sessionStorage.getItem("selectedCampaignCS")));
            dispatch(fetchCampaignPreferences());
        }
        let data: any[] = [];
        preferences && preferences.length > 0 && preferences.map((ele: any) => {
            if (ele.selected === 1) {
                setSelectedExpertMbtiType({ type: ele.mbtiType, show: true });
            }
        });
        mbti && mbti.length > 0 && mbti.map((ele: any) => {
            if (ele.selected === 1) {
                setMbtyType(ele.mbtiType);
                setSelectedExpertMbtiType({ type: ele.mbtiType, show: true });
            }
        })

        data[0] = campaignInfo.modelFFMELow;
        data[1] = campaignInfo.modelFFMEHigh;
        dispatch(setExtraversionRed(data));

        extraversion[0] = campaignInfo.modelFFMELow;
        extraversion[1] = campaignInfo.modelFFMEHigh;
        neuroticism[0] = campaignInfo.modelFFMNLow;
        neuroticism[1] = campaignInfo.modelFFMNHigh;
        agreeableness[0] = campaignInfo.modelFFMALow;
        agreeableness[1] = campaignInfo.modelFFMAHigh;
        opennesstoExperience[0] = campaignInfo.modelFFMOLow;
        opennesstoExperience[1] = campaignInfo.modelFFMOHigh;
        conscienciousness[0] = campaignInfo.modelFFMCLow;
        conscienciousness[1] = campaignInfo.modelFFMCHigh;
        setExtraversion(extraversion);

        dispatch(fetchCampaignRoles());
        dispatch(fetchPreSpendRatio());
        dispatch(setCampaignMode(true));
    }, [path.area, campaignInfo.campaignID, cid, dispatch]);
    useEffect(() => {
        setFormState({
            ...formState,
            advertTitle: { error: '', value: campaignInfo.advertTitle },
            campaignQuestion1: { error: '', value: campaignInfo.campaignQuestion1 },
            campaignQuestion2: { error: '', value: campaignInfo.campaignQuestion2 },
            campaignQuestion3: { error: '', value: campaignInfo.campaignQuestion3 },
            campaignQuestion4: { error: '', value: campaignInfo.campaignQuestion4 },
            companyInternalReference: { error: '', value: campaignInfo.companyInternalReference },
            roleId: { value: campaignInfo.roleId },
            spendingCap: { value: campaignInfo.spendingCap }
        });

        let data = roles && roles.length > 0 && roles.find((element: { nameInd: any; roleName: any; }) => {
            return element.nameInd == campaignInfo.roleId;
        });
        setSelectedRole(data && data.roleName);
    }, [campaignInfo]);
    const clickSpendingCap = (e: any) => {
        setFormState({ ...formState, spendingCap: { value: Number(e.target.value) } });
        dispatch(setCampaignData({ ...campaignInfo, spendingCap: Number(e.target.value), campaignType: campaignType }));
        dispatch(createCampaign({ ...campaignInfo, spendingCap: Number(e.target.value) }));
    }
    const handleInputChange = (e: any) => {
        setFormState({ ...formState, roleId: { value: e.value } });
        dispatch(setCampaignData({ ...campaignInfo, roleId: e.value, campaignType: campaignType }));
        dispatch(createCampaign({ ...campaignInfo, roleId: e.value }));
        dispatch(fetchProcessRoleSelected())
        setSelectedRole(e.label);
        setSelectedMbtiType({ type: '', show: false });
    };

    const roleSelect: { value: any; label: any; }[] = [];
    roles && roles.length > 0 && roles.forEach((element: { nameInd: any; roleName: any; }) => {
        roleSelect.push({ value: element.nameInd, label: element.roleName });
    });

    let selectedRole: { value: any; label: any; } = { value: '', label: '' };
    formState.roleId.value && roleSelect.filter(roleId => {
        if (roleId.value == formState.roleId.value) {
            return selectedRole = roleId;
        }
    });
    const handleExpertMode = (e: any) => {
        if (e.target.checked) {
            setKey('MBTI');
            dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 2 }));
            dispatch(createCampaign({ ...campaignInfo, campaignType: 2 }));
        } else {
            setKey('Role')
            dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 1 }));
            dispatch(createCampaign({ ...campaignInfo, campaignType: 1 }));
        }

        dispatch(fetchCampaignMbti());
        toggleExpertMode(e.target.checked);
    }
    const handleTabs = (e: any) => {
        setKey(e);
        dispatch(fetchCampaignMbti());
        if (e == 'Role') {
            dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 1 }));
            setCampaignType(1);
            toggleExpertMode(false);
            delete campaignInfo.MBTITypes;
            dispatch(createCampaign({ ...campaignInfo, campaignType: 1 }));
        }
        else if (e == 'MBTI') {
            dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 2 }));
            setCampaignType(2);
            toggleExpertMode(true);
            dispatch(createCampaign({ ...campaignInfo, campaignType: 2 }));
        } else if (e == 'FFM') {
            dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 3 }));
            setCampaignType(3);
            toggleExpertMode(true);
            delete campaignInfo.MBTITypes;
            dispatch(createCampaign({ ...campaignInfo, campaignType: 3 }));
        }
    }
    const handleChange = (e: any) => {
        let selected: any[] = [];
        mbti.forEach((ele: any) => {
            if (e.target.id === ele.mbtiType) {
                setSelectedExpertMbtiType({ type: e.target.id, show: ele.selected === 0 ? true : false });
                ele.selected = 1;
                selected.push(ele);
            } else {
                ele.selected = 0;
                selected.push(ele);
            }
        });
        setMbtyType(e.target.id);
        setFormState({ ...formState, MBTITypes: { value: e.target.id } });
        dispatch(setCampaignData({ ...campaignInfo, MBTITypes: e.target.id, campaignType: 2 }));
        dispatch(createCampaign({ ...campaignInfo, MBTITypes: selected, AdvanceMBTI: true, campaignType: 2 }));
    }
    const handlePreference = (e: any) => {
        let selected: any[] = [];
        preferences.forEach((ele: any) => {
            if (e.mbtiType === ele.mbtiType) {
                setSelectedMbtiType({ type: e.mbtiType, show: ele.selected === 0 ? true : false });
                ele.selected = ele.selected === 1 ? 0 : 1;
                selected.push(ele);
            } else {
                ele.selected = 0;
                selected.push(ele);
            }
        });
        dispatch(setCampaignPreferences(selected));
        dispatch(setCampaignData({ ...campaignInfo, MBTITypes: selected, campaignType: campaignType }));
        dispatch(createCampaign({ ...campaignInfo, MBTITypes: selected }));
    }

    function setValue(name: any, value: any) {
        setRangeChange(!isRangeChange);
        if (name == 'extraversion') {
            let a = extraversion;
            if (value && a.length == 2) {
                a.splice(1, 1);
                a[0] = value;
            }
            if (a.length == 0) {
                a.push(value)
            }
            else {
                if (a.length == 1) {
                    if (a[0] < value) {
                        a.push(value)
                    }
                    if (a[0] > value) {
                        let new1 = [];
                        new1[0] = value
                        new1[1] = a[0];
                        a = new1;
                    }
                }
            }
            dispatch(setExtraversionRed(a));
            setExtraversion(a);
        } else if (name == 'neuroticism') {
            let a = neuroticism;
            if (value && a.length == 2) {
                a.splice(1, 1);
                a[0] = value;
            }
            if (a.length == 0) {
                a.push(value)
            }
            else {
                if (a.length == 1) {
                    if (a[0] < value) {
                        a.push(value)
                    }
                    if (a[0] > value) {
                        let new1 = [];
                        new1[0] = value
                        new1[1] = a[0];
                        a = new1;
                    }
                }
            }
            setNeuroticism(a);
        } else if (name == 'agreeableness') {
            let a = agreeableness;
            if (value && a.length == 2) {
                a.splice(1, 1);
                a[0] = value;
            }
            if (a.length == 0) {
                a.push(value)
            }
            else {
                if (a.length == 1) {
                    if (a[0] < value) {
                        a.push(value)
                    }
                    if (a[0] > value) {
                        let new1 = [];
                        new1[0] = value
                        new1[1] = a[0];
                        a = new1;
                    }
                }
            }
            setAgreeableness(a);
        } else if (name == 'opennesstoExperience') {
            let a = opennesstoExperience;
            if (value && a.length == 2) {
                a.splice(1, 1);
                a[0] = value;
            }
            if (a.length == 0) {
                a.push(value)
            }
            else {
                if (a.length == 1) {
                    if (a[0] < value) {
                        a.push(value)
                    }
                    if (a[0] > value) {
                        let new1 = [];
                        new1[0] = value
                        new1[1] = a[0];
                        a = new1;
                    }
                }
            }
            setOpennesstoExperience(a);
        } else if (name == 'conscienciousness') {
            let a = conscienciousness;
            if (value && a.length == 2) {
                a.splice(1, 1);
                a[0] = value;
            }
            if (a.length == 0) {
                a.push(value)
            }
            else {
                if (a.length == 1) {
                    if (a[0] < value) {
                        a.push(value)
                    }
                    if (a[0] > value) {
                        let new1 = [];
                        new1[0] = value
                        new1[1] = a[0];
                        a = new1;
                    }
                }
            }
            setConscienciousness(a);
        }
    }
    const handleCloseDateChange = (date: any) => {
        setCloseDate(date);

    };

    const confirmClose = () => {
        const campaignData = {
            id: campaignInfo.campaignID,
            date: closeDate,
            comment: "",
        }
        handleCloseCampaignModal();
        dispatch(closeCampaign(campaignData));
        history.push('/customerService/companycampaign');
    }

    const deleteDraft = () => {
        dispatch(deleteDraftCampaign({ id: campaignInfo.campaignID }))
        history.push('/customerService/companycampaign')
        window.location.reload()
    }
    useEffect(() => {
        dispatch(fetchCampaignMbti())
        dispatch(fetchCampaignPreferences())
    }, [selectedCampaignID, campaignInfo.campaignType]);
    const saveFfmRange = () => {
        setCampaignType(3);
        dispatch(updateCampaignTypeAction({ ID: campaignInfo.campaignID, Active: 3 }));
        dispatch(setCampaignData({
            ...campaignInfo, campaignType: 3,
            modelFFMELow: extraversion.length > 0 && extraversion[0] || 0,
            modelFFMEHigh: extraversion.length > 0 && extraversion[1] || 0,
            modelFFMNLow: neuroticism.length > 0 && neuroticism[0] || 0,
            modelFFMNHigh: neuroticism.length > 0 && neuroticism[1] || 0,
            modelFFMALow: agreeableness.length > 0 && agreeableness[0] || 0,
            modelFFMAHigh: agreeableness.length > 0 && agreeableness[1] || 0,
            modelFFMCLow: conscienciousness.length > 0 && conscienciousness[0] || 0,
            modelFFMCHigh: conscienciousness.length > 0 && conscienciousness[1] || 0,
            modelFFMOLow: opennesstoExperience.length > 0 && opennesstoExperience[0] || 0,
            modelFFMOHigh: opennesstoExperience.length > 0 && opennesstoExperience[1] || 0,
        }));
        dispatch(createCampaign({
            ...campaignInfo,
            campaignType: 3,
            modelFFMELow: extraversion.length > 0 && extraversion[0] || 0,
            modelFFMEHigh: extraversion.length > 0 && extraversion[1] || 0,
            modelFFMNLow: neuroticism.length > 0 && neuroticism[0] || 0,
            modelFFMNHigh: neuroticism.length > 0 && neuroticism[1] || 0,
            modelFFMALow: agreeableness.length > 0 && agreeableness[0] || 0,
            modelFFMAHigh: agreeableness.length > 0 && agreeableness[1] || 0,
            modelFFMCLow: conscienciousness.length > 0 && conscienciousness[0] || 0,
            modelFFMCHigh: conscienciousness.length > 0 && conscienciousness[1] || 0,
            modelFFMOLow: opennesstoExperience.length > 0 && opennesstoExperience[0] || 0,
            modelFFMOHigh: opennesstoExperience.length > 0 && opennesstoExperience[1] || 0,
        }
        ));
    }
    return (
        <>
            <div className="back-button" onClick={goBack} style={{ cursor: 'pointer' }}><i className="fas fa-chevron-left"></i> Campaigns</div>
            <div className="row">
                <div className="col-8">
                    <h1 className="campaign-hdg accunt-hdg mb-2 mr-2">{campaignName || ""}</h1>
                </div>
            </div>
            <div className="create-campaign-modal-main">
                <Modal className="create-campaign-modal-main" show={showCloseModal} aria-labelledby="contained-modal-title-vcenter" centered onHide={handleCloseCampaignModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="crate-input-nme">
                            <label>Do you really want to close campaign ?</label>
                            <div className='d-flex'>
                                <DatePicker
                                    selected={closeDate}
                                    onChange={handleCloseDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    placeholderText="Date on which you wish to de-activate this user."
                                    showDisabledMonthNavigation
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="cancel-btn-modal" onClick={handleCloseCampaignModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" className="crate-btn-modal" onClick={confirmClose}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-main">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                        <h4>Internal details</h4>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                        <div className="create-rigth-back">
                            <form className="user" >
                                <div className="form-group">
                                    <TextInput
                                        id="companyInternalReference"
                                        field="companyInternalReference"
                                        value={!formState.companyInternalReference.value ? "" : formState.companyInternalReference.value}
                                        onChange={hasFormValueChanged}
                                        required={true}
                                        maxLength={100}
                                        label="Internal reference"
                                        placeholder=""
                                        onblur={update}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="create-devider"></div>
            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-main">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                        <h4>Advertisement</h4>
                        <p>Applicants will see this advert title</p>
                        <p>You can also specify 4 custom questions applicants will have to answer</p>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                        <div className="create-rigth-back">
                            <form className="user" >
                                <div className="form-group">
                                    <TextInput
                                        id="advertTitle"
                                        field="advertTitle"
                                        value={!formState.advertTitle.value ? "" : formState.advertTitle.value}
                                        onChange={hasFormValueChanged}
                                        required={true}
                                        maxLength={100}
                                        label="Advert title*"
                                        placeholder=""
                                        onblur={update}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextInput
                                        id="campaignQuestion1"
                                        field="campaignQuestion1"
                                        value={!formState.campaignQuestion1.value ? "" : formState.campaignQuestion1.value}
                                        onChange={hasFormValueChanged}
                                        required={false}
                                        maxLength={100}
                                        label="Question 1"
                                        placeholder=""
                                        onblur={update}
                                    />
                                </div>
                                {formState.campaignQuestion1.value && <div className="form-group">
                                    <TextInput
                                        id="campaignQuestion2"
                                        field="campaignQuestion2"
                                        value={!formState.campaignQuestion2.value ? "" : formState.campaignQuestion2.value}
                                        onChange={hasFormValueChanged}
                                        required={false}
                                        maxLength={100}
                                        label="Question 2"
                                        placeholder=""
                                        onblur={update}
                                    />
                                </div>}
                                {formState.campaignQuestion2.value &&
                                    <div className="form-group">
                                        <TextInput
                                            id="campaignQuestion3"
                                            field="campaignQuestion3"
                                            value={!formState.campaignQuestion3.value ? "" : formState.campaignQuestion3.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            label="Question 3"
                                            placeholder=""
                                            onblur={update}
                                        />
                                    </div>}
                                {formState.campaignQuestion3.value &&
                                    <div className="form-group">
                                        <TextInput
                                            id="campaignQuestion4"
                                            field="campaignQuestion4"
                                            value={!formState.campaignQuestion4.value ? "" : formState.campaignQuestion4.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            label="Question 4"
                                            placeholder=""
                                            onblur={update}
                                        />
                                    </div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="create-devider"></div>
            <div className="col-lg-9 col-md-12   col-sm-12 create-campaign-main">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                        <h4>Spend</h4>
                        <p>The maximum budget for this campaign</p>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                        <div className="create-rigth-back">
                            <div className="row ">
                                <div className="col-lg-4 col-md-12 col-sm-12 align-self-center crate-mcm-text-main">
                                    <span>Maximum spend (£)*</span>
                                </div>
                                <div className="col-lg-8 col-md-12 col-sm-12 crate-mcm-values-main">
                                    {preSpendRatio && Object.values(preSpendRatio) && Object.values(preSpendRatio).map((ratio: any, i: any) => (
                                        <Button
                                            key={i}
                                            name="spendingCap"
                                            className={formState.spendingCap.value == ratio ? 'mcm-values-active' : 'mcm-values'}
                                            onClick={clickSpendingCap}
                                            type="button"
                                            value={ratio} >
                                            {ratio}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="create-devider"></div>
            <div className="col-lg-9 col-md-12   col-sm-12 create-campaign-main">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                        <h4>Psychometric method</h4>
                        <p>For most users we recommend selecting a Template from our more than 250 roles</p>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                        <div className="create-rigth-back">
                            <div className="mb-2">Select</div>
                            <div className="row ">
                                <div className=" rigt-togle-crate">
                                    <Form>
                                        <div className="rigt-togle-hd">
                                            <label>Expert mode</label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                onChange={handleExpertMode}
                                                checked={expertMode}
                                            />
                                        </div>
                                    </Form>
                                </div>
                                <div className="col-12 create-roles-selected-main">
                                    <Tabs
                                        id="uncontrolled-tab-example"
                                        activeKey={key}
                                        onSelect={(k: any) => handleTabs(k)}
                                    >
                                        <Tab eventKey="Role" title="Role" activeKey={campaignInfo.campaignType === 1}  >
                                            <div className="mt-4 role-cnt-top">
                                                <h6>Search for a role or select from dropdown:</h6>

                                                <Select
                                                    value={{
                                                        value: formState.roleId.value === campaignInfo.roleId ? formState.roleId.value : 0,
                                                        label: campaignInfo.roleId === formState.roleId.value ? roleSelected : ""
                                                    }}
                                                    options={roleSelect}
                                                    onChange={handleInputChange}
                                                /><br />
                                                <div className="preferences-main">
                                                    {formState.roleId.value !== 0 && formState.roleId.value !== "" && preferences && preferences.length >= 0 && preferences.map((pref: any, i: any) => (
                                                        <div>
                                                            <div onClick={() => handlePreference(pref)} key={i} className="role-cnt-main mb-2" id={pref.nameId}>
                                                                <div className='preferences-check'>
                                                                    <div className='row'>
                                                                        <div className='col-10'>
                                                                            <h5>
                                                                                {pref.roleName}
                                                                            </h5>
                                                                        </div>
                                                                        <div className='col-2 text-right' >
                                                                            <Form.Check type="checkbox" checked={pref.selected} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="btn-acc-role">
                                                                    <span className="mr-3">{pref.mbtiType}</span>
                                                                    <span className="">{pref.source}</span>
                                                                </div>
                                                                <p>{pref.mbtiDescr}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="acc-upolads-mains pt-4 mb-3"></div>
                                                {selectedMbtiType.show && (<p className="acc-btm-lne">MBTI analysis indicates that the role selected is best carried out by {selectedMbtiType.type} types.</p>)}
                                            </div>
                                        </Tab>
                                        <Tab eventKey="MBTI" title="MBTI" disabled={!expertMode} activeKey={campaignInfo.campaignType === 2}  >
                                            <div className="mt-4 role-cnt-top" >
                                                <h6>Select a custom MBTI type based upon Myers Briggs analysis. If you are not an expert, consider using a template instead.
                                                    {selectedExpertMbtiType.show && <span> Note that you have selected {selectedExpertMbtiType.type} in the Role tab</span>}.
                                                    </h6>
                                                <div className="create-devider mb-3 "></div>
                                                <div className="mbti-main-checks">
                                                    {mbtiLoader ? (
                                                        <Loader children={''} isLoading={mbtiLoader} type={"circle"} />
                                                    ) : (
                                                            <Form>
                                                                <div className="row">
                                                                    {mbti && mbti.length > 0 && mbti.map((mbt: any, i: any) => (
                                                                        <div key={i} className="col-lg-3 col-md-6 col-sm-12">

                                                                            <div className="checks-tooltip-main">
                                                                                <div className="toltip-custom">
                                                                                    {mbt.mbtiDescr}
                                                                                </div>
                                                                                <Form.Check
                                                                                    type="radio"
                                                                                    label={mbt.mbtiType}
                                                                                    name="formHorizontalRadios"
                                                                                    id={mbt.mbtiType}
                                                                                    checked={(mbt.mbtiType.toLowerCase() == mbtyType.toLowerCase() || mbt.selected == 1)}
                                                                                    onChange={(e) => handleChange(e)} />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {mbti && mbti.length > 0 && mbti.map((mbt: any, i: any) => (
                                                                    <div className="col-12">
                                                                        {
                                                                            mbt.mbtiType.toLowerCase() == mbtyType.toLowerCase() ?
                                                                                <div key={i} className="role-cnt-main" id={mbt.nameId}>

                                                                                    <div className="btn-acc-role">
                                                                                        <span className="mr-3">{mbt.mbtiType}</span>

                                                                                    </div>
                                                                                    <p>{mbt.mbtiDescr}</p>
                                                                                </div>
                                                                                : <div></div>
                                                                        }
                                                                    </div>
                                                                ))}
                                                            </Form>
                                                        )}
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="FFM" title="FFM" disabled={!expertMode} activeKey={campaignInfo.campaignType === 3} >
                                            <div className="mt-4 role-cnt-top">
                                                <div className="top-content">
                                                    <h6>Please select a value from each of the Five Factor Model (OCEAN/CANOE) scales below. The FFM is the authorative model used by psychologists. You can select a range of values for each of the 5 scales.</h6>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12  p-2 b-box-1">
                                                            <h3 className="ffm-heading">Extraversion</h3>
                                                            <div className="ffm-body">
                                                                <ul className="pl-0 mb-0 sub-heading">
                                                                    <li className="d-inline list-unstyled">Solitary</li>
                                                                    <li className="d-inline list-unstyled float-right">Energetic</li>
                                                                </ul>
                                                                <ul className="d-flex pl-0 justify-content-between">
                                                                    <li
                                                                        className={extraversion.includes(1) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('extraversion', 1)}>
                                                                    </li>
                                                                    <li
                                                                        className={extraversion.includes(2) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('extraversion', 2)}>
                                                                    </li>
                                                                    <li
                                                                        className={extraversion.includes(3) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('extraversion', 3)}>
                                                                    </li>
                                                                    <li
                                                                        className={extraversion.includes(4) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('extraversion', 4)}>
                                                                    </li>
                                                                    <li
                                                                        className={extraversion.includes(5) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('extraversion', 5)}>
                                                                    </li>
                                                                </ul>
                                                                <h6>An extraverted person is likely to enjoy time spent with people and find less reward in time spent alone.</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 b-box-2 p-2">
                                                            <h3 className="ffm-heading">Neuroticism</h3>
                                                            <div className="ffm-body">
                                                                <ul className="pl-0 mb-0 sub-heading">
                                                                    <li className="d-inline list-unstyled">Confident</li>
                                                                    <li className="d-inline list-unstyled float-right">Sensitive</li>
                                                                </ul>
                                                                <ul className="d-flex pl-0 justify-content-between">
                                                                    <li
                                                                        className={neuroticism.includes(1) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('neuroticism', 1)}>
                                                                    </li>
                                                                    <li
                                                                        className={neuroticism.includes(2) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('neuroticism', 2)}>
                                                                    </li>
                                                                    <li
                                                                        className={neuroticism.includes(3) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('neuroticism', 3)}>
                                                                    </li>
                                                                    <li
                                                                        className={neuroticism.includes(4) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('neuroticism', 4)}>
                                                                    </li>
                                                                    <li
                                                                        className={neuroticism.includes(5) ? 'green-pills' : "gray-pills"}
                                                                        onClick={() => setValue('neuroticism', 5)}>
                                                                    </li>
                                                                </ul>
                                                                <h6>People with low levels of neuroticism find it easier to remain calm and are less affected by stressful events.</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 b-box-3 p-2 ">
                                                            <h3 className="ffm-heading">Agreeableness</h3>
                                                            <div className="ffm-body">
                                                                <ul className="pl-0 mb-0 sub-heading">
                                                                    <li className="d-inline list-unstyled">Detached</li>
                                                                    <li className="d-inline list-unstyled float-right">Compassionate</li>
                                                                </ul>
                                                                <ul className="d-flex pl-0 justify-content-between">
                                                                    <li
                                                                        className={agreeableness.includes(1) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('agreeableness', 1)}>
                                                                    </li>
                                                                    <li
                                                                        className={agreeableness.includes(2) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('agreeableness', 2)}>
                                                                    </li>
                                                                    <li
                                                                        className={agreeableness.includes(3) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('agreeableness', 3)}>
                                                                    </li>
                                                                    <li
                                                                        className={agreeableness.includes(4) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('agreeableness', 4)}>
                                                                    </li>
                                                                    <li
                                                                        className={agreeableness.includes(5) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('agreeableness', 5)}>
                                                                    </li>
                                                                </ul>
                                                                <h6>People high in agreeableness are more trusting, affectionate, altruistic, as well as other general prosocial behaviors</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 b-box-4 p-2">
                                                            <h3 className="ffm-heading">Openness to Experience</h3>
                                                            <div className="ffm-body">
                                                                <ul className="pl-0 mb-0 sub-heading">
                                                                    <li className="d-inline list-unstyled">Consistent</li>
                                                                    <li className="d-inline list-unstyled float-right">Inventive</li>
                                                                </ul>
                                                                <ul className="d-flex pl-0 justify-content-between">
                                                                    <li
                                                                        className={opennesstoExperience.includes(1) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('opennesstoExperience', 1)}>
                                                                    </li>
                                                                    <li
                                                                        className={opennesstoExperience.includes(2) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('opennesstoExperience', 2)}>
                                                                    </li>
                                                                    <li
                                                                        className={opennesstoExperience.includes(3) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('opennesstoExperience', 3)}>
                                                                    </li>
                                                                    <li
                                                                        className={opennesstoExperience.includes(4) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('opennesstoExperience', 4)}>
                                                                    </li>
                                                                    <li
                                                                        className={opennesstoExperience.includes(5) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('opennesstoExperience', 5)}>
                                                                    </li>
                                                                </ul>
                                                                <h6>Openness to experience correlates with creativity, as measured by tests of divergent thinking</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12 b-box-5 p-2">
                                                            <h3 className="ffm-heading">Conscienciousness</h3>
                                                            <div className="ffm-body">
                                                                <ul className="pl-0 mb-0 sub-heading">
                                                                    <li className="d-inline list-unstyled">Easy-Going</li>
                                                                    <li className="d-inline list-unstyled float-right">Organised</li>
                                                                </ul>
                                                                <ul className="d-flex pl-0 justify-content-between">
                                                                    <li
                                                                        className={conscienciousness.includes(1) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('conscienciousness', 1)}>
                                                                    </li>
                                                                    <li
                                                                        className={conscienciousness.includes(2) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('conscienciousness', 2)}>
                                                                    </li>
                                                                    <li
                                                                        className={conscienciousness.includes(3) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('conscienciousness', 3)}>
                                                                    </li>
                                                                    <li
                                                                        className={conscienciousness.includes(4) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('conscienciousness', 4)}>
                                                                    </li>
                                                                    <li
                                                                        className={conscienciousness.includes(5) ? "green-pills" : "gray-pills"}
                                                                        onClick={() => setValue('conscienciousness', 5)}>
                                                                    </li>
                                                                </ul>
                                                                <h6>Responsible, organized, and hard-working; to be goal-directed; and to adhere to norms and rules.</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="float-right mt-2 btn btn-outline-secondary mr-3" onClick={() => saveFfmRange()}>Save</button>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="create-devider"></div>
            <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-main">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 create-campaign-left">
                        <p>You may delete this draft until you start the campaign.</p>
                        <p>Already running campaigns can only be closed to deactivate.</p>
                        <p>Running the campaign will generate a shareable link for your applicants.</p>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 create-campaign-right">
                        <div className="create-back">
                            <div className="spr-mains-tb">
                                <>
                                    {campaignInfo.published == 0 ? (
                                        <button
                                            className="btn run-btn-cpn mr-3"
                                            onClick={activeCampaign}
                                            disabled={
                                                !campaignInfo.campaignName ||
                                                !campaignInfo.advertTitle ||
                                                !campaignInfo.spendingCap ||
                                                !campaignInfo.roleId
                                            }
                                        >
                                            Run campaign
                                        </button>
                                    ) : (
                                            <button className="btn btn-outline-secondary mr-3" onClick={() => handleShowCampaignModal()}>Close campaign</button>
                                        )}
                                </>
                                {campaignInfo.published == 0 && <button className="btn del-btn-cpn" onClick={deleteDraft}>Delete draft</button>}
                                <div className="row mt-3">
                                    <div className="col-lg-6 col-md-12 col-sm-12 crt-advrt-left">
                                        <p>Advert title</p>
                                        <h5>{formState.advertTitle.value}</h5>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12 crt-intrer-right">
                                        <p>Internal reference</p>
                                        <h5>{formState.companyInternalReference.value || '-'}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 crt-advrt-btm-main">
                                <div className="row ">
                                    <div className="col-lg-4 col-md-4 col-sm-12 crt-advrt-left campain-firstdata-prfle">
                                        <p>Profile</p>
                                        {selectedRole.label && !expertMode && key == "Role" && <h6>{selectedRole.label}</h6>}
                                        {mbtyType && expertMode && key == "MBTI" && <h6>MBTI - {mbtyType}</h6>}
                                        {key == "FFM" && expertMode && <h6>FFM</h6>}
                                    </div>
                                    <div className="col-lg-8 col-md-8 col-sm-12 crt-advrt-left pdg-20">
                                        <p>Spent/Maximum</p>
                                        <h5>£{formState.spendingCap.value} </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="height-40"></div>
        </>
    );
};
export default CSCreateCampaign;