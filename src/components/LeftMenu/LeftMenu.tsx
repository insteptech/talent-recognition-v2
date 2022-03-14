import React, { useState, Dispatch } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import logoIcon from "../../assets/logo-icon.png";
import { logOut } from "../../store/actions/account.actions";
import { Dropdown } from 'react-bootstrap'

const LeftMenu: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const history = useHistory();
    const route: any = useSelector((state: IStateType) => state.root.page.area);
    const userInfo: any = useSelector((state: IStateType) => state.account.loginUser);
    const deptsAccess = useSelector((state: IStateType) => state.account.deptsAccess);

    let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);
    let [custServMenu, setCustServMenu] = useState(false)
    let [custServAcc, setCustServAcc] = useState(false)

    const showCustServAcc = (e:any) =>{
        e.preventDefault()
        if(custServAcc == false){
            setCustServAcc(true)
        } else if(custServAcc == true){
            setCustServAcc(false)
        }
    }
    const showCustServMenu = (e:any) =>{
        e.preventDefault()
        if(custServMenu == true){
            setCustServMenu(false)
        } else if( custServMenu == false){
            setCustServMenu(true)
        }
    }

    const  showCustServMenu2 = (e:any) =>{
        e.preventDefault();
        setCustServMenu(true)
    }
    const  showCustServMenu3 = (e:any) =>{
        e.preventDefault();
        setCustServMenu(true)
    }

    function changeLeftMenuVisibility() {
        setLeftMenuVisibility(!leftMenuVisibility);
    }
    function getCollapseClass() {
        return (leftMenuVisibility) ? "" : "collapsed";
    }
    const handleHomeClick = () => {
        history.push('/campaign-dashboard')
    }
    const userLogOut = () => {
        dispatch(logOut());
        history.push('/login');
    }
    const toggleButton = () => {
        changeLeftMenuVisibility()
    }
    const dep1 = deptsAccess.includes('dep1')
    const dep2 = deptsAccess.includes('dep2')
    const dep3 = deptsAccess.includes('dep3')
    const dep4 = deptsAccess.includes('dep4')
    const dep5 = deptsAccess.includes('dep5')
    const dep8 = deptsAccess.includes('dep8');
    const dep9 = deptsAccess.includes('dep9');
    const dep10 = deptsAccess.includes('dep10');
    const depUser = deptsAccess.includes('dep8') || deptsAccess.includes('dep9') || deptsAccess.includes('dep10');
    const dep8andDep10 = dep8 || dep9;

    const campaignButton = (e: any) => {
        if (!dep8andDep10) {
            e.preventDefault()
        }
    }
    const userButton = (e: any) => {
        if (!dep8) {
            e.preventDefault()
        }
    }
    const accountButton = (e: any) => {
        if (!dep10) {
            e.preventDefault()
        }
    }

    const handleAdminClick = (e: any, dep: any) => {
        if (!deptsAccess.includes(dep)) {
            e.preventDefault();
        }
    }

    return (
        <>
            <ul className={`navbar-nav bg-gradient-primary-green sidebar sidebar-dark accordion ${getCollapseClass()}`}
                id="collapseMenu">
                <a className="sidebar-brand d-flex align-items-center justify-content-center" onClick={handleHomeClick}>
                    <div className="sidebar-brand-icon icon-green" onClick={toggleButton}>
                        {userInfo && userInfo.companyLogo ? (
                            <img src={userInfo.companyLogo} alt="" />
                        ) : (
                                <img src={logoIcon} alt="" />
                            )}
                    </div>
                    <div className="sidebar-brand-text mx-3" onClick={toggleButton}>
                        <h4>{userInfo && userInfo.companyName}</h4>
                        <h6>{userInfo && userInfo.given_name}</h6>
                    </div>
                </a>
                <hr className="sidebar-divider my-0" />

                {/* USER DEPARTMENTS */}
                {depUser && (
                    <li className={route === "campaigns" ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                        <Link
                            className={dep8andDep10 === true ? "nav-link" : "nav-link disabledSideBar"}
                            to={`/campaign-dashboard`}
                            onClick={(e) => campaignButton(e)}
                        >
                            <i className="fas fa-fw fa-warehouse"></i>
                            <span>Campaigns</span>
                        </Link>
                    </li>
                )}
                {depUser && (
                    <li className={route === "users" ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                        <Link className={dep8 ? "nav-link" : "nav-link disabledSideBar"} to={`/users`} onClick={(e) => userButton(e)} >
                            <i className="fas fa-fw fa-users"></i>
                            <span>Users</span>
                        </Link>
                    </li>
                )}
                {depUser && (
                    <li className={route === "accounts" ? "nav-item active" : "nav-item"} onClick={toggleButton} >
                        <Link className={dep10 ? "nav-link " : "nav-link disabledSideBar"} to={`/Accounts`} onClick={(e) => accountButton(e)}>
                            <i className="fas fa-pound-sign"></i>
                            <span>Accounts</span>
                        </Link>
                    </li>
                )}
                {/* USER DEPARTMENTS END */}

                {/* ADMIN DEPARTMENTS */}
                {dep1 && (
                    <li className={route === 'pricing' ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                        <Link onClick={(e) => handleAdminClick(e, 'dep1')} className={deptsAccess.includes('dep1') ? "nav-link " : "nav-link disabledSideBar"} to={'/pricing'} >
                            <i className="fas fa-tags"></i>
                            <span>Pricing</span>
                        </Link>
                    </li>
                )}
                {dep2 && (
                <Dropdown className={dep2 ? "nav-item drop-Down-sidebar active " : "nav-item drop-Down-sidebar"} show={custServAcc}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" onClick={ (e:any) => showCustServAcc(e)}>
                        <li className={route === 'accounting' ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                            <Link onClick={(e) => handleAdminClick(e, 'dep2')} to='#'
                                className={deptsAccess.includes('dep2') ? "nav-link " : "nav-link disabledSideBar"}>
                                <i className="fas fa-calculator"></i>
                                <span>Accounting</span>
                            </Link>
                        </li>
                    </Dropdown.Toggle>
                    {dep2 &&
                    (<Dropdown.Menu>
                        <Dropdown.Item href="/accounting/charge-card" className="nav-link " onClick={(e:any) => showCustServMenu3(e)}>
                            <ul className="p-0 sub-menu">
                                <li id="charge-card" onClick={toggleButton}>
                                    <Link to={`/accounting/charge-card`} >
                                        <i className="fas fa-credit-card"></i>
                                        <span>Charge Card</span>
                                    </Link>
                                </li>
                            </ul>
                        </Dropdown.Item>
                    </Dropdown.Menu>)
                    }
                </Dropdown>
                )}
                {dep5 && (
                    <li className={route === "invoicing" ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                        <Link onClick={(e) => handleAdminClick(e, 'dep5')} className={dep5 ? "nav-link " : "nav-link disabledSideBar"} to={`/invoicing`}>
                            <i className="fas fa-file-invoice"></i>
                            <span>Invoicing</span>
                        </Link>
                    </li>
                )}
                {dep3 && (
                <Dropdown className={dep3 ? "nav-item drop-Down-sidebar active " : "nav-item drop-Down-sidebar"}  show={custServMenu}  >
                    <Dropdown.Toggle variant="success" id="dropdown-basic" onClick={(e:any) => showCustServMenu(e)}>
                        <li className={route === 'customer-service' ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                            <Link onClick={(e) => handleAdminClick(e, 'dep3')} to="#"
                                className={deptsAccess.includes('dep3') ? "nav-link " : "nav-link disabledSideBar"}>
                                <i className="fas fa-headphones-alt"></i>
                                <span>Cust. Service</span>
                            </Link>
                        </li>
                    </Dropdown.Toggle>
                    {dep3 && (
                    <Dropdown.Menu >
                         <Dropdown.Item href="/customerService/company-list" className= "nav-link " id="CSLeftMenuD" onClick={(e:any) => showCustServMenu2(e)}>
                            <ul className="p-0 sub-menu">
                                <li id="new-account" onClick={toggleButton}>
                                    <Link to="/customerService/company-list" id="CSLeftMenu" >
                                        <i className="fas fa-fw fa-warehouse"></i>
                                        <span>Company List</span>
                                    </Link>
                                </li>
                            </ul>
                        </Dropdown.Item>
                        <Dropdown.Item href="/customerService/amend-account" className="nav-link" id="CSLeftMenuD"  onClick={(e:any) => showCustServMenu2(e)} >
                            <ul className="p-0 sub-menu" >
                                <li className={route === "/customerService/amend-account" ? "nav-item active" : "nav-item"} id="amend-account" onClick={toggleButton}>
                                    <Link to={`/customerService/amend-account`} id="CSLeftMenu" >
                                        <i className="fas fa-user-edit"></i>
                                        <span>Amend Account</span>
                                    </Link>
                                </li>
                            </ul>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    )}
                </Dropdown>
                )}
                {dep4 && (
                    <li className={route === 'agents' ? "nav-item active" : "nav-item"} onClick={toggleButton}>
                        <Link onClick={(e) => handleAdminClick(e, 'dep4')} to='/agents' className={deptsAccess.includes('dep4') ? "nav-link " : "nav-link disabledSideBar"}>
                            <i className="fa fa-user-secret"></i>
                            <span>Agent</span>
                        </Link>
                    </li>
                )}

                {/* ADMIN DEPARTMENTS END */}
                <li className="nav-item">
                    <Link className="nav-link" data-toggle="modal" data-target="#logoutModal" to={`/login`} onClick={userLogOut} >
                        <i className="fas fa-fw fa-lock"></i>
                        <span>Logout</span>
                    </Link>
                </li>

                <div className="left-menus-footer">
                    <div className="logo-image-footer"></div>
                    <p className="ftr-copyright-text">Copyright © Talent Recognition Ltd | 2020</p>
                </div>

            </ul>
            <div className="toggle-area">
                <button className="btn btn-primary toggle-button" onClick={() => changeLeftMenuVisibility()}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </ >
    );
};
export default LeftMenu;