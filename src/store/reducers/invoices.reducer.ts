import { IActionBase } from "../models/root.interface";
import { ICampaign } from "../models/campaign.interface";
import {
    SET_LOADER,
    SET_INVOICE_COUNT
} from "../actions/invoices.actions";

const initialState: ICampaign = {
    isLoading: false,
    invoices: [],
};

function invoicesReducer(state: ICampaign = initialState, action: IActionBase): ICampaign {
    switch (action.type) {
        case SET_LOADER: {
            return { ...state, isLoading: action.value }
        }
        case SET_INVOICE_COUNT: {
            return { ...state, invoices: action.value }
        }
        default:
            return state;
    }
}

export default invoicesReducer;