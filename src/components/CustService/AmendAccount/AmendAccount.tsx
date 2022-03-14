import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, fetchSelectedUserDetails, loginAsClient } from '../../../store/actions/adminCompany.actions'
import { IStateType } from '../../../store/models/root.interface';
import { deleteCookie } from '../../../services/cookie';

const CustServiceAmendAccount = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const companyUsers = useSelector((state: IStateType) => state.admin.users.result);
    const [pageInfo, setPageInfo] = useState({ "PageNumber": 1, "PageSize": 99999, "SearchText": "" })
    const [isEdit, setEdit] = useState(false);
    const [selectedComapny, setSelectedCompany] = useState({ label: '', value: '' });
    const [formState, setFormState] = useState({
        selectCompany: { error: "", value: "", label: "" },
    })
    useEffect(() => {
        dispatch(fetchUsers(pageInfo))
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

    const handleChangeCompany = (option: any) => {
        setSelectedCompany(option);
        editClient(option)
    }
    async function editClient(client: any) {
        setEdit(true)
        deleteCookie("company_token")
        dispatch(fetchSelectedUserDetails(client.value))
        await dispatch(loginAsClient({ userIndex: client.value }))
        await history.push(`/customerService/amend-account/${client.value}`)
    }

    return (
        <>
            <div className="col-12">
                <div className="row">
                    <div className="d-flex justify-content-between aligns-item-center w-100">
                        <h1 className="campaign-hdg accunt-hdg mb-2 mr-2">Amend Client Account</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="card mt-3">
                            <h3 className="heading my-5 text-center">Select Company to amend</h3>
                            <div className="d-flex justify-content-center">
                                <div className="col-lg-6 mx-auto">
                                    <Select
                                        id="companyUsers"
                                        field="companyUsers"
                                        className="search-input"
                                        type="select"
                                        value={{
                                            value: selectedComapny.value,
                                            label: selectedComapny.label
                                        }}
                                        onChange={option => handleChangeCompany(option)}
                                        options={company}
                                        required={true}
                                        label="company Users"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 mx-auto">
                                {isEdit && (
                                    <div className="d-flex justify-content-lg-around justify-content-md-between align-items-center my-5 ammendtBtn"  >
                                        <Link to='/customerService/useraccount'>
                                            <div className="card-inner d-flex flex-column align-items-center" id="amendAccountButton"  >
                                                <i className="fas fa-pound-sign"></i>
                                                <div className="text-center mg-text" id="amendAccountBtn"> <span className="mg-text">Account</span> </div>
                                            </div>
                                        </Link>
                                        <Link to="/customerService/companycampaign">
                                            <div className="card-inner d-flex flex-column align-items-center" id="amendAccountButton" >
                                                <i className="fas fa-fw fa-warehouse"></i>
                                                <div className="text-center mg-text" id="amendAccountBtn"> <span className="mg-text">Campaign</span> </div>
                                            </div>
                                        </Link>
                                        <Link to="/customerService/companyusers">
                                            <div className="card-inner d-flex flex-column align-items-center" id="amendAccountButton"  >
                                                <i className="fas fa-fw fa-users"></i>
                                                <div className="text-center mg-text" id="amendAccountBtn"> <span className="mg-text">Users</span> </div>
                                            </div>
                                        </Link>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CustServiceAmendAccount;