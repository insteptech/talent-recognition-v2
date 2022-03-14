import React, {Dispatch, useEffect, useState, } from "react";
import moment from 'moment';
import { Link } from 'react-router-dom'
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import 'react-credit-cards/es/styles-compiled.css';
import { PDFObject } from 'react-pdfobject'
import { IStateType } from "../../../../store/models/root.interface";
import { updateCurrentPath } from "../../../../store/actions/root.actions";
import { IProductState, IRootPageStateType } from "../../../../store/models/root.interface";
import { clearSelectedProduct } from "../../../../store/actions/products.action";
import { fetchAccounts, fetchAccountInfo, fetchPaymentMethod, fetchInvoices } from "../../../../store/actions/CustService/custService.action";
import Loader from '../../../../common/components/loader';

const CompanyAccount: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const [showDocModal, setDocShow] = useState(false);
    const [selectedFile, setSelectedShow] = useState('');

    const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
    const allAccounts: IProductState = useSelector((state: IStateType) => state.users.allAccounts.result);
    const totalAccount: IProductState = useSelector((state: IStateType) => state.users.allAccounts.totalRecord);
    const loader: any = useSelector((state: IStateType) => state.users.accountLoader);
    const creditCard: IProductState = useSelector((state: IStateType) => state.users.paymentMethod.cardNumber);
    const allInvoices: any = useSelector((state: IStateType) => state.users.invoices.result);
    const invoicesTotal: any = useSelector((state: IStateType) => state.users.invoices.totalRecord);
    const [key, setKey] = useState('Ledger');
    const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6 });
    let [pageNum, setPageNum] = useState(1)
    let [pageData, setPageData] = useState(pageInfo.PageSize)

    const totalAccountRecord = totalAccount && (Number(totalAccount) / Number(pageInfo.PageSize));
    const totalInvoiceRecord = invoicesTotal && (Number(invoicesTotal) / Number(pageInfo.PageSize));

    useEffect(() => {
        dispatch(fetchAccountInfo());
        dispatch(fetchPaymentMethod());
        dispatch(clearSelectedProduct());
        dispatch(updateCurrentPath("accounts", "ledger"));
        dispatch(fetchAccounts(pageInfo));
    }, [creditCard, path.area, dispatch])

    const handleDocClose = () => {
        setDocShow(false);
    }
    const handleDocShow = (file: any) => {
        setDocShow(true);
        setSelectedShow(file);
    };

    if (loader) {
        return (
            <Loader children={''} isLoading={loader} type={"circle"} />
        );
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
            <div className="col-12">
                <div className="row">
                    <div className="d-flex justify-content-between aligns-item-center w-100">
                        <div className="">
                            <Link to="/customerService/amend-account">
                                <div className="back-button" style={{ cursor: 'pointer' }}><i className="fas fa-chevron-left"></i> Go Back</div>
                            </Link>
                            <h1 className="campaign-hdg accunt-hdg mb-2 mr-2">Company Accounts</h1>
                        </div>
                    </div>
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
        </>
    );
};
export default CompanyAccount;