import React, { Dispatch, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { PDFObject } from 'react-pdfobject'
import { Modal } from 'react-bootstrap';
import Loader from '../../common/components/loader';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IStateType } from "../../store/models/root.interface";
import { selectCandidate, hideCandidate } from '../../store/actions/products.action';
import { getCampaignResult, fetchCampaignDetails, setCampaignInProcessID } from "../../store/actions/campaign.actions";

const CampaignApplications: React.FC = () => {
    interface IUser {
        name: string;
        percentageFit: any;
        covLettFileName: any;
        cvFileName: any;
        phoneNumber: any;
        email: any;
        campaignQuestion1: any;
        campaignQuestion2: any;
        campaignQuestion3: any;
        campaignQuestion4: any;
        campaignQ1Answer: any;
        campaignQ2Answer: any;
        campaignQ3Answer: any;
        campaignQ4Answer: any;
        psyReportFileName: any;
        applicatioID: any;
        personalSummary: any;
        candidate: boolean;
        display: boolean;
    }
    const history = useHistory();
    const dispatch: Dispatch<any> = useDispatch();
    const campaignResult: any = useSelector((state: IStateType) => state.campaign.campaignResult.result);
    const selectedCampaignDetails: any = useSelector((state: IStateType) => state.campaign.selectedCampaignDetails);
    const totalCampaignResult: any = useSelector((state: IStateType) => state.campaign.campaignResult.totalRecord);
    const campaignApplicationLoader: any = useSelector((state: IStateType) => state.products.campaignApplicationLoader);

    const [selected, setSelected] = useState<IUser>({
        name: '',
        percentageFit: '',
        covLettFileName: '',
        cvFileName: '',
        phoneNumber: '',
        email: '',
        campaignQuestion1: '',
        campaignQuestion2: '',
        campaignQuestion3: '',
        campaignQuestion4: '',
        campaignQ1Answer: '',
        campaignQ2Answer: '',
        campaignQ3Answer: '',
        campaignQ4Answer: '',
        psyReportFileName: '',
        applicatioID: '',
        personalSummary: '',
        candidate: false,
        display: false
    });
    const [showDocModal, setDocShow] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedFile, setSelectedShow] = useState('');
    const [selectedFileType, setSelectedFileType] = useState('');
    const [key, setKey] = useState('Active');
    const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6, "active": 1, "id": 0 });
    const totalRecord = totalCampaignResult && (Number(totalCampaignResult) / Number(pageInfo.PageSize));
    let [pageNum, setPageNum] = useState(1)
    let [pageData, setPageData] = useState(pageInfo.PageSize)

    const handleDocClose = () => {
        setDocShow(false);
    }
    const handleDocShow = (file: any, type: any) => {
        setDocShow(true);
        setSelectedShow(file);
        setSelectedFileType(type)
    };

    const prevPage = () => {
        setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber - 1 });
        const data = {
            PageNumber: pageInfo.PageNumber - 1,
            PageSize: pageInfo.PageSize,
            active: pageInfo.active,
            id: selectedCampaignDetails.campaignID
        }
        setPageData(pageNum - 1)
        setPageNum(pageNum - pageInfo.PageSize)
        dispatch(getCampaignResult(data));
    }

    const nextPage = () => {
        setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber + 1 });
        const data = {
            PageNumber: pageInfo.PageNumber + 1,
            PageSize: pageInfo.PageSize,
            active: pageInfo.active,
            //id: pageInfo.id
            id: selectedCampaignDetails.campaignID
        }
        setPageNum(pageNum + pageInfo.PageSize)
        setPageData(((pageData + pageInfo.PageSize) > Number(totalCampaignResult)) ? Number(totalCampaignResult) : (pageData + pageInfo.PageSize));
        dispatch(getCampaignResult(data));
    }

    dispatch(updateCurrentPath("CampaignApplications", ""));

    const goBack = () => {
        history.goBack();
    }

    const getDot = (campaign: any) => {
        if (campaign.percentageFit &&
            campaign.percentageFit * 100 > 65) {
            return "green-dot";
        } else if (campaign.percentageFit &&
            campaign.percentageFit * 100 > 40) {
            return "yellow-dot";
        } else if (campaign.percentageFit &&
            campaign.percentageFit * 100 < 40) {
            return "red-dot";
        }
    }

    const getDataDot = (campaign: any) => {
        if (campaign.percentageFit &&
            campaign.percentageFit * 100 > 65) {
            return "green-dot";
        } else if (campaign.percentageFit &&
            campaign.percentageFit * 100 > 40) {
            return "yellow-dot-data";
        } else if (campaign.percentageFit &&
            campaign.percentageFit * 100 < 40) {
            return "red-dot";
        }
    }

    useEffect(() => {
        if (campaignResult && campaignResult.length > 0) {
            setSelected(campaignResult[0]);
        }
    }, [dispatch])

    const openDetails = (campaign: any) => {
        setShowResult(true);
        setSelected(campaign);
    }

    const handleTabs = (e: any) => {
        setKey(e);
        setPageNum(1);
        setPageData(pageInfo.PageSize);
        setShowResult(false);
        if (e == 'Active') {
            setPageInfo({
                PageNumber: 1,
                PageSize: 6,
                active: 1,
                id: 0
            })
            dispatch(getCampaignResult({
                PageNumber: 1,
                PageSize: 6,
                active: 1,
                id: selectedCampaignDetails.campaignID
            }));
        }
        else if (e == 'candidates') {
            setPageInfo({
                PageNumber: 1,
                PageSize: 6,
                active: 3,
                id: 0
            })
            pageInfo.id = selectedCampaignDetails.campaignID;
            dispatch(getCampaignResult({
                PageNumber: 1,
                PageSize: 6,
                active: 3,
                id: selectedCampaignDetails.campaignID,
            }));
        } else if (e == 'hidden') {
            setPageInfo({
                PageNumber: 1,
                PageSize: 6,
                active: 4,
                id: 0,
            })
            dispatch(getCampaignResult({
                PageNumber: 1,
                PageSize: 6,
                active: 4,
                id: selectedCampaignDetails.campaignID
            }));
        } else if (e == 'all') {
            setPageInfo({
                PageNumber: 1,
                PageSize: 6,
                active: 2,
                id: 0,
            })
            dispatch(getCampaignResult({
                PageNumber: 1,
                PageSize: 6,
                active: 2,
                id: selectedCampaignDetails.campaignID,
            }));
        }
    }

    const setActiveCandidate = (campaign: any, key?: any) => {
        const check = campaign.candidate ? 0 : 1;
        let data = {
            id: campaign.applicatioID,
            active: check,
        }
        campaign.candidate = check;
        setSelected(campaign);
        dispatch(selectCandidate(data, selectedCampaignDetails.campaignID, key));
    }

    const setHiddenCandidate = (campaign: any, key?: any) => {
        const check = campaign.display ? 0 : 1;
        let data = {
            id: campaign.applicatioID,
            active: check,
        }
        campaign.display = check;
        setSelected(campaign);
        dispatch(hideCandidate(data, selectedCampaignDetails.campaignID, key));
    }
    const editCampaign = (id: any) => {
        dispatch(fetchCampaignDetails(id))
        dispatch(setCampaignInProcessID(id));
        window.sessionStorage.setItem("selectedCampaign", id);

        setTimeout(() => {
            history.push(`/CreateCampaign/${id}`);
        }, 1000);
    }

    if (campaignApplicationLoader) {
        return (
            <Loader children={''} isLoading={campaignApplicationLoader} type={"circle"} />
        );
    }
    return (
        <>
            <div className="back-button" onClick={goBack} style={{ cursor: 'pointer' }}><i className="fas fa-chevron-left"></i> Campaigns</div>
            <div className="row">
                <div className="col-6">
                    <h1 className="campaign-hdg accunt-hdg mb-2 mr-2">{selectedCampaignDetails.campaignName}</h1>
                </div>
                <div className="col-6">
                    <button className="btn link-btn-cmpan account-hed-btn">
                        <div className="setting-icon" onClick={() => editCampaign(selectedCampaignDetails.campaignID)}></div>
                    </button>
                </div>
            </div>
            <div className="create-campaign-modal-main">
                <Modal className="create-campaign-modal-main modal-90w" show={showDocModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleDocClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedFileType}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PDFObject url={selectedFile} />
                    </Modal.Body>
                </Modal>
            </div>
            <div className="campaign-tabs-main">
                <Tabs activeKey={key} id="uncontrolled-tab-example" onSelect={(k: any) => handleTabs(k)}>
                    <Tab eventKey="Active" title="Active">
                        <div className="col-xl-12 col-lg-12">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                                        <div className="table-responsive rounded">
                                            <table className="table">
                                                <thead className="thead-pink">
                                                    <tr>
                                                        <th scope="col">Match</th>
                                                        <th scope="col">Applicant name</th>
                                                        <th scope="col">Application date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {campaignResult && campaignResult.length > 0 && campaignResult.map((campaign: any, i: any) => (
                                                        <tr key={i} className={selected && selected.applicatioID === campaign.applicatioID ? 'selected-campaign-active campaigns-table' : 'selected-campaign campaigns-table'} onClick={() => openDetails(campaign)}>
                                                            <th className="acct-match-data" scope="row"><div className={getDot(campaign)}></div> {(campaign.percentageFit * 100).toFixed(2)}%</th>
                                                            <td className="acct-appction-data">
                                                                {campaign.percentageFit &&
                                                                    campaign.percentageFit * 100 > 65 && (<div className="green-bookmark"></div>)}
                                                                <span>{campaign.name}</span>
                                                            </td>
                                                            <td className="acct-date-data">{moment(campaign.dateCreated).format("DD MMM YY")}
                                                                <i className="fa fa-caret-right" aria-hidden="true"></i></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {Number(totalCampaignResult) > 0 && totalRecord > 1 && (
                                        <div>
                                            <span className="mr-2 a-left">
                                                {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                                            </span>
                                            {/* <span className="d-inline-block pagiNation">{pageInfo.PageNumber}-{pageInfo.PageSize} of {round(totalRecord)}</span> */}

                                            <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignResult)}</span>
                                            <span className="a-left ml-2">
                                                {
                                                    //pageInfo.PageNumber != round(totalRecord) 
                                                    pageData < Number(totalCampaignResult) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                            </span>
                                        </div>
                                    )}

                                </div>
                                {showResult && selected && campaignResult && campaignResult.length > 0 && (
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="col-xl-12 col-lg-12 product-main account-right-main mb-4 pl-0 pr-0 mt-5">
                                            <div className="green-background ">
                                                <div className="row ">
                                                    <div className="col-6 acc-rgt-left">
                                                        <h6 className="mr-2 mb-0 font-weight-bold">{selected.name}</h6>
                                                        <div className={getDataDot(selected)}></div>
                                                        <span className="font-weight-bold">{(selected.percentageFit * 100).toFixed(2)}%</span>
                                                    </div>
                                                    <div className="col-6 acc-rgt-right">
                                                        <button className="btn" onClick={() => setActiveCandidate(selected, 1)}>
                                                            {selected.candidate ? (
                                                                <i className="fa fa-bookmark active" ></i>
                                                            ) : (
                                                                    <i className="far fa-bookmark deactivate"></i>
                                                                )}
                                                        </button>
                                                        <button className="btn" onClick={() => setHiddenCandidate(selected, 1)}>
                                                            {!selected.display ? (
                                                                <i className="fas fa-eye-slash active"></i>
                                                            ) : (
                                                                    <i className="far fa-eye-slash deactivate"></i>
                                                                )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="acc-rgt-frst ">
                                                <div className="row acc-upolads-mains pb-2">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-mani">
                                                        <div className="upload-btn-wrapper-new">
                                                            {selected.cvFileName && selected.cvFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.cvFileName, 'CV')} className="btn">
                                                                    <div className="upload-icon"></div> CV
                                                                </button>
                                                            )}
                                                            {selected.covLettFileName && selected.covLettFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.covLettFileName, 'Cover letter')} className="btn"><div className="upload-icon"></div>
                                                                    Cover letter
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-textrgt">
                                                        <p>{selected.email}</p>
                                                        <p>{selected.phoneNumber}</p>
                                                    </div>
                                                </div>
                                                <div className=" question-answer-main pt-3">
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion1}</p>
                                                        <h6>{selected.campaignQ1Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion2}</p>
                                                        <h6>{selected.campaignQ2Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion3}</p>
                                                        <h6>{selected.campaignQ3Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion4}</p>
                                                        <h6>{selected.campaignQ4Answer}</h6>

                                                    </div>
                                                </div>
                                            </div>
                                            {selected.personalSummary && (<div className="personal-main">
                                                <div className="col-12 persnl-hdg-acc thead-pink">
                                                    <h5>PERSONAL SUMMARY</h5>
                                                </div>
                                                <div className="col-lg-12 persnl-cnt-acc ">
                                                    <p>{selected.personalSummary}</p>
                                                </div>
                                            </div>)}
                                            {selected.psyReportFileName && (<div className="col-12 pb-2 rprt-btn-main">
                                                <button
                                                    onClick={() => handleDocShow(selected.psyReportFileName, 'Psychometric report')}
                                                    className="btn report-btn"><div className="report-icon"></div>
                                                    Psychometric report
                                                    </button>
                                            </div>)}
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="candidates" title="Candidates">
                        <div className="col-xl-12 col-lg-12">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                                        <div className="table-responsive rounded">
                                            <table className="table">
                                                <thead className="thead-pink">
                                                    <tr>
                                                        <th scope="col">Match</th>
                                                        <th scope="col">Applicant name</th>
                                                        <th scope="col">Application date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {campaignResult && campaignResult.length > 0 && campaignResult.map((campaign: any, i: any) => (
                                                        <tr className={selected && selected.applicatioID == campaign.applicatioID ? 'selected-campaign-active campaigns-table' : 'selected-campaign campaigns-table'} key={i} onClick={() => openDetails(campaign)}>
                                                            <th className="acct-match-data" scope="row"><div className={getDot(campaign)}></div> {(campaign.percentageFit * 100).toFixed(2)}%</th>
                                                            <td className="acct-appction-data">
                                                                {campaign.percentageFit &&
                                                                    campaign.percentageFit * 100 > 65 && (<div className="green-bookmark"></div>)}
                                                                <span>{campaign.name}</span>
                                                            </td>
                                                            <td className="acct-date-data">{moment(campaign.dateCreated).format("DD MMM YY")}
                                                                <i className="fa fa-caret-right" aria-hidden="true"></i></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {Number(totalCampaignResult) > 0 && totalRecord > 1 && (
                                        <div>
                                            <span className="mr-2 a-left">
                                                {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                                            </span>
                                            <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignResult)}</span>
                                            <span className="a-left ml-2">
                                                {
                                                    pageData < Number(totalCampaignResult) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {showResult && selected && campaignResult && campaignResult.length > 0 && (
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="col-xl-12 col-lg-12 product-main account-right-main mb-4 pl-0 pr-0 mt-5">
                                            <div className="green-background ">
                                                <div className="row ">
                                                    <div className="col-6 acc-rgt-left">
                                                        <h6 className="mr-2 mb-0 font-weight-bold">{selected.name}</h6>
                                                        <div className={getDataDot(selected)}></div>
                                                        <span className="font-weight-bold">{(selected.percentageFit * 100).toFixed(2)}%</span>
                                                    </div>
                                                    <div className="col-6 acc-rgt-right">
                                                        <button className="btn" onClick={() => setActiveCandidate(selected, 3)}>
                                                            {selected.candidate ? (
                                                                <i className="fa fa-bookmark active" ></i>
                                                            ) : (
                                                                    <i className="far fa-bookmark deactivate"></i>
                                                                )}
                                                        </button>
                                                        <button className="btn" onClick={() => setHiddenCandidate(selected, 3)}>
                                                            {!selected.display ? (
                                                                <i className="fas fa-eye-slash active"></i>
                                                            ) : (
                                                                    <i className="far fa-eye-slash deactivate"></i>
                                                                )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="acc-rgt-frst ">
                                                <div className="row acc-upolads-mains pb-2">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-mani">
                                                        <div className="upload-btn-wrapper-new">
                                                            {selected.cvFileName && selected.cvFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.cvFileName, 'CV')} className="btn">
                                                                    <div className="upload-icon"></div> CV
                                                                </button>
                                                            )}
                                                            {selected.covLettFileName && selected.covLettFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.covLettFileName, 'Cover letter')} className="btn"><div className="upload-icon"></div> Cover letter</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-textrgt">
                                                        <p>{selected.email}</p>
                                                        <p>{selected.phoneNumber}</p>
                                                    </div>
                                                </div>
                                                <div className=" question-answer-main pt-3">
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion1}</p>
                                                        <h6>{selected.campaignQ1Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion2}</p>
                                                        <h6>{selected.campaignQ2Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion3}</p>
                                                        <h6>{selected.campaignQ3Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion4}</p>
                                                        <h6>{selected.campaignQ4Answer}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            {selected.personalSummary && (<div className="personal-main">
                                                <div className="col-12 persnl-hdg-acc thead-pink">
                                                    <h5>PERSONAL SUMMARY</h5>
                                                </div>
                                                <div className="col-lg-12 persnl-cnt-acc ">
                                                    <p>{selected.personalSummary}</p>
                                                </div>
                                            </div>)}
                                            <div className="col-12 pb-2 rprt-btn-main">
                                                <button onClick={() => handleDocShow(selected.psyReportFileName, 'Psychometric report')} className="btn report-btn"><div className="report-icon"></div>
                                                    Psychometric report
                                                    </button>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="hidden" title="Hidden">
                        <div className="col-xl-12 col-lg-12">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                                        <div className="table-responsive rounded">
                                            <table className="table">
                                                <thead className="thead-pink">
                                                    <tr>
                                                        <th scope="col">Match</th>
                                                        <th scope="col">Applicant name</th>
                                                        <th scope="col">Application date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {campaignResult && campaignResult.length > 0 && campaignResult.map((campaign: any, i: any) => (
                                                        <tr key={i} className={selected && selected.applicatioID == campaign.applicatioID ? 'selected-campaign-active campaigns-table' : 'selected-campaign campaigns-table'} onClick={() => openDetails(campaign)}>
                                                            <th className="acct-match-data" scope="row"><div className={getDot(campaign)}></div> {(campaign.percentageFit * 100).toFixed(2)}%</th>
                                                            <td className="acct-appction-data">
                                                                {campaign.percentageFit &&
                                                                    campaign.percentageFit * 100 > 65 && (<div className="green-bookmark"></div>)}
                                                                <span>{campaign.name}</span>
                                                            </td>
                                                            <td className="acct-date-data">{moment(campaign.dateCreated).format("DD MMM YY")}
                                                                <i className="fa fa-caret-right" aria-hidden="true"></i></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {Number(totalCampaignResult) > 0 && totalRecord > 1 && (
                                        <div>
                                            <span className="mr-2 a-left">
                                                {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                                            </span>
                                            {/* <span className="d-inline-block pagiNation">{pageInfo.PageNumber}-{pageInfo.PageSize} of {round(totalRecord)}</span> */}
                                            <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignResult)}</span>
                                            <span className="a-left ml-2">
                                                {
                                                    //pageInfo.PageNumber != round(totalRecord)
                                                    pageData < Number(totalCampaignResult) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {showResult && selected && campaignResult && campaignResult.length > 0 && (
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="col-xl-12 col-lg-12 product-main account-right-main mb-4 pl-0 pr-0 mt-5">
                                            <div className="green-background ">
                                                <div className="row ">
                                                    <div className="col-6 acc-rgt-left">
                                                        <h6 className="mr-2 mb-0 font-weight-bold">{selected.name}</h6>
                                                        <div className={getDataDot(selected)}></div>
                                                        <span className="font-weight-bold">{(selected.percentageFit * 100).toFixed(2)}%</span>
                                                    </div>
                                                    <div className="col-6 acc-rgt-right">
                                                        <button className="btn" onClick={() => setActiveCandidate(selected, 4)}>
                                                            {selected.candidate ? (
                                                                <i className="fa fa-bookmark active" ></i>
                                                            ) : (
                                                                    <i className="far fa-bookmark deactivate"></i>
                                                                )}
                                                        </button>
                                                        <button className="btn" onClick={() => setHiddenCandidate(selected, 4)}>
                                                            {!selected.display ? (
                                                                <i className="fas fa-eye-slash active"></i>
                                                            ) : (
                                                                    <i className="far fa-eye-slash deactivate"></i>
                                                                )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="acc-rgt-frst ">
                                                <div className="row acc-upolads-mains pb-2">
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-mani">
                                                        <div className="upload-btn-wrapper-new">
                                                            {selected.cvFileName && selected.cvFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.cvFileName, 'CV')} className="btn">
                                                                    <div className="upload-icon"></div> CV
                                                                </button>
                                                            )}
                                                            {selected.covLettFileName && selected.covLettFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.covLettFileName, 'Cover letter')} className="btn"><div className="upload-icon"></div> Cover letter</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-textrgt">
                                                        <p>{selected.email}</p>
                                                        <p>{selected.phoneNumber}</p>
                                                    </div>
                                                </div>
                                                <div className=" question-answer-main pt-3">
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion1}</p>
                                                        <h6>{selected.campaignQ1Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion2}</p>
                                                        <h6>{selected.campaignQ2Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion3}</p>
                                                        <h6>{selected.campaignQ3Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion4}</p>
                                                        <h6>{selected.campaignQ4Answer}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            {selected.personalSummary && (<div className="personal-main">
                                                <div className="col-12 persnl-hdg-acc thead-pink">
                                                    <h5>PERSONAL SUMMARY</h5>
                                                </div>
                                                <div className="col-lg-12 persnl-cnt-acc ">
                                                    <p>{selected.personalSummary}</p>
                                                </div>
                                            </div>)}
                                            <div className="col-12 pb-2 rprt-btn-main">
                                                <button onClick={() => handleDocShow(selected.psyReportFileName, 'Psychometric report')} className="btn report-btn"><div className="report-icon"></div>
                                                    Psychometric report
                                                    </button>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="all" title="All" >
                        <div className="col-xl-12 col-lg-12">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                                        <div className="table-responsive rounded">
                                            <table className="table">
                                                <thead className="thead-pink">
                                                    <tr>
                                                        <th scope="col">Match</th>
                                                        <th scope="col">Applicant name</th>
                                                        <th scope="col">Application date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {campaignResult && campaignResult.length > 0 && campaignResult.map((campaign: any, i: any) => (
                                                        <tr key={i} className={selected && selected.applicatioID == campaign.applicatioID ? 'selected-campaign-active campaigns-table' : 'campaigns-table selected-campaign'} onClick={() => openDetails(campaign)}>
                                                            <th className="acct-match-data" scope="row"><div className={getDot(campaign)}></div> {(campaign.percentageFit * 100).toFixed(2)}%</th>
                                                            <td className="acct-appction-data">
                                                                {campaign.percentageFit && campaign.percentageFit != 0 &&
                                                                    campaign.percentageFit * 100 > 65 ? (
                                                                        <div className="green-bookmark"></div>
                                                                    ) : (
                                                                        <div ></div>
                                                                    )}
                                                                <span>{campaign.name}</span>
                                                            </td>
                                                            <td className="acct-date-data">{moment(campaign.dateCreated).format("DD MMM YY")}
                                                                <i className="fa fa-caret-right" aria-hidden="true"></i></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {Number(totalCampaignResult) > 0 && totalRecord > 1 && (
                                        <div>
                                            <span className="mr-2 a-left">
                                                {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                                            </span>
                                            {/* <span className="d-inline-block pagiNation">{pageInfo.PageNumber}-{pageInfo.PageSize} of {round(totalRecord)}</span> */}
                                            <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignResult)}</span>
                                            <span className="a-left ml-2">
                                                {
                                                    //pageInfo.PageNumber != round(totalRecord) 
                                                    pageData < Number(totalCampaignResult) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {showResult && selected && campaignResult && campaignResult.length > 0 && (
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                        <div className="col-xl-12 col-lg-12 product-main account-right-main mb-4 pl-0 pr-0 mt-5">
                                            <div className="green-background ">
                                                <div className="row ">
                                                    <div className="col-6 acc-rgt-left">
                                                        <h6 className="mr-2 mb-0 font-weight-bold">{selected.name}</h6>
                                                        <div className={getDataDot(selected)}></div>
                                                        <span className="font-weight-bold">{selected.percentageFit * 100}%</span>
                                                    </div>
                                                    <div className="col-6 acc-rgt-right">
                                                        <button className="btn" onClick={() => setActiveCandidate(selected, 2)}>
                                                            {selected.candidate ? (
                                                                <i className="fa fa-bookmark active" ></i>
                                                            ) : (
                                                                    <i className="far fa-bookmark deactivate"></i>
                                                                )}
                                                        </button>
                                                        <button className="btn" onClick={() => setHiddenCandidate(selected, 2)}>
                                                            {!selected.display ? (
                                                                <i className="fas fa-eye-slash active"></i>
                                                            ) : (
                                                                    <i className="far fa-eye-slash deactivate"></i>
                                                                )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="acc-rgt-frst ">
                                                <div className="row acc-upolads-mains pb-2">

                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-mani">
                                                        <div className="upload-btn-wrapper-new">
                                                            {selected.cvFileName && selected.cvFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.cvFileName, 'CV')} className="btn">
                                                                    <div className="upload-icon"></div> CV
                                                                </button>
                                                            )}
                                                            {selected.covLettFileName && selected.covLettFileName != null && (
                                                                <button onClick={() => handleDocShow(selected.covLettFileName, 'Cover letter')} className="btn"><div className="upload-icon"></div> Cover letter</button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-12 acc-upolads-textrgt">
                                                        <p>{selected.email}</p>
                                                        <p>{selected.phoneNumber}</p>
                                                    </div>
                                                </div>
                                                <div className=" question-answer-main pt-3">
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion1}</p>
                                                        <h6>{selected.campaignQ1Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion2}</p>
                                                        <h6>{selected.campaignQ2Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion3}</p>
                                                        <h6>{selected.campaignQ3Answer}</h6>
                                                    </div>
                                                    <div className="qstn-anwr-lists">
                                                        <p>{selected.campaignQuestion4}</p>
                                                        <h6>{selected.campaignQ4Answer}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            {selected.personalSummary && (<div className="personal-main">
                                                <div className="col-12 persnl-hdg-acc thead-pink">
                                                    <h5>PERSONAL SUMMARY</h5>
                                                </div>
                                                <div className="col-lg-12 persnl-cnt-acc ">
                                                    <p>{selected.personalSummary}</p>
                                                </div>
                                            </div>)}
                                            {selected.psyReportFileName && (<div className="col-12 pb-2 rprt-btn-main">
                                                <button onClick={() => handleDocShow(selected.psyReportFileName, 'Psychometric report')} className="btn report-btn"><div className="report-icon"></div>
                                                    Psychometric report
                                                    </button>
                                            </div>)}
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div >
        </>
    );
};
export default CampaignApplications;