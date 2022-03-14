import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import TextInput from '../../../common/components/TextInput';
import Select from 'react-select';
import { OnChangeModel } from '../../../common/types/Form.types';
import { IStateType } from '../../../store/models/root.interface'
import {
    createCompany,
    setUsers,
    fetchGetContractDuration,
    fetchGetSalesAgents,
    fetchGetSectorTypes,
} from '../../../store/actions/adminCompany.actions'
import { Button } from "react-bootstrap";

const CustServiceNewAccount = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const adminCompanyData = useSelector((state: IStateType) => state.admin)
    const saleAgents = useSelector((state: IStateType) => state.admin.saleAgents);
    const sectorTypes = useSelector((state: IStateType) => state.admin.sectorTypes);
    const contractDuration = useSelector((state: IStateType) => state.admin.contractDuration);
    const SelectedUser = useSelector((state: IStateType) => state.custService.selectedUser)

    const [selectedDuration, setSelectedDuration] = useState({ label: '', value: '' });
    const [selectedSaleAgents, setSelectedSaleAgents] = useState({ label: '', value: '' });
    const [selectedSectorTypes, setSelectedSectorTypes] = useState({ label: '', value: '' });
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState({ label: '', value: '' });

    useEffect(() => {
        dispatch(fetchGetContractDuration())
        dispatch(fetchGetSalesAgents())
        dispatch(fetchGetSectorTypes())
    }, [])

    const [formState, setFormState] = useState({
        companyName: { error: "", value: "" },
        address1: { error: "", value: '' },
        address2: { error: "", value: "" },
        city: { error: "", value: "" },
        postcode: { error: '', value: '' },
        salesPersonAgent: { error: '', value: '', label: "" },
        companyRegistration: { error: '', value: '' },
        numberOfEmployees: { error: "", value: "" },
        contDuration: { error: "", value: "", label: "" },
        clientContactName: { error: "", value: "" },
        clientContactEmail: { error: "", value: "" },
        clientContactTelNo: { error: "", value: "" },
        accountsContactName: { error: "", value: "" },
        accountContactEmail: { error: "", value: "" },
        accountsContactTelNo: { error: "", value: "" },
        vatRegistration: { error: "", value: "" },
        sectorType: { error: "", value: '', label: '' },
        payMethod: { error: '', value: "" },
    })

    useEffect(() => {
        if (SelectedUser && SelectedUser.userIndex) {
            setFormState({
                companyName: { error: "", value: SelectedUser.companyName },
                address1: { error: "", value: SelectedUser.address1 },
                address2: { error: "", value: SelectedUser.address2 },
                city: { error: "", value: SelectedUser.city },
                postcode: { error: '', value: SelectedUser.postCode },
                salesPersonAgent: { error: '', value: SelectedUser.salesPersonAgent, label: SelectedUser.salesPersonAgent },
                companyRegistration: { error: '', value: SelectedUser.companyRegistration },
                numberOfEmployees: { error: "", value: SelectedUser.numberOfEmployee },
                contDuration: { error: "", value: SelectedUser.contractDuration, label: SelectedUser.contractDuration },
                clientContactName: { error: "", value: SelectedUser.clientContactName },
                clientContactEmail: { error: "", value: SelectedUser.clientContactEmail },
                clientContactTelNo: { error: "", value: SelectedUser.clientContactTelNo },
                accountsContactName: { error: "", value: SelectedUser.accountsContactName },
                accountContactEmail: { error: "", value: SelectedUser.accountContactEmail },
                accountsContactTelNo: { error: "", value: SelectedUser.accountContactTelNo },
                vatRegistration: { error: "", value: SelectedUser.vatRegistration },
                sectorType: { error: "", value: SelectedUser.sectorType, label: SelectedUser.sectorType },
                payMethod: { error: '', value: SelectedUser.creditCard },
                // creditCard
            })
        }
    }, [SelectedUser])

    // **********Drop down start***********
    const conDur: { value: any; label: any; }[] = [];
    contractDuration && contractDuration.length > 0 && contractDuration.forEach((element: { durationID: any; description: any; }) => {
        conDur.push({ value: element.durationID, label: element.description });
    });
    let selectedConDur: { value: any; label: any; } = { value: '', label: '' };
    formState.contDuration.value && conDur.filter(conDurValue => {
        if (conDurValue.value == formState.contDuration.value) {
            return selectedConDur = conDurValue;
        }
    });

    const saleAgent1: { value: any; label: any; }[] = [];
    saleAgents && saleAgents.length > 0 && saleAgents.forEach((element: { agentID: any; agentName: any; }) => {
        saleAgent1.push({ value: element.agentID, label: element.agentName });
    });
    let selectedSaleAge: { value: any; label: any; } = { value: '', label: '' };
    formState.salesPersonAgent.value && saleAgent1.filter(salesPersonAgent => {
        if (salesPersonAgent.value == formState.salesPersonAgent.value) {
            return selectedSaleAge = salesPersonAgent;
        }
    });

    const sectorTypes1: { value: any; label: any; }[] = [];
    sectorTypes && sectorTypes.length > 0 && sectorTypes.forEach((element: { sectorID: any; description: any; }) => {
        sectorTypes1.push({ value: element.sectorID, label: element.description });
    });
    let selectedSectorType: { value: any; label: any; } = { value: '', label: '' };
    formState.sectorType.value && sectorTypes1.filter(sectorType => {
        if (sectorType.value == formState.sectorType.value) {
            return selectedSectorType = sectorType;
        }
    });

    const paymentMethod = [
        { value: "1", label: "Debit Card" },
        { value: "2", label: "Credit Card" },
        { value: "3", label: "Online Banking" },
        { value: "4", label: "Cash" }
    ];

    const paymentType: { value: any; label: any; }[] = [];
    paymentMethod && paymentMethod.length > 0 && paymentMethod.forEach((element: { value: any; label: any; }) => {
        paymentType.push({ value: element.value, label: element.label });
    });
    let selectedPyMeth: { value: any; label: any; } = { value: '', label: '' };
    formState.payMethod.value && paymentType.filter(payValue => {
        if (payValue.value == formState.payMethod.value) {
            return selectedPyMeth = payValue;
        }
    });
        // ****************for temporary uses************
    const accountType = [
        { value: "1", label: "Account Type1" },
        { value: "2", label: "Account Type2" },
        { value: "3", label: "Account Type3" },
        { value: "4", label: "Account Type4" }
    ];
    const ratePlan = [
        { value: "1", label: "Rate Plan1" },
        { value: "2", label: "Rate Plan2" },
        { value: "3", label: "Rate Plan3" },
        { value: "4", label: "Rate Plan4" }
    ];
    const billingType = [
        { value: "1", label: "Billing Type1" },
        { value: "2", label: "Billing Type2" },
        { value: "3", label: "Billing Type3" },
        { value: "4", label: "Billing Type4" },
        { value: "5", label: "Billing Type5" }
    ];

    const acctType: { value: any; label: any; }[] = [];
    accountType && accountType.length > 0 && accountType.forEach((element: { value: any; label: any; }) => {
        acctType.push({ value: element.value, label: element.label });
    });
    let selectedAccMeth: { value: any; label: any; } = { value: '', label: '' };
    formState.payMethod.value && acctType.filter(accValue => {
        if (accValue.value == formState.payMethod.value) {
            return selectedAccMeth = accValue;
        }
    });

    // **********Drop down end***********

    const handleChangeContDur = (option: any) => {
        setSelectedDuration(option);
    }
    const handleChangeSaleAgent = (option: any) => {
        setSelectedSaleAgents(option)
    }

    const handleChangeSectorType = (option: any) => {
        setSelectedSectorTypes(option)
    }

    const handleChangePaymentType = (option: any) => {
        setSelectedPaymentTypes(option)
    }

    const hasFormValueChanged = (model: OnChangeModel): void => {
        setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } })
        dispatch(setUsers({ ...adminCompanyData, [model.field]: model.value }))
    }
    async function createCompanyFun(e: any) {
        e.preventDefault()
        const companyData = {
            companyName: formState.companyName.value,
            address1: formState.address1.value,
            address2: formState.address2.value,
            city: formState.city.value,
            postcode: formState.postcode.value,
            salesPersonAgent: selectedSaleAgents.value,
            companyRegistration: formState.companyRegistration.value,
            numberOfEmployees: formState.numberOfEmployees.value,
            contractDuration: selectedDuration.value,
            clientContactName: formState.clientContactName.value,
            clientContactEmail: formState.clientContactEmail.value,
            clientContactTelNo: formState.clientContactTelNo.value,
            accountsContactName: formState.accountsContactName.value,
            accountContactEmail: formState.accountContactEmail.value,
            accountsContactTelNo: formState.accountsContactTelNo.value,
            vatRegistration: formState.vatRegistration.value,
            sectorType: selectedSectorTypes.value,
            paymentMethod: selectedPaymentTypes.value
        }
        dispatch(setUsers({ ...adminCompanyData, companyData }))
        let result: any = await dispatch(createCompany({ companyData }))
        if (result || result.status == 200) {
            history.push('/customerService/amend-account')
        }
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <Link to="/customerService/amend-account">
                        <div className="back-button" style={{ cursor: 'pointer', marginRight: "10px" }}><i className="fas fa-chevron-left"></i> Go Back</div>
                    </Link>
                    <h1 className="campaign-hdg mb-2 mr-2">Client Registration</h1>
                </div>
                <div className="mt-2"></div>
                <div className="col-lg-12 col-md-10 col-sm-12 mx-auto amend-main my-amend-main ceate-link-main ">
                    <form name="CreateUser" className="createUser">
                        <div className="form-group mb-0">
                            <div className="form-row mt-4">
                                <div className="col-lg-6 col-sm-12 ">
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <div className="">
                                            <TextInput
                                                type="text"
                                                id="companyName"
                                                field="companyName"
                                                value={formState.companyName.value}
                                                onChange={hasFormValueChanged}
                                                required={true}
                                                maxLength={100}
                                                label="Company Name"
                                                placeholder=" "
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="address1"
                                            field="address1"
                                            value={formState.address1.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Address 1"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="address2"
                                            field="address2"
                                            value={formState.address2.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Address 2"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="city"
                                            field="city"
                                            value={formState.city.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="City"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="postcode"
                                            field="postcode"
                                            value={formState.postcode.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Postcode"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Salesperson/Agent</label>
                                        <Select
                                            id="salesPersonAgent"
                                            field="salesPersonAgent"
                                            type="select"
                                            value={{
                                                value: selectedSaleAgents.value,
                                                label: selectedSaleAgents.label
                                            }}
                                            onChange={option => handleChangeSaleAgent(option)}
                                            options={saleAgent1}
                                            required={true}
                                            label="contract Duration"
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="companyRegistration"
                                            field="companyRegistration"
                                            value={formState.companyRegistration.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Company Registration"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="number"
                                            numericality={true}
                                            id="numberOfEmployees"
                                            field="numberOfEmployees"
                                            value={formState.numberOfEmployees.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Number Of Employees"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Contract Duration</label>
                                        <Select
                                            type="select"
                                            id="contractDuration"
                                            field="contractDuration"
                                            value={{
                                                value: selectedDuration.value,
                                                label: selectedDuration.label
                                            }}
                                            onChange={option => handleChangeContDur(option)}
                                            options={conDur}
                                            required={false}
                                            label="contract Duration"
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Rate plan</label>
                                        <Select
                                            id="ratePlan"
                                            field="ratePlan"
                                            type="select"
                                            value={{
                                                value: selectedPaymentTypes.value,
                                                label: selectedPaymentTypes.label
                                            }}
                                            onChange={option => handleChangePaymentType(option)}
                                            options={ratePlan}
                                            required={false}
                                            label="Rate plan"
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-6 col-sm-12 form-group">
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="clientContactName"
                                            field="clientContactName"
                                            value={formState.clientContactName.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Client Contact Name"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="email"
                                            isEmail={true}
                                            id="clientContactEmail"
                                            field="clientContactEmail"
                                            value={formState.clientContactEmail.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Client Contact Email"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="number"
                                            numericality={true}
                                            id="clientContactTelNo"
                                            field="clientContactTelNo"
                                            value={formState.clientContactTelNo.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Client Contact Tel No"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="accountsContactName"
                                            field="accountsContactName"
                                            value={formState.accountsContactName.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Accounts Contact Name"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="email"
                                            isEmail={true}
                                            id="accountContactEmail"
                                            field="accountContactEmail"
                                            value={formState.accountContactEmail.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="Accounts Contact Email"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="number"
                                            numericality={true}
                                            id="accountsContactTelNo"
                                            field="accountsContactTelNo"
                                            value={formState.accountsContactTelNo.value}
                                            onChange={hasFormValueChanged}
                                            required={false}
                                            maxLength={100}
                                            label="Accounts Contact Tel No"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <TextInput
                                            type="text"
                                            id="vatRegistration"
                                            field="vatRegistration"
                                            value={formState.vatRegistration.value}
                                            onChange={hasFormValueChanged}
                                            required={true}
                                            maxLength={100}
                                            label="VAT Registration"
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Sector Type</label>
                                        <Select
                                            id="sectorType"
                                            field="sectorType"
                                            type="select"
                                            value={{
                                                value: selectedSectorTypes.value,
                                                label: selectedSectorTypes.label
                                            }}
                                            onChange={option => handleChangeSectorType(option)}
                                            options={sectorTypes1}
                                            required={true}
                                            label="Sector Type"
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Payment Method</label>
                                        <Select
                                            id="paymentMethod"
                                            field="paymentMethod"
                                            type="select"
                                            value={{
                                                value: selectedPaymentTypes.value,
                                                label: selectedPaymentTypes.label
                                            }}
                                            onChange={option => handleChangePaymentType(option)}
                                            options={paymentType}
                                            required={false}
                                            label="payment Method"
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Account Type</label>
                                        <Select
                                            id="accountType"
                                            field="accountType"
                                            type="select"
                                            value={{
                                                value: selectedPaymentTypes.value,
                                                label: selectedPaymentTypes.label
                                            }}
                                            onChange={option => handleChangePaymentType(option)}
                                            options={accountType}
                                            required={false}
                                            label="Account Type"
                                        />
                                    </div>
                                    <div className="col-lg-12 col-sm-12 form-group">
                                        <label>Billing Type</label>
                                        <Select
                                            id="billingType"
                                            field="billingType"
                                            type="select"
                                            value={{
                                                value: selectedPaymentTypes.value,
                                                label: selectedPaymentTypes.label
                                            }}
                                            onChange={option => handleChangePaymentType(option)}
                                            options={billingType}
                                            required={false}
                                            label="Billing Type"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-10 col-sm-12 mx-auto sign-onbrdg">
                            <div className="d-flex formentry-btns justify-content-between">
                                <Link to="/customerService/companyusers"> <Button variant="secondary" className=" btn btn-back mx-auto">Cancel</Button></Link>
                                <Link to="#">
                                    <Button variant="primary"
                                        disabled={!formState.companyName.value
                                            || !formState.address1.value
                                            || !formState.address2.value
                                            || !formState.city.value
                                            || !formState.postcode.value
                                            || !selectedSaleAgents.label
                                            || !selectedSaleAgents.value
                                            || !formState.companyRegistration.value
                                            || !formState.numberOfEmployees.value
                                            || !selectedDuration.value
                                            || !formState.clientContactName.value
                                            || !formState.clientContactEmail.value
                                            || !formState.clientContactTelNo.value
                                            || !formState.accountsContactName.value
                                            || !formState.accountContactEmail.value
                                            || !formState.accountsContactTelNo.value
                                            || !formState.vatRegistration.value
                                            || !selectedSectorTypes.value
                                            || !selectedPaymentTypes.value
                                        }
                                        onClick={createCompanyFun}
                                        className=" btn btn-next mx-auto"
                                    > Create
                               </Button>
                                </Link>
                            </div>
                        </div>
                    </form>

                </div>

            </div>
            <div className="clearfix">&nbsp;</div>
        </>
    )
}
export default CustServiceNewAccount;