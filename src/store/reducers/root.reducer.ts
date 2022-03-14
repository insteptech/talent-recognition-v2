import { combineReducers, Reducer } from "redux";
import { reducer as formReducer } from 'redux-form';

import { UPDATE_CURRENT_PATH } from "../actions/root.actions";
import { IRootStateType, IActionBase, IStateType } from "../models/root.interface";
import productsReducer from "./products.reducer";
import campaignReducer from "./campaign.reducer";
import notificationReducer from "./notification.reducer";
import userReducer from "./users.reducer";
import orderReducer from "./order.reducer";
import accountReducer from "./account.reducer";
import { login } from "../actions/account.actions";
import modalReducer from "./modal.reducer";
import onBoardingWizardReducer from "./onboardingWizard.reducer";
import invoicesReducer from './invoices.reducer';
import changeCardReducer from './changeCard.reducer';
import {adminReducer} from './admin.reducer';
import CSproductsReducer from './custService/custServiceProduc.reducer'
import custServiceReducer from './custService/custService.reducer'
import custServiceCampaignReducer from './custService/custServiceCampaign.reducer';

const initialState: IRootStateType = {
    page: { area: "home", subArea: "" }
};

function rootReducer(state: IRootStateType = initialState, action: IActionBase): IRootStateType {
    switch (action.type) {
        case UPDATE_CURRENT_PATH:
            return { ...state, page: { area: action.area, subArea: action.subArea } };
        default:
            return state;
    }
}

const rootReducers: Reducer<IStateType> = combineReducers({
    root: rootReducer,
    products: productsReducer,
    notifications: notificationReducer,
    users: userReducer,
    orders: orderReducer,
    account: accountReducer,
    modals: modalReducer,
    form: formReducer,
    campaign: campaignReducer,
    onboardingWizard: onBoardingWizardReducer,
    invoices: invoicesReducer,
    changeCard: changeCardReducer,
    admin: adminReducer,
    custService: custServiceReducer,
    custServiceProduct:CSproductsReducer,
    custServiceCampaign : custServiceCampaignReducer,
});



export default rootReducers;