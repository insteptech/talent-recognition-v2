import React, { Fragment, Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../../../store/models/root.interface";
import { updateCurrentPath } from "../../../../store/actions/root.actions";
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IcustserviceProductState, IRootPageStateType } from "../../../../store/models/root.interface";
import { clearSelectedProduct } from "../../../../store/actions/CustService/products.action";
import { fetchUsers, createUser, getUserDetail, updateUser, closeUser } from "../../../../store/actions/CustService/custService.action";
import Loader from '../../../../common/components/loader';
import TextInput from "../../../../common/components/TextInput";
import { OnChangeModel } from "../../../../common/types/Form.types";
import { useHistory, Link } from "react-router-dom";

const CompanyUsers: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const history = useHistory()

  const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  const deptss: any = useSelector((state: IStateType) => state.account.deptsAccess)
  const allUsers: IcustserviceProductState = useSelector((state: IStateType) => state.custService.allUsers.result);
  const totalUsers: IcustserviceProductState = useSelector((state: IStateType) => state.custService.allUsers.totalRecord);
  const selectedUser: IcustserviceProductState = useSelector((state: IStateType) => state.custService.selectedUser);
  const loader: any = useSelector((state: IStateType) => state.users.isLoader);
  const [showModal, setShow] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);
  const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6, "active": 1 });
  let [pageNum, setPageNum] = useState(1)
  let [pageData, setPageData] = useState(pageInfo.PageSize)

  const [key, setKey] = useState('Active');
  const [isEdit, setEdit] = useState<boolean>(false);
  const handleShow = () => setShow(true);
  const [formState, setFormState] = useState({
    firstName: { value: "", error: "" },
    lastName: { value: "", error: "" },
    email: { value: "", error: "" },
    tel: { value: "", error: "" },
    createCampaign: { value: false },
    viewResult: { value: false },
    accounting: { value: false }
  });
  const [closeDate, setCloseDate] = useState(new Date());
  const [close, setClose] = useState<boolean>(false);
  const [ui, setUI] = useState(0)
  const totalRecord = totalUsers && (Number(totalUsers) / Number(pageInfo.PageSize));

  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(fetchUsers(pageInfo));
    dispatch(updateCurrentPath("/customerService/companyusers", "active"));
    setShow(false)
  }, [path.area, dispatch]);

  useEffect(() => {
    if (selectedUser && selectedUser.userIndex) {
      setFormState({
        firstName: { value: selectedUser.firstName, error: "" },
        lastName: { value: selectedUser.lastName, error: "" },
        email: { value: selectedUser.userName, error: "" },
        tel: { value: selectedUser.contact, error: "" },
        createCampaign: { value: selectedUser.createCampaign },
        viewResult: { value: selectedUser.viewResult },
        accounting: { value: selectedUser.accounting },
      });
      handleShow();
    }
  }, [selectedUser]);

  useEffect(() => {
    dispatch(fetchUsers(pageInfo));
  }, [showModal]);

  const prevPage = () => {
    setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber - 1 });
    const data = {
      PageNumber: pageInfo.PageNumber - 1,
      PageSize: pageInfo.PageSize,
      active: pageInfo.active
    }
    setPageData(pageNum - 1)
    setPageNum(pageNum - pageInfo.PageSize)
    dispatch(fetchUsers(data));
  }

  const nextPage = (e: any) => {
    setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber + 1 });
    const data = {
      PageNumber: pageInfo.PageNumber + 1,
      PageSize: pageInfo.PageSize,
      active: pageInfo.active
    }
    setPageNum(pageNum + pageInfo.PageSize)
    setPageData(((pageInfo.PageSize + pageData) > Number(totalUsers)) ? Number(totalUsers) : pageInfo.PageSize + pageData)
    dispatch(fetchUsers(data));
  }

  if (loader) {
    return (
      <Loader children={''} isLoading={loader} type={"circle"} />
    );
  }
  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  function create() {
    setViewCalender(false)
    history.push(`/customerService/companyusers`)
    setPageInfo({
      PageNumber: 1,
      PageSize: 6,
      active: 1
    })
    const userData = {
      firstName: formState.firstName.value,
      lastName: formState.lastName.value,
      email: formState.email.value,
      contact: formState.tel.value,
      createCampaign: formState.createCampaign.value ? 1 : 0,
      viewResult: formState.viewResult.value ? 1 : 0,
      accounting: formState.accounting.value ? 1 : 0,
      userIndex: ui
    }

    const data = {
      userIndex: ui,
      dateClosed: moment(closeDate).format('DD/MM/YYYY'),
      closeText: ''
    }

    if (closeDate && close ) {
      dispatch(closeUser(data));
      handleClose(data);
      return;
    }

    if (isEdit) {
      dispatch(updateUser(userData));
      handleClose(data);
      return;
    }
    dispatch(createUser(userData));
    handleClose(data);
    dispatch(fetchUsers(pageInfo));
    window.location.reload()
  }

  const handleClose = (data:any) => {
    setViewCalender(false)
    setShow(false);
    setEdit(false);
    setFormState({
      firstName: { value: "", error: "" },
      lastName: { value: "", error: "" },
      email: { value: "", error: "" },
      tel: { value: "", error: "" },
      createCampaign: { value: false },
      viewResult: { value: false },
      accounting: { value: false }
    });
    setCloseDate(new Date());
    // dispatch(closeUser(data));
    deleteUser(data)
  };
const deleteUser = (data:any) =>{
  if(viewCalender){
    console.log(viewCalender,'ppppppppp')
    dispatch(closeUser(data))
  }
}
  const handleTabs = (e: any) => {
    setKey(e);
    setPageNum(1);
    setPageData(pageInfo.PageSize);
    if (e == 'Active') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 1
      })
      dispatch(fetchUsers({
        PageNumber: 1,
        PageSize: 6,
        active: 1
      }));
    }
    else if (e == 'all') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 2
      })
      dispatch(fetchUsers({
        PageNumber: 1,
        PageSize: 6,
        active: 2
      }));
    }
    else if (e == 'closed') {
      setPageInfo({
        PageNumber: 1,
        PageSize: 6,
        active: 0
      })
      dispatch(fetchUsers({
        PageNumber: 1,
        PageSize: 6,
        active: 0
      }));
    }
  }
  const editUser = async (user: any) => {
    setEdit(true);
    let result: any = await dispatch(getUserDetail(user.userIndex));
    if (result) {
      setUI(result.data.result.userIndex)
    }
    history.push(`/customerService/companyusers/${user.userIndex}`)
  }
  const handleChange = (date: any) => {
    setCloseDate(date);
    setClose(true);
  };

  return (
    <>
      <Fragment>
        <div className="col-12">
          <div className="row">
            <Link to="/customerService/amend-account">
              <div className="back-button" style={{ cursor: 'pointer', marginRight: "10px" }}><i className="fas fa-chevron-left"></i> Go Back</div>
            </Link>
            <h1 className="campaign-hdg mb-2 mr-2">Company Users</h1>
            {deptss.includes('dep8') || deptss.includes('dep3') ?
              <button className="btn campaign-btn-new mt-lg-2 mt-0" onClick={handleShow} type="button" data-toggle="modal" data-target="#exampleModalCenter">New</button>
              : <div></div>}
          </div>
          <div className="create-campaign-modal-main">
            <Modal className="create-campaign-modal-main" show={showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{isEdit ? 'Edit user' : 'New user'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-12">
                  <form className="user" >
                    <div className="form-group">
                      <TextInput
                        id="firstName"
                        field="firstName"
                        value={formState.firstName.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="First Name*"
                        placeholder=""
                      />
                    </div>
                    <div className="form-group">
                      <TextInput
                        id="lastName"
                        field="lastName"
                        value={formState.lastName.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Last Name*"
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
                        id="tel"
                        field="tel"
                        value={formState.tel.value}
                        onChange={hasFormValueChanged}
                        required={true}
                        maxLength={100}
                        label="Telephone*"
                        placeholder=""
                        numericality={true}
                      />
                    </div>

                    <div className="col-12">
                      <div className="left-togle-hd">
                        <Form.Check
                          type="switch"
                          id="createCampaign"
                          onChange={(e: any) => setFormState({ ...formState, createCampaign: { value: e.target.checked } })}
                          checked={formState.createCampaign.value}
                        />
                        <label>Can create campaign</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="left-togle-hd">
                        <Form.Check
                          type="switch"
                          id="viewCampaign"
                          onChange={(e: any) => setFormState({ ...formState, viewResult: { value: e.target.checked } })}
                          checked={formState.viewResult.value}
                        />
                        <label>Can view campaign results</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="left-togle-hd">
                        <Form.Check
                          type="switch"
                          id="viewLedger"
                          onChange={(e: any) => setFormState({ ...formState, accounting: { value: e.target.checked } })}
                          checked={formState.accounting.value}
                        />
                        <label>Can view ledger</label>
                      </div>
                    </div>
                  </form>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-start">
                <div className="col-lg-12">
                  <div className=" row">
                    {isEdit && (
                      <>
                        {viewCalender && (
                          <>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <DatePicker
                                selected={closeDate}
                                onChange={handleChange}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                placeholderText="Date on which you wish to de-activate this user."
                                showDisabledMonthNavigation
                              />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 center-txt-grn align-self-center close-btn-new">
                              <p className="mt-3">Date you wish to deactivate user {moment(closeDate).format('DD/MM/YYYY')}</p>
                            </div>
                          </>
                        )}
                        {!viewCalender && (
                          <Button variant="secondary" className="cancel-btn-modal mr-2" onClick={() => setViewCalender(true)}>
                            Close</Button>
                        )}
                      </>
                    )}
                    <div className="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-end">
                      <Button variant="secondary" className="cancel-btn-modal mr-2" onClick={handleClose}>
                        Cancel</Button>
                      <Button variant="primary" className="crate-btn-modal"
                        disabled={!formState.firstName.value ||
                          !formState.lastName.value ||
                          !formState.email.value ||
                          !formState.tel.value ||
                          !formState.createCampaign.value &&
                          !formState.viewResult.value &&
                          !formState.accounting.value
                        }
                        onClick={create}>
                        {isEdit ? 'Confirm' : 'Create'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className="campaign-tabs-main">
          <Tabs activeKey={key} onSelect={(k: any) => handleTabs(k)} id="uncontrolled-tab-example">
            <Tab eventKey="Active" title="Active">
              <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                <div className="table-responsive ">
                  <table className="table mb-0 ">
                    <thead className="user-tbl-head">
                      <tr>
                        <th className="border-top-0 pt-3 pb-3" >Team member</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" >Permissions</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" ></th>
                      </tr>
                    </thead>
                    <tbody className="user-tbl-body">
                      {allUsers && (allUsers.length) > 0 && allUsers.map((user: any, i: any) => (
                        <>
                          <tr key={i}>
                            <td className="campain-firstdata ">
                              <h6>{user.firstName || ""} {user.lastName || ""}</h6>
                            </td>
                            <td className="campain-firstdata-prfle">
                              <div className="row">
                                <h6>{user.auths}</h6>
                              </div>
                            </td>
                            <td className="campain-firstdata ">
                              <button className="btn btn-outline-success link-btn-cmpan float-right" onClick={() => editUser(user)}><div className="setting-icon"></div></button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {allUsers && allUsers.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <span className="mr-2 a-left">
                    {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                  </span>
                  <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalUsers)}</span>
                  <span className="a-left ml-2">
                    {(pageData < Number(totalUsers)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                  </span>
                </div>
              )}
            </Tab>
            <Tab eventKey="closed" title="Closed">
              <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                <div className="table-responsive ">
                  <table className="table mb-0 ">
                    <thead className="user-tbl-head">
                      <tr>
                        <th className="border-top-0 pt-3 pb-3" >Team member</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" >Permissions</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" ></th>
                      </tr>
                    </thead>
                    <tbody className="user-tbl-body">
                      {allUsers && allUsers.length > 0 && allUsers.map((user: any, i: any) => (
                        <>
                          <tr key={i}>
                            <td className="campain-firstdata ">
                              <h6>{user.firstName || ""} {user.lastName || ""}</h6>
                            </td>
                            <td className="campain-firstdata-prfle">
                              <div className="row">
                                <h6>{user.auths}</h6>
                              </div>
                            </td>
                            <td className="campain-firstdata ">
                              {user.dateClosed}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {allUsers && allUsers.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <span className="mr-2 a-left">
                    {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                  </span>
                  <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalUsers)}</span>
                  <span className="a-left ml-2">
                    {
                      pageData < (Number(totalUsers)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                  </span>
                </div>
              )}
            </Tab>
            <Tab eventKey="all" title="All">
              <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                <div className="table-responsive ">
                  <table className="table mb-0 ">
                    <thead className="user-tbl-head">
                      <tr>
                        <th className="border-top-0 pt-3 pb-3" >Team member</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" >Permissions</th>
                        <th className="border-right-0 border-top-0 pt-3 pb-3" ></th>
                      </tr>
                    </thead>
                    <tbody className="user-tbl-body">
                      {allUsers && allUsers.length > 0 && allUsers.map((user: any, i: any) => (
                        <>
                          <tr key={i}>
                            <td className="campain-firstdata ">
                              <h6>{user.firstName || ""} {user.lastName || ""}</h6>
                            </td>
                            <td className="campain-firstdata-prfle">
                              <div className="row">
                                <h6>{user.auths}</h6>
                              </div>
                            </td>
                            <td className="campain-firstdata ">
                              {user.dateClosed ? (
                                <>{user.dateClosed}</>
                              ) : (
                                  <button className="btn btn-outline-success link-btn-cmpan float-right" onClick={() => editUser(user)}><div className="setting-icon"></div></button>
                                )}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {allUsers && allUsers.length > 0 && totalRecord > 1 && (
                <div className="row">
                  <>
                    <span className="mr-2 a-left">
                      {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}
                    </span>
                    <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalUsers)}</span>
                    <span className="a-left ml-2">
                      {(pageData < Number(totalUsers)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                    </span>
                  </>
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </Fragment >
    </>
  );
};
export default CompanyUsers;