import React, { Fragment } from "react";
import { useLocation } from 'react-router-dom';
import LeftMenu from "../LeftMenu/LeftMenu";
import { Switch, Route } from "react-router";
import Users from "../Users/Users";
import Products from "../Products/Products";
import CampaignApplications from "../CampaignApplications/CampaignApplications";
import Accounts from "../Accounts/Accounts";
import CreateCampaign from "../CreateCampaign/CreateCampaign";
import CandidateWizard from '../CandidateWizard/CandidateWizard';
import Signup from "../onboardingWizard/signup/index";
import ForgetPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
import ConfirmSignup from '../onboardingWizard/ConfirmSignup/ConfirmSignup'
import Authorized from "../NotAuthorized";
import TopMenu from '../TopMenu/TopMenu';
import Invoices from "../Invoices/Invoices";
import ChangeCard from "../Accounting/ChargeCard/ChargeCard";
import Pricing from "../Pricing/Pricing";
import CustServiceNewAccount from "../CustService/NewAccount/NewAccount";
import CustServiceAmendAccount from '../CustService/AmendAccount/AmendAccount';
import CompanyAccount from '../CustService/AmendAccount/AccountCompanyAccount/AmendCompanyAccount';
import CompanyUsers from '../CustService/AmendAccount/CompanyUsers/CompanyUsers';
import CompanyCampaign from '../CustService/AmendAccount/CompanyCampaign/CompanyCampaign';
import CSCreateCampaign from '../CustService/AmendAccount/CompanyCampaign/CompanyCreateCampaign';
import CSCompanylist from '../CustService/AmendAccount/CompanyUsers/CompanyList';
import Agent from "../Agent/Agent";

const Admin: React.FC = () => {
  const location = useLocation();
  const contentWrapperConflict = location.pathname.includes("/candidateWizard")
    || location.pathname.includes("/signup")
    || location.pathname.includes("/forgetPassword")
    || location.pathname.includes("/resetpassword")
    || location.pathname.includes('/confirm')
  return (
    <Fragment>
      {/* <Notifications /> */}
      {location && location.pathname
        && !location.pathname.includes("/candidateWizard")
        && !location.pathname.includes("/signup")
        && !location.pathname.includes("/forgetPassword")
        && !location.pathname.includes("/resetpassword")
        && !location.pathname.includes('/confirm')
        && (<LeftMenu />)}

      {/* <ModalContainer /> */}
      <div id="content-wrapper" className="d-flex flex-column" style={{ marginLeft: contentWrapperConflict ? `0px` : `-40px` }}>
        <div id="content">
          <TopMenu />
          <div className="height-40"></div>
          <div className="container-fluid">
            <Switch>
              <Route exact path={`/`} ><Products /></Route>
              <Route path={`/campaign-dashboard`} ><Products /></Route>
              <Route path={`/users`} ><Users /></Route>
              <Route path={`/users/:id`} ><Users /></Route>
              <Route path={`/CreateCampaign`} ><CreateCampaign /></Route>
              <Route path={`/CreateCampaign/{id}`} ><CreateCampaign /></Route>
              <Route path={`/Accounts`} ><Accounts /></Route>
              <Route path={`/candidateWizard/:id`} ><CandidateWizard /></Route>
              <Route path={`/CampaignApplications`} ><CampaignApplications /></Route>
              <Route path={`/signup`} ><Signup /></Route>
              <Route path={`/forgetPassword`} ><ForgetPassword /></Route>
              <Route path={`/resetpassword/:token`}><ResetPassword /></Route>
              <Route path={`/confirm/:token`}><ConfirmSignup /></Route>
              <Route path={`/unauthorized`}><Authorized /></Route>
              <Route path={`/pricing`}><Pricing /></Route>
              <Route path={`/accounting/charge-card`}><ChangeCard /></Route>
              <Route path={`/invoicing`} ><Invoices /></Route>
              <Route path={'/customerService/company-list'}><CSCompanylist /></Route>
              <Route path={'/customerService/new-account'}><CustServiceNewAccount /></Route>
              <Route path={'/customerService/amend-account'}><CustServiceAmendAccount /></Route>
              <Route path={'/customerService/useraccount'}> <CompanyAccount /> </Route>
              <Route path={'/customerService/companycampaign'}> <CompanyCampaign /> </Route>
              <Route path={`/customerService/companyusers`}><CompanyUsers /></Route>
              <Route path={`/customerService/createCampaign`}><CSCreateCampaign /></Route>
              <Route path={`/customerService/createCampaign/:id`}><CSCreateCampaign /></Route>
              <Route path={`/agents`}><Agent /></Route>

            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Admin;