import React, { Fragment, Dispatch, useEffect, useState, } from "react";
import moment from 'moment';
import { useHistory } from 'react-router-dom'
import Tabs from 'react-bootstrap/Tabs';
import { Modal, Button } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import { useDispatch, useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { PDFObject } from 'react-pdfobject'
import TextInput from "../../common/components/TextInput";
import { OnChangeModel } from "../../common/types/Form.types";
import { IStateType } from "../../store/models/root.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IProductState, IRootPageStateType } from "../../store/models/root.interface";
import { clearSelectedProduct } from "../../store/actions/products.action";
import { fetchAccounts, fetchAccountInfo, fetchPaymentMethod, addPaymentMethod, fetchInvoices } from "../../store/actions/users.action";
import Loader from '../../common/components/loader';

const Accounts: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const history = useHistory()
    const [showModal, setShow] = useState(false);
    const [showDocModal, setDocShow] = useState(false);
    const [sufficientAuthority, setSufficientAuthority] = useState(Boolean);
    const [selectedFile, setSelectedShow] = useState('');
    const [formState, setFormState] = useState({
        namecard: { error: "", value: "" },
        cardnumber: { error: "", value: "" },
        cvv: { error: "", value: "" },
        expirymonth: { error: "", value: "" },
        expiryyear: { error: "", value: "" },
        authOffer: { error: "", value: "" },
    });
    const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
    const allAccounts: IProductState = useSelector((state: IStateType) => state.users.allAccounts.result);
    const totalAccount: IProductState = useSelector((state: IStateType) => state.users.allAccounts.totalRecord);
    const loader: any = useSelector((state: IStateType) => state.users.accountLoader);
    const accountInfo: IProductState = useSelector((state: IStateType) => state.users.accountInfo);
    const paymentMethod: IProductState = useSelector((state: IStateType) => state.users.paymentMethod);
    const creditCard: IProductState = useSelector((state: IStateType) => state.users.paymentMethod.cardNumber);
    const allInvoices: any = useSelector((state: IStateType) => state.users.invoices.result);
    const invoicesTotal: any = useSelector((state: IStateType) => state.users.invoices.totalRecord);
    const [key, setKey] = useState('Ledger');
    const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6 });
    let [pageNum, setPageNum] = useState(1)
    let [pageData, setPageData] = useState(pageInfo.PageSize)

    const totalAccountRecord = totalAccount && (Number(totalAccount) / Number(pageInfo.PageSize));
    const totalInvoiceRecord = invoicesTotal && (Number(invoicesTotal) / Number(pageInfo.PageSize));
    const handleClose = () => {
        setShow(false);
        setFormState({
            namecard: { error: "", value: "" },
            cardnumber: { error: "", value: "" },
            cvv: { error: "", value: "" },
            expirymonth: { error: "", value: "" },
            expiryyear: { error: "", value: "" },
            authOffer: { error: "", value: "" },
        });
        setSufficientAuthority(false);
    }
    useEffect(() => {
        dispatch(fetchAccountInfo());
        dispatch(fetchPaymentMethod());
        dispatch(clearSelectedProduct());
        dispatch(updateCurrentPath("accounts", "ledger"));
        dispatch(fetchAccounts(pageInfo));
        if (creditCard) {
            setShow(false)
        } else if (!creditCard) {
            setShow(true)
        }
    }, [creditCard, path.area, dispatch])

    const handleShow = () => setShow(true);

    const handleDocClose = () => {
        setDocShow(false);
    }
    const handleDocShow = (file: any) => {
        setDocShow(true);
        setSelectedShow(file);
    };

    const handleCreate = () => {
        const data = {
            "namecard": formState.namecard.value,
            "cardnumber": formState.cardnumber.value,
            "cvv": formState.cvv.value,
            "expirymonth": formState.expirymonth.value,
            "expiryyear": formState.expiryyear.value,
            "authOffer": formState.authOffer.value,
            "consent": sufficientAuthority,
        }
        dispatch(addPaymentMethod(data));
        handleClose();
        dispatch(fetchAccounts(pageInfo));
        history.push('/Accounts')
    };

    if (loader) {
        return (
            <Loader children={''} isLoading={loader} type={"circle"} />
        );
    }

    function hasFormValueChanged(model: OnChangeModel): void {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
    }

    const handleChangeCheck = (event: any) => {
        setSufficientAuthority(event.target.checked);
    }

    const prevPage = (key: any) => {
        setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber - 1 });
        const data = {
            PageNumber: pageInfo.PageNumber - 1,
            PageSize: pageInfo.PageSize,
        }
        if (key === "Ledger") {
            setPageData(pageNum - 1)
            setPageNum(pageNum - pageInfo.PageSize)
            dispatch(fetchAccounts(data));
        } else if (key === "Invoices") {
            setPageData(pageNum - 1)
            setPageNum(pageNum - pageInfo.PageSize)
            dispatch(fetchInvoices(pageInfo));
        }
    }

    const nextPage = (key: any) => {
        setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber + 1 });
        const data = {
            PageNumber: pageInfo.PageNumber + 1,
            PageSize: pageInfo.PageSize,
        }
        if (key === "Ledger") {
            setPageNum(pageNum + pageInfo.PageSize)
            setPageData(((pageInfo.PageSize + pageData) > Number(totalAccount)) ? Number(totalAccount) : pageInfo.PageSize + pageData)
            dispatch(fetchAccounts(data));
        } else if (key === "Invoices") {
            setPageNum(pageNum + pageInfo.PageSize)
            setPageData(((pageInfo.PageSize + pageData) > Number(invoicesTotal)) ? Number(invoicesTotal) : pageInfo.PageSize + pageData)
            dispatch(fetchInvoices(data));
        }
    }
    const handleTabs = (e: any) => {
        setKey(e);
        setPageNum(1)
        setPageData(pageInfo.PageSize)

        if (e === 'Ledger') {
            setPageInfo({
                PageNumber: 1,
                PageSize: pageInfo.PageSize,
            })
            dispatch(fetchAccounts({
                PageNumber: 1,
                PageSize: pageInfo.PageSize,
            }));
        }
        else if (e === 'Invoices') {
            setPageInfo({
                PageNumber: 1,
                PageSize: pageInfo.PageSize,
            })
            dispatch(fetchInvoices({
                PageNumber: 1,
                PageSize: pageInfo.PageSize,
            }));
        }
    }

    return (
        <>
            <Fragment>
                <div className="col-12">
                    <div className="row">
                        <div className="d-flex justify-content-between aligns-item-center w-100">
                            <div className="">
                                <h1 className="campaign-hdg accunt-hdg mb-2 mr-2">Accounts</h1>
                            </div>
                            <div className="">
                                <button className="btn link-btn-cmpan account-hed-btn" onClick={handleShow}>
                                    <div className="card-icon"></div>
                                    <span className="font-weight-bold" > Payment method</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="payment-method-details">
                        {paymentMethod && <span className="pull-left">{paymentMethod.cardNumber} Exp: {paymentMethod.expiryDate}</span>}
                    </div>
                    {accountInfo.messageLine !== " " && (<div className="warning-msg py-3 px-3">
                        <span>
                            <i className="fas fa-exclamation-circle"></i> {accountInfo.messageLine}
                        </span>
                    </div>)}
                    <div className="create-campaign-modal-main">
                        <Modal className="create-campaign-modal-main" show={showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Payment method</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-12 col-sm-12">
                                            <Cards
                                                cvc={formState.cvv.value || ''}
                                                expiry={formState.expirymonth.value + formState.expiryyear.value || ''}
                                                name={formState.namecard.value || ''}
                                                number={formState.cardnumber.value || ''}
                                            />
                                            <div className="col-12 card-left-conr">
                                                <h5>Card details</h5>
                                                <p>Please provide valid card details</p>
                                            </div>
                                            <div className="col-12 card-left-backpnk">
                                                <p>Only one payment method can be added for a team. All transactions will be charged by the same method regardless of users. </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-12 col-sm-12">
                                            <div className="crate-input-nme mb-3">
                                                <TextInput
                                                    id="namecard"
                                                    field="namecard"
                                                    value={formState.namecard.value}
                                                    onChange={hasFormValueChanged}
                                                    required={true}
                                                    maxLength={40}
                                                    label="Name on Card"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-lg-8 col-md-6 col-sm-12">
                                                    <div className="crate-input-nme">
                                                        <TextInput
                                                            id="cardnumber"
                                                            field="cardnumber"
                                                            value={formState.cardnumber.value}
                                                            onChange={hasFormValueChanged}
                                                            required={true}
                                                            maxLength={16}
                                                            label="Card number"
                                                            placeholder=""
                                                            numericality={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12">
                                                    <div className="crate-input-nme">
                                                        <TextInput
                                                            id="cvv"
                                                            field="cvv"
                                                            value={formState.cvv.value}
                                                            onChange={hasFormValueChanged}
                                                            required={true}
                                                            maxLength={3}
                                                            label="CVV"
                                                            placeholder=""
                                                            numericality={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 p-0 mb-3">
                                                <label>Expiry date</label>
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="crate-input-nme">
                                                            <TextInput
                                                                id="expirymonth"
                                                                field="expirymonth"
                                                                value={formState.expirymonth.value}
                                                                onChange={hasFormValueChanged}
                                                                required={true}
                                                                maxLength={2}
                                                                placeholder=""
                                                                numericality={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-sm-12">
                                                        <div className="crate-input-nme">
                                                            <TextInput
                                                                id="expiryyear"
                                                                field="expiryyear"
                                                                value={formState.expiryyear.value}
                                                                onChange={hasFormValueChanged}
                                                                required={true}
                                                                maxLength={2}
                                                                placeholder=""
                                                                numericality={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="crate-input-nme mb-3">
                                                <TextInput
                                                    id="authOffer"
                                                    field="authOffer"
                                                    value={formState.authOffer.value}
                                                    onChange={hasFormValueChanged}
                                                    required={true}
                                                    maxLength={40}
                                                    label="Name of Authorized Signatory"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="crate-input-nme mb-3">
                                                <Form.Group controlId="formBasicCheckbox">
                                                    <Form.Check
                                                        onClick={(e) => handleChangeCheck(e)}
                                                        checked={sufficientAuthority}
                                                        type="checkbox"
                                                        label="I confirm that I have sufficient authority under this card mandate, to sign this agreement on behalf of the company."
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="text-right">
                                <Button variant="secondary" className="cancel-btn-modal" onClick={handleClose}>
                                    Cancel</Button>
                                <Button
                                    variant="primary"
                                    className="crate-btn-modal"
                                    onClick={handleCreate}
                                    disabled={
                                        formState.authOffer.value === "" ||
                                        formState.cardnumber.value === "" ||
                                        formState.cvv.value === "" ||
                                        formState.expirymonth.value === "" ||
                                        formState.expiryyear.value === "" ||
                                        formState.namecard.value === "" ||
                                        !sufficientAuthority
                                    }
                                > Submit</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <div className="create-campaign-modal-main">
                        <Modal className="create-campaign-modal-main modal-90w" show={showDocModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={handleDocClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Invoice</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <PDFObject url={selectedFile} />
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
                <div className="campaign-tabs-main">
                    <Tabs activeKey={key} onSelect={(k: any) => handleTabs(k)} id="uncontrolled-tab-example">
                        <Tab eventKey="Ledger" title="Ledger">
                            <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5">
                                <div className="table-responsive portlet">
                                    <table className="table mb-0 ">
                                        <thead className="user-tbl-head">
                                            <tr>
                                                <th className="border-top-0 pt-3 pb-3" >Date</th>
                                                <th className="border-right-0 border-top-0 pt-3 pb-3" >Transaction</th>
                                                <th className="text-right border-right-0 border-top-0 pt-3 pb-3" >Dr</th>
                                                <th className="text-right border-right-0 border-top-0 pt-3 pb-3" >Cr</th>
                                                <th className="border-right-0 border-top-0 pt-3 pb-3 float-right" >Balance</th>
                                            </tr>
                                        </thead>

                                        <tbody className="user-tbl-body">
                                            {allAccounts.length === 0 ?
                                                <tr>
                                                    <td colSpan={5}>
                                                        <p style={{ textAlign: "center", marginTop: '10px' }}>No data available</p>
                                                    </td>
                                                </tr> :
                                                <>{allAccounts && allAccounts.length > 0 && allAccounts.map((account: any, i: any) => (
                                                    <tr key={i}>
                                                        <td className="campain-firstdata ">
                                                            <h6>{moment(account.date).format("DD-MMM-YY")}</h6>
                                                        </td>
                                                        <td className="campain-firstdata ">
                                                            <h6>{account.trans}</h6>
                                                        </td>
                                                        <td align="right" className="campain-firstdata ">
                                                            <h6>{Number(account.drTotal).toFixed(2)}</h6>
                                                        </td>
                                                        <td align="right" className="campain-firstdata ">
                                                            <h6>{Number(account.crTotal).toFixed(2)}</h6>
                                                        </td>
                                                        <td align="right" className="campain-firstdata ">
                                                            <h6 className="float-right">{Number(account.balance).toFixed(2)}</h6>
                                                        </td>
                                                    </tr>
                                                ))}</>
                                            }
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            {
                                (Number(totalAccount) > 0) && totalAccountRecord > 1 && (
                                    <div className="row">
                                        <span className="mr-2 a-left">
                                            {pageInfo.PageNumber !== 1 && (<button className="btn btn-outline-secondary" onClick={() => prevPage("Ledger")}><i className="fas fa-arrow-left"></i></button>)}
                                        </span>
                                        <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalAccount)}</span>
                                        <span className="a-left ml-2">
                                            {pageData < (Number(totalAccount))
                                                && (<button className="btn btn-outline-secondary" onClick={() => nextPage("Ledger")} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                        </span>
                                    </div>
                                )}
                        </Tab>
                        <Tab eventKey="Invoices" title="Invoices">
                            <div className="col-xl-12 col-lg-12 product-main campaign-main-table mb-4 pl-0 pr-0 mt-5 " >
                                <div className="table-responsive portlet">
                                    <table className="table mb-0 ">
                                        <thead className="user-tbl-head">
                                            <tr>
                                                <th className="border-top-0 pt-3 pb-3" >Date</th>
                                                <th className="border-right-0 border-top-0 pt-3 pb-3" >Transaction</th>
                                                <th className="text-right border-right-0 border-top-0 pt-3 pb-3" >Amount</th>
                                                <th className="border-right-0 border-top-0 pt-3 pb-3 float-right" ></th>
                                            </tr>
                                        </thead>
                                        <tbody className="user-tbl-body">
                                            {allInvoices && allInvoices.length === 0 ?
                                                <tr>
                                                    <td colSpan={5}>
                                                        <p style={{ textAlign: "center", marginTop: '10px' }}>No data available</p>
                                                    </td>
                                                </tr> :
                                                <> {allInvoices && allInvoices.length > 0 && allInvoices.map((account: any, i: any) => (
                                                    <tr key={i}>
                                                        <td className="campain-firstdata ">
                                                            <h6>{moment(account.date).format("DD-MMM-YY")}</h6>
                                                        </td>
                                                        <td className="campain-firstdata ">
                                                            <h6>{account.trans}</h6>
                                                        </td>
                                                        <td align="right" className="campain-firstdata ">
                                                            <h6>{Number(account.crTotal).toFixed(2)}</h6>
                                                        </td>
                                                        <td align="right" className="campain-firstdata ">
                                                            {account.file && (
                                                                <button onClick={() => handleDocShow(account.file)} className="btn btn-outline-success down-btn-acc float-right">
                                                                    <i className="fa fa-eye" aria-hidden="true"></i>
                                                                 View
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}</>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {(Number(invoicesTotal) > 0) && totalInvoiceRecord > 1 && (
                                <div className="row">
                                    <span className="mr-2 a-left">
                                        {pageInfo.PageNumber !== 1 && (<button className="btn btn-outline-secondary" onClick={() => prevPage("Invoices")}><i className="fas fa-arrow-left"></i></button>)}
                                    </span>
                                    <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(invoicesTotal)}</span>
                                    <span className="a-left ml-2">
                                        {pageData < (Number(invoicesTotal)) && (<button className="btn btn-outline-secondary" onClick={() => nextPage("Invoices")} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>
                                        )}
                                    </span>
                                </div>
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </Fragment >
        </>
    );
};
export default Accounts;