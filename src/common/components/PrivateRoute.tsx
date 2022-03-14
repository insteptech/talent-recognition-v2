import { Route, RouteProps } from "react-router";
import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useLocation } from 'react-router-dom';
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import Login from "../../components/Account/Login";
import Authorized from "../../components/NotAuthorized";

export function PrivateRoute({ children, ...rest }: RouteProps): JSX.Element {
    const deptsAccess = useSelector((state: IStateType) => state.account.deptsAccess);
    const dep1 = deptsAccess.includes('dep1');
    const dep2 = deptsAccess.includes('dep2')
    const dep3 = deptsAccess.includes('dep3')
    const dep4 = deptsAccess.includes('dep4')
    const dep5 = deptsAccess.includes('dep5')
    const dep8 = deptsAccess.includes('dep8')
    const dep9 = deptsAccess.includes('dep9')
    const dep10 = deptsAccess.includes('dep10')
    const dep8OrDep9 = dep8 || dep9;
    const depUser = dep8 || dep9 || dep10;

    let root = rest?.location?.pathname
    let isUserAcces = true;
    
    if (root == '/') {
        if (depUser) {
            isUserAcces = true
        } else {
            isUserAcces = false
        }
    } else if (root == '/campaign-dashboard') {
        if (dep8OrDep9) {
            isUserAcces = true
        } else {
            isUserAcces = false
        }
    }
    else if (root == '/users') {
        if (dep8) {
            isUserAcces = true;
        }
        else {
            isUserAcces = false
        }
    } else if (root == '/Accounts') {
        if (dep10) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/CreateCampaign') {
        if (dep9 || dep8) {
            isUserAcces = true;
        }
        else {
            isUserAcces = false
        }
    } else if (root == '/invoicing') {
        if (dep5) {
            isUserAcces = true;
        }
        else {
            isUserAcces = false
        }
    } else if (root == '/pricing') {
        if (dep1) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/accounting/charge-card') {
        //isUserAcces = true;
        if (dep2) {
            isUserAcces = true;
        }
        else {
            isUserAcces = false
        }
    } else if (root == '/customerService/company-list') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/customerService/new-account') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/customerService/amend-account') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }  
    } else if (root == '/customerService/useraccount') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        } 
    } else if (root == '/customerService/companyusers') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/customerService/companycampaign') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/customerService/createCampaign') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        } 
    } else if (root == '/agents') {
        if (dep4) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if (root == '/admin-company') {
        if (dep3) {
            isUserAcces = true;
        } else {
            isUserAcces = false
        }
    } else if( root === '/admin-users'){
        if(dep3){
            isUserAcces = true;
        } else{
            isUserAcces = false
        }
    } 
    else {
        isUserAcces = true
    }

    const account: IAccount = useSelector((state: IStateType) => state.account);
    const location = useLocation();
    const isCandidateWizard = location && location.pathname && location.pathname.includes("/candidateWizard");
    const isSignUp = location && location.pathname && location.pathname.includes("/signup");
    const isForgetPassword = location && location.pathname && location.pathname.includes("/forgetPassword");
    const isResetPassword = location && location.pathname && location.pathname.includes('/resetpassword');
    const isConfirmAccount = location && location.pathname && location.pathname.includes('/confirm')
    let firstCond = (!_.isEmpty(account.token) && !account.isExpired || isCandidateWizard || isSignUp || isForgetPassword || isResetPassword || isConfirmAccount);

    return (
        <Route
            {...rest}
            render={() =>
                (firstCond) ?
                    isUserAcces ? (children) : <Authorized /> : <Login />
            }
        />
    );
}