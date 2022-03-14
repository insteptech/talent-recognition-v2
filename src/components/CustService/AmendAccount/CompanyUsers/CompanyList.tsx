import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, fetchSelectedUserDetails, loginAsClient,fetchAdminUsers } from '../../../../store/actions/adminCompany.actions'
import { IStateType } from '../../../../store/models/root.interface';
import { deleteCookie } from '../../../../services/cookie';

const CSCompanylist = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const companyUsers = useSelector((state: IStateType) => state.admin.users.result);
    const totalRecord = useSelector((state: IStateType) => state.admin.users.totalRecord);

    const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 6, "SearchText": "" })
    let [pageNum, setPageNum] = useState(1)
    let [pageData, setPageData] = useState(pageInfo.PageSize)
    const [formState, setFormState] = useState({
        selectCompany: { error: "", value: "", label: "" },
    })
    useEffect(() => {
        dispatch(fetchUsers(pageInfo))
        dispatch(fetchAdminUsers(pageInfo))
    }, [])

    const company: { value: any; label: any; }[] = [];
    companyUsers && companyUsers.length > 0 && companyUsers.forEach((element: { companyName: any; email: any; index: any }) => {
        company.push({ value: element.index, label: element.companyName });
    });
    let selectedConDur: { value: any; label: any; } = { value: '', label: '' };
    formState.selectCompany.value && company.filter(comp => {
        if (comp.value == formState.selectCompany.value) {
            return selectedConDur = comp;
        }
    });

    async function editClient(client: any) {
        deleteCookie("company_token")
        dispatch(fetchSelectedUserDetails(client.index))
        await history.push(`/customerService/new-account/${client.index}`)
    }

    const prevPage = () => {
        setPageInfo({ ...pageInfo, PageNumber: pageInfo.PageNumber - 1 });
        const data = {
            PageNumber: pageInfo.PageNumber - 1,
            PageSize: pageInfo.PageSize,
            SearchText: pageInfo.SearchText
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
            SearchText: pageInfo.SearchText
        }
        setPageNum(pageNum + pageInfo.PageSize)
        setPageData(((pageInfo.PageSize + pageData) > Number(totalRecord)) ? Number(totalRecord) : pageInfo.PageSize + pageData)
        dispatch(fetchUsers(data));
    }

    return (
        <>
            <div className="col-12">
                <div className="row">
                    <h1 className="campaign-hdg mb-2 mr-2">Companies</h1>
                    <Link to="/customerService/new-account">
                      <button className="btn campaign-btn-new mt-lg-2 mt-0" type="button" data-toggle="modal" data-target="#exampleModalCenter">New</button>
                    </Link>
                </div>
                <div className="campaign-tabs-main">
                    <div className=" col-lg-8 mx-auto product-main campaign-main-table mb-4 pl-0 pr-0 mt-5 pb-2">
                        <div className="table-responsive ">
                            <table className="table mb-0 ">
                                <thead className="user-tbl-head">
                                    <tr>
                                        <th className="border-top-0 pt-6 pb-6" >Companies</th>
                                        <th className="border-right-0 border-top-0 pt-3 pb-3"  >Modify</th>
                                    </tr>
                                </thead>
                                <tbody className="user-tbl-body">
                                    {companyUsers && companyUsers.length > 0 && companyUsers.map((client: any, indexValue: any) => (
                                        <tr key={indexValue}>
                                            <td className="campain-firstdata ">
                                                <h6>{client.companyName}</h6>
                                            </td>
                                            <td className="campain-firstdata-prfle">
                                                <div className="btnBox">
                                                    <button className="btn btn-outline-success link-btn-cmpan float-right" onClick={() => editClient(client)} ><div className="setting-icon"></div></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* -----listing of companies end-------- */}
                        {companyUsers && companyUsers.length > 0 && totalRecord > 1 && (
                                <div className="col-lg-8">
                                    <span className="mr-2 a-left">
                                        {pageInfo.PageNumber != 1 && (<button className="btn btn-outline-secondary" onClick={prevPage}><i className="fas fa-arrow-left"></i></button>)}

                                    </span>
                                    <span className="d-inline-block pagiNation">{pageNum}-{pageData} of {Number(totalRecord)}</span>
                                    <span className="a-left ml-2">
                                        {(pageData < Number(totalRecord)) && (<button className="btn btn-outline-secondary" onClick={nextPage} ><i className="fas fa-arrow-right" aria-hidden="true"></i></button>)}
                                    </span>
                                </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default CSCompanylist;