import { IActionBase } from "../../models/root.interface";
import  ICSCampaign  from "../../models/custServiceCampaign.interface";
import {
    SET_CAMPAIGN_INPROCESS_ID,
    SET_LOADER_CREATE_CAMPAIGN,
    SET_CAMPAIGN_MODE,
    SET_CAMPAIGN_DATA,
    SET_CAMPAIGN_ROLES,
    SET_CAMPAIGN_MBTI,
    SET_CAMPAIGN_PREFERENCES,
    SET_CAMPAIGN_PROCESSROLESELECTED,
    SET_PRE_SPEND_RATIO,
    SET_CAMPAIGN_RESULT,
    SET_SELECTED_CAMPAIGN_DETAIL,
    SET_CAMPAIGN_DETAILS,
    USER_CAMPAIGN_SUCCESS,
    SET_LOADER_SELECTED_CAMPAIGN,
    SET_USER_CAMPAIGN_ID,
    CAMERA_SELFIE_UPLOAD_SUCCESS,
    RETURN_SELFIE,
    THANK_YOU,
    CAMPAIGN_COMPLETED,
    SET_EXTRAVERSION,
    CAMERA_SELFIE_NOT_FOUND,
    UPDATE_CAMPAIGN_TYPE,
} from "../../actions/CustService/custServiceCampaign.action";

const initialState: ICSCampaign = {
    id: null,
    campaignLoader: false,
    isEditMode: false,
    campaign: {
        campaignType: 1,
    },
    roles: [],
    mbti: [],
    preferences: [],
    processRole: [],
    mbtiLoader: false,
    preSpendRatio: {},
    campaignResult: [],
    selectedCampaignDetails: {},
    selectCampaign: {},
    selectCampaignLoader: false,
    userId: null,
    upload: {},
    returnScreen: false,
    thankYou: false,
    completed: false,
    extraversion: [],
};


function custServiceCampaignReducer(state: ICSCampaign = initialState, action: IActionBase): ICSCampaign {
    switch (action.type) {
        case SET_CAMPAIGN_INPROCESS_ID: {
            return { ...state, id: action.value };
        }
        case SET_LOADER_CREATE_CAMPAIGN: {
            return { ...state, campaignLoader: action.value };
        }
        case SET_CAMPAIGN_MODE: {
            return { ...state, isEditMode: action.value };
        }
        case SET_CAMPAIGN_DATA: {
            return { ...state, campaign: action.value };
        }
        case SET_CAMPAIGN_ROLES: {
            return { ...state, roles: action.value };
        }
        case SET_CAMPAIGN_MBTI: {
            return { ...state, mbti: action.value };
        }
        case SET_CAMPAIGN_MBTI: {
            return { ...state, mbtiLoader: action.value };
        }
        case SET_CAMPAIGN_PREFERENCES: {
            return { ...state, preferences: action.value }
        }
        case SET_CAMPAIGN_PROCESSROLESELECTED: {
            return { ...state, processRole: action.value }
        }
        case SET_PRE_SPEND_RATIO: {
            return { ...state, preSpendRatio: action.value };
        }
        case SET_CAMPAIGN_RESULT: {
            return { ...state, campaignResult: action.value };
        }
        case SET_SELECTED_CAMPAIGN_DETAIL: {
            return { ...state, selectedCampaignDetails: action.value };
        }
        case SET_CAMPAIGN_DETAILS: {
            return { ...state, campaign: action.value };
        }
        case USER_CAMPAIGN_SUCCESS: {
            return { ...state, selectCampaign: action.value };
        }
        case SET_LOADER_SELECTED_CAMPAIGN: {
            return { ...state, selectCampaignLoader: action.value };
        }
        case SET_USER_CAMPAIGN_ID: {
            return { ...state, userId: action.value };
        }
        case CAMERA_SELFIE_UPLOAD_SUCCESS: {
            return { ...state, upload: action.value };
        }
        case CAMERA_SELFIE_NOT_FOUND:{
            return {...state, error: action.value}
        }
        case RETURN_SELFIE: {
            return { ...state, returnScreen: action.value };
        }
        case THANK_YOU: {
            return { ...state, thankYou: action.value };
        }
        case CAMPAIGN_COMPLETED: {
            return { ...state, completed: action.value };
        }
        case SET_EXTRAVERSION: {
            return { ...state, extraversion: action.value };
        }
        case UPDATE_CAMPAIGN_TYPE: {
            return { ...state, page: action.value}
        }
        default:
            return state;
    }
}


export default custServiceCampaignReducer;