import { IActionBase } from "../models/root.interface";
import { ICampaign } from "../models/campaign.interface";
import {
    SET_LOADER,
    GET_RUN_CARD
} from "../actions/changeCard.actions";

const initialState: ICampaign = {
    isLoading: false,
    runCard: 0,
};

function changeCardReducer(state: ICampaign = initialState, action: IActionBase): ICampaign {
    switch (action.type) {
        case SET_LOADER: {
            return { ...state, isLoading: action.value }
        }
        case GET_RUN_CARD: {
            return { ...state, runCard: action.value }
        }
        default:
            return state;
    }
}

export default changeCardReducer;