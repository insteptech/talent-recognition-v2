import React, { Dispatch, useState, useEffect, useRef } from "react";
import { Modal, Button,Tabs, Tab } from "react-bootstrap";
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IProductState, IStateType, IRootPageStateType } from "../../store/models/root.interface";
import {
  clearSelectedProduct,
  setModificationState,
  changeSelectedProduct,
  fetchCampaigns,
  closeCampaign
} from "../../store/actions/products.action";
import { ProductModificationStatus, IProduct } from "../../store/models/product.interface";
import Loader from '../../common/components/loader';
import { API_CONFIG } from '../../config';
import ProductList2 from "./ProductsList2";
import "./Products.css";
import { setCampaignData, createCampaign, getCampaignResult, setSelectedCampaignDetail, fetchCampaignDetails, deleteDraftCampaign, setCampaignInProcessID, setCampaignPreferences } from '../../store/actions/campaign.actions';

const Products: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const location = useLocation()
  const history = useHistory();
  const deptsAccess: IProductState = useSelector((state: IStateType) => state.account.deptsAccess);
  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const allCampaigns: IProductState = useSelector((state: IStateType) => state.products.campaigns.result);
  const totalCampaignsRecord: IProductState = useSelector((state: any) => state.products.campaigns.totalRecord);
  const loader: any = useSelector((state: IStateType) => state.products.isLoader);

  const [campaignInfo, setCampaignInfo] = useState({
    "campaignName": '',
    'active': 1,
    "campaignType": 1
  });
  const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6, "active": 1 });
  const totalRecord = totalCampaignsRecord && (Number(totalCampaignsRecord) / Number(pageInfo.PageSize));
  const [showModal, setShow] = useState(false);
  const [key, setKey] = useState('Active');
  const [showCloseModal, setCloseShow] = useState(false);
  const [closeDate, setCloseDate] = useState(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState({ campaignID: '' });
  const [showLinkModal, setLinkModalShow] = useState(false);
  const [link, setLink] = useState('');
  let [pageNum, setPageNum] = useState(1)
  let [pageData, setPageData] = useState(pageInfo.PageSize)
  const [closeScreen,setCloseScreen] = useState(0);

  useEffect(()=>{
    setCloseScreen(allCampaigns.length)
  },[allCampaigns])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseCampaignModal = () => setCloseShow(false);
  const handleShowCampaignModal = (campaign: any) => {
    setSelectedCampaign(campaign);
    setCloseShow(true);
  };

  const handleLinkModalClose = () => setLinkModalShow(false);
  const handleLinkModalShow = (link: string) => {
    setLinkModalShow(true);
    setLink(API_CONFIG.talentRecognitionUrl + link);
  };

  const prevPage = () => {
    setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber - 1 });
    const data = {
      PageNumber: pageInfo.PageNumber - 1,
      PageSize: pageInfo.PageSize,
      active: pageInfo.active
    }
    setPageData(pageNum - 1)
    setPageNum(pageNum - pageInfo.PageSize)
    dispatch(fetchCampaigns(data));
  }

  const nextPage = () => {
    setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber + 1 });
    const data = {
      PageNumber: pageInfo.PageNumber + 1,
      PageSize: pageInfo.PageSize,
      active: pageInfo.active
    }
    setPageNum(pageNum + pageInfo.PageSize)
    setPageData(((pageInfo.PageSize + pageData) > Number(totalCampaignsRecord)) ? Number(totalCampaignsRecord) : pageInfo.PageSize + pageData)
    dispatch(fetchCampaigns(data));
  }

  const handleCreate = () => {
    dispatch(setCampaignData(campaignInfo));
    dispatch(setCampaignInProcessID(0));
    dispatch(setCampaignPreferences([]));
    window.sessionStorage.setItem("selectedCampaign", '0');
    history.push(`/CreateCampaign`);
    dispatch(createCampaign(campaignInfo));
    handleClose();
  };

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(updateCurrentPath("campaigns", "active"));
    dispatch(fetchCampaigns(pageInfo));
  }, [path.area, dispatch]);

  function onValueChanged(event: any) {
    const { name, value } = event.target;
    setCampaignInfo({ ...campaignInfo, [name]: value });
  }

  function onProductSelect(product: IProduct): void {
    dispatch(changeSelectedProduct(product));
    dispatch(setModificationState(ProductModificationStatus.None));
  }

  function openLink(link: string) {
    window.open(API_CONFIG.talentRecognitionUrl + link);
  }

  const editCampaign = (id: any) => {
    dispatch(fetchCampaignDetails(id))
    dispatch(setCampaignInProcessID(id));
    window.sessionStorage.setItem("selectedCampaign", id);
    history.push(`/CreateCampaign/${id}`);
  }

  const handleTabs = (e: any) => {
    setKey(e);
    setPageNum(1)
    setPageData(6)

    if (e == 'Active') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 1
      })
      dispatch(fetchCampaigns({

        PageNumber: 1,
        PageSize: 6,
        active: 1
      }));
    }
    else if (e == 'closed') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 0
      })
      dispatch(fetchCampaigns({
        PageNumber: 1,
        PageSize: 6,
        active: 0
      }));
    } else if (e == 'all') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 2
      })
      dispatch(fetchCampaigns({
        PageNumber: 1,
        PageSize: 6,
        active: 2
      }));
    }
  }

  const handleCampaign = (campaign: any) => {
    dispatch(getCampaignResult({ "PageNumber": 1, "PageSize": 6, "id": campaign.campaignID, active: 1 }));
    dispatch(setSelectedCampaignDetail(campaign));
    history.push('/CampaignApplications');
  }

  const handleChange = (date: any) => {
    setCloseDate(date);
  };

  const confirmClose = () => {
    const campaignData = {
      id: selectedCampaign.campaignID,
      date: closeDate,
      comment: "",
    }
    handleCloseCampaignModal();
    dispatch(closeCampaign(campaignData));
  }

  const deleteDraft = (campaignInfo: any) => {
    dispatch(deleteDraftCampaign({ id: campaignInfo.campaignID }))
    dispatch(fetchCampaigns(pageInfo));
  }

  if (loader) {
    return (
      <Loader children={''} isLoading={loader} type={"circle"} />
    );
  }

  return (
    <>
      <div className="col-12">
        <div className="row">
          <h1 className="campaign-hdg mb-2 mr-2">Campaigns</h1>
          <button disabled={!deptsAccess.includes('dep8',) ? true : false} className="btn campaign-btn-new mt-0 mt-lg-2 " onClick={handleShow}>New</button>
        </div>
      </div>
      <div className="create-campaign-modal-main">
        <Modal className="create-campaign-modal-main" show={showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create campaign</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="crate-input-nme">
              <label>Campaign name</label>
              <input type="text" value={campaignInfo.campaignName} onChange={onValueChanged} className="col-12" id="campaignName" name="campaignName"></input>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="cancel-btn-modal" onClick={handleClose}>
              Cancel
          </Button>
            <Button variant="primary" className="crate-btn-modal" disabled={!campaignInfo.campaignName} onClick={handleCreate}>
              Create campaign
          </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <>
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
                    onChange={handleChange}
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

        <div className="create-campaign-modal-main">
          <Modal className="create-campaign-modal-main"
            show={showLinkModal}
            onHide={handleLinkModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>Respond to Link</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <>
                <div className="row">
                  <div className="col-10">
                    <p>
                      {link}
                    </p>
                  </div>
                  <div className="col-2">
                    <CopyToClipboard text={link}>
                      <i onClick={handleLinkModalClose} className="fa fa-clone" aria-hidden="true"></i>
                    </CopyToClipboard>
                  </div>
                </div>
              </>
            </Modal.Body>
          </Modal>
        </div>
        <div className="campaign-tabs-main">
          <Tabs activeKey={key} id="uncontrolled-tab-example" onSelect={(k: any) => handleTabs(k)}>
            <Tab eventKey="Active" title="Active">
              {allCampaigns && allCampaigns.length > 0 && allCampaigns.map((campaign: any, i: any) => (
                <>
                  {campaign.active != 0 && (
                    <div key={i} className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0">
                      <div className="table-responsive portlet">
                        <table className="table mb-0 ">
                          <thead>
                            <tr>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ><h6 className="m-0 ">{campaign.campaignName}</h6></th>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                              <th className="border-right border-top-0 pt-4 pb-4" ></th>
                              <th className="border-top-0 ">
                                <div className="header-buttons justify-content-end">
                                  {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleLinkModalShow(campaign.link)} type="button" className="btn btn-outline-success link-btn-cmpan mr-3"><div className="link-icon"></div> Link</button>)}
                                  {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleShowCampaignModal(campaign)} className="btn btn-outline-secondary mr-3">Close campaign</button>)}
                                  {campaign.closedDate == null && campaign.published == 0 && (<button onClick={() => deleteDraft(campaign)} className="btn btn-outline-secondary mr-3">Delete draft</button>)}
                                  <button className="btn btn-outline-success link-btn-cmpan" disabled={deptsAccess.includes('dep8') || deptsAccess.includes('dep9') ? false : true} onClick={() => editCampaign(campaign.campaignID)}><div className="setting-icon"></div></button>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className={campaign.applicants != "0" ? "table-bordered campaigns-table" : "table-bordered campaigns-table-disabled"}
                            onClick={() => campaign.applicants != "0" && handleCampaign(campaign)}
                          >
                            <tr>
                              <ProductList2
                                onSelect={onProductSelect}
                                campaign={campaign}
                                draftClick={() => editCampaign(campaign.campaignID)}
                              />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ))}
              {allCampaigns && allCampaigns.length == 0 && (
                <>
                  <div className="mt-5"></div>
                  <div className="container">
                    <div className="col-lg-8 col-md-8 col-sm-12 mx-auto p-0">

                      <div className="crate-lists">
                        <ul className="list-unstyled text-left">
                          <li>Select from our library of over 230 pre-set personality matches to job roles</li>
                          <li>you can set up to 4 qualifying questions</li>
                          <li>you can set a cap on the cost of your Campaign</li>
                          <li>4 clicks / 3 minutes is all it takes to create a 'respond to' link.</li>
                        </ul>

                        <div className="create-plus-center mt-4 mb-4 text-left">
                          <h2>It's easy to create your first Campaign </h2>
                        </div>
                        <div className="create-plus-center mt-4 mb-4 text-center col-lg-10">
                          <button className="btn campaign-btn-new mt-2" onClick={handleShow}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
                        </div>
                        <ul className="list-unstyled text-left">
                          <li>Once created, drop your 'respond to' link into your online vacancy </li>
                          <li>Your applicants click the 'respond to' link</li>
                          <li>TR Recruiter, as your Applicant Tracking System, gathers applicant data</li>
                          <li>Your dashboard ranks all applicants in Best Fit Order</li>
                          <li>You only interview the top 3-4 applicants to create your shortlist </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {allCampaigns && allCampaigns.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <span className="mr-2 a-left">
                    {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                  </span>
                  <span className="d-inline-block pagiNation">{pageNum}- {pageData} of {Number(totalCampaignsRecord)}</span>
                  <span className="a-left ml-2">
                    {
                      pageData < (Number(totalCampaignsRecord)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                  </span>
                </div>
              )}

            </Tab>
            <Tab eventKey="closed" title="Closed">
              {allCampaigns && allCampaigns.length > 0 && allCampaigns.map((campaign: any, i: any) => (
                <>
                  {campaign.active == 0 && (
                    <div key={i} className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0">
                      <div className="table-responsive portlet">
                        <table className="table mb-0 ">
                          <thead>
                            <tr>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ><h6 className="m-0 ">{campaign.campaignName}</h6></th>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                              <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                              <th className="border-right border-top-0 pt-4 pb-4" ></th>
                              <th className="border-top-0 ">
                                <div className="header-buttons justify-content-end">
                                  {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleLinkModalShow(campaign.link)} type="button" className="btn btn-outline-success link-btn-cmpan mr-3"><div className="link-icon"></div> Link</button>)}
                                  {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleShowCampaignModal(campaign)} className="btn btn-outline-secondary mr-3">Close campaign</button>)}
                                  {campaign.closedDate == null && campaign.published == 0 && (<button onClick={() => deleteDraft(campaign)} className="btn btn-outline-secondary mr-3">Delete draft</button>)}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className={campaign.applicants != "0" ? "table-bordered campaigns-table" : "table-bordered campaigns-table-disabled"}
                            onClick={() => campaign.applicants != "0" && handleCampaign(campaign)}
                          >
                            <tr>
                              <ProductList2
                                onSelect={onProductSelect}
                                campaign={campaign}
                                draftClick={() => editCampaign(campaign.campaignID)}
                              />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ))}
              {allCampaigns && allCampaigns.length === 0 || closeScreen === 0 && (
                <>
                  <div className="mt-5"></div>
                  <div className="container">
                    <div className="col-lg-8 col-md-8 col-sm-12 mx-auto p-0">
                      <div className="crate-lists">
                        <ul className="list-unstyled text-left">
                          <li>Select from our library of over 230 pre-set personality matches to job roles</li>
                          <li>you can set up to 4 qualifying questions</li>
                          <li>you can set a cap on the cost of your Campaign</li>
                          <li>4 clicks / 3 minutes is all it takes to create a 'respond to' link.</li>
                        </ul>
                        <div className="create-plus-center mt-4 mb-4 text-left">
                          <h2>It's easy to create your first Campaign </h2>
                        </div>
                        <div className="create-plus-center mt-4 mb-4 text-center col-lg-10">
                          <button className="btn campaign-btn-new mt-2" onClick={handleShow}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
                        </div>
                        <ul className="list-unstyled text-left">
                          <li>Once created, drop your 'respond to' link into your online vacancy </li>
                          <li>Your applicants click the 'respond to' link</li>
                          <li>TR Recruiter, as your Applicant Tracking System, gathers applicant data</li>
                          <li>Your dashboard ranks all applicants in Best Fit Order</li>
                          <li>You only interview the top 3-4 applicants to create your shortlist </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {allCampaigns && allCampaigns.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <span className="mr-2 a-left">
                    {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                  </span>
                  <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignsRecord)}</span>
                  <span className="a-left ml-2">
                    { pageData < (Number(totalCampaignsRecord))
                      && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                  </span>
                </div>
              )}
            </Tab>
            <Tab eventKey="all" title="All" >
              {allCampaigns && allCampaigns.length > 0 && allCampaigns.map((campaign: any, i: any) => (
                <div key={i} className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0">
                  <div className="table-responsive portlet">
                    <table className="table mb-0 ">
                      <thead>
                        <tr>
                          <th className="border-right-0 border-top-0 pt-4 pb-4" ><h6 className="m-0 ">{campaign.campaignName}</h6></th>
                          <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                          <th className="border-right-0 border-top-0 pt-4 pb-4" ></th>
                          <th className="border-right border-top-0 pt-4 pb-4" ></th>
                          <th className="border-top-0 ">
                            <div className="header-buttons justify-content-end">
                              {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleLinkModalShow(campaign.link)} type="button" className="btn btn-outline-success link-btn-cmpan mr-3"><div className="link-icon"></div> Link</button>)}
                              {campaign.closedDate == null && campaign.published == 1 && (<button onClick={() => handleShowCampaignModal(campaign)} className="btn btn-outline-secondary mr-3">Close campaign</button>)}
                              {campaign.closedDate == null && campaign.published == 0 && (<button onClick={() => deleteDraft(campaign)} className="btn btn-outline-secondary mr-3">Delete draft</button>)}
                              <button className="btn btn-outline-success link-btn-cmpan" disabled={deptsAccess.includes('dep8') || deptsAccess.includes('dep9') ? false : true} onClick={() => editCampaign(campaign.campaignID)}><div className="setting-icon"></div></button>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className={campaign.applicants != "0" ? "table-bordered campaigns-table" : "table-bordered campaigns-table-disabled"}
                        onClick={() => campaign.applicants != "0" && handleCampaign(campaign)}
                      >
                        <tr>
                          <ProductList2
                            onSelect={onProductSelect}
                            campaign={campaign}
                            draftClick={() => editCampaign(campaign.campaignID)}
                          />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {allCampaigns && allCampaigns.length == 0 && (
                <>
                  <div className="mt-5"></div>
                  <div className="container">
                    <div className="col-lg-8 col-md-8 col-sm-12 mx-auto p-0">

                      <div className="crate-lists">
                        <ul className="list-unstyled text-left">
                          <li>Select from our library of over 230 pre-set personality matches to job roles</li>
                          <li>you can set up to 4 qualifying questions</li>
                          <li>you can set a cap on the cost of your Campaign</li>
                          <li>4 clicks / 3 minutes is all it takes to create a 'respond to' link.</li>
                        </ul>
                        <div className="create-plus-center mt-4 mb-4 text-left">
                          <h2>It's easy to create your first Campaign </h2>
                        </div>
                        <div className="create-plus-center mt-4 mb-4 text-center col-lg-10">
                          <button className="btn campaign-btn-new mt-2" onClick={handleShow}><i className="fa fa-plus-square" aria-hidden="true"></i></button>
                        </div>
                        <ul className="list-unstyled text-left">
                          <li>Once created, drop your 'respond to' link into your online vacancy </li>
                          <li>Your applicants click the 'respond to' link</li>
                          <li>TR Recruiter, as your Applicant Tracking System, gathers applicant data</li>
                          <li>Your dashboard ranks all applicants in Best Fit Order</li>
                          <li>You only interview the top 3-4 applicants to create your shortlist </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {allCampaigns && allCampaigns.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <span className="mr-2 a-left">
                    {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                  </span>
                  <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalCampaignsRecord)}</span>
                  <span className="a-left ml-2">
                    { pageData < (Number(totalCampaignsRecord)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}</span>
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </>
    </>
  );
};
export default Products;