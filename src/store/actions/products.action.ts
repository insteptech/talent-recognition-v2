import { IProduct, ProductModificationStatus } from "../models/product.interface";
import * as authAction from '../actions/account.actions';
import * as notificationsAction from '../actions/notifications.action';
import { store } from "../../services/api";
import { getCampaignResult } from "../actions/campaign.actions";

export const ADD_PRODUCT: string = "ADD_PRODUCT";
export const EDIT_PRODUCT: string = "EDIT_PRODUCT";
export const REMOVE_PRODUCT: string = "REMOVE_PRODUCT";
export const CHANGE_PRODUCT_AMOUNT: string = "CHANGE_PRODUCT_AMOUNT";
export const CHANGE_PRODUCT_PENDING_EDIT: string = "CHANGE_PRODUCT_PENDING_EDIT";
export const CLEAR_PRODUCT_PENDING_EDIT: string = "CLEAR_PRODUCT_PENDING_EDIT";
export const SET_MODIFICATION_STATE: string = "SET_MODIFICATION_STATE";
export const SET_LOADER_CAMPAIGNS: string = "SET_LOADER_CAMPAIGNS";
export const SET_CAMPAIGNS: string = "SET_CAMPAIGNS";
export const SET_LOADER_CAMPAIGN_APPLICATION: string = "SET_LOADER_CAMPAIGN_APPLICATION";

export function addProduct(product: IProduct): IAddProductActionType {
    return { type: ADD_PRODUCT, product: product };
}

export function editProduct(product: IProduct): IEditProductActionType {
    return { type: EDIT_PRODUCT, product: product };
}

export function removeProduct(id: number): IRemoveProductActionType {
    return { type: REMOVE_PRODUCT, id: id };
}

export function changeProductAmount(id: number, amount: number): IChangeProductAmountType {
    return { type: CHANGE_PRODUCT_AMOUNT, id: id, amount: amount };
}

export function changeSelectedProduct(product: IProduct): IChangeSelectedProductActionType {
    return { type: CHANGE_PRODUCT_PENDING_EDIT, product: product };
}

export function clearSelectedProduct(): IClearSelectedProductActionType {
    return { type: CLEAR_PRODUCT_PENDING_EDIT };
}

export function setModificationState(value: ProductModificationStatus): ISetModificationStateActionType {
    return { type: SET_MODIFICATION_STATE, value: value };
}

export function setLoader(type: string, value: boolean): ISetLoaderActionType {
    return { type: type, value: value };
}

export function setCampaigns(campaigns: any) {
    return {
        type: SET_CAMPAIGNS,
        value: campaigns,
    };
}

export function fetchCampaigns(pageInfo: any) {
    
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.addNotification('Error', 'Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            //return;
        }
        dispatch(setLoader(SET_LOADER_CAMPAIGNS, true));
        
        return store(`campaigns/dashboard`, pageInfo)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_CAMPAIGNS, false));
                dispatch(setCampaigns(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_CAMPAIGNS, false));
                return error;
            });
    };
}

export function closeCampaign(data: any) {
    return (dispatch: (arg0: (dispatch: (arg0: any) => void, getStore: any) => Promise<any>) => void, getStore: () => any) => {
        
        const state = getStore();
        const pageInfo = {
            "PageNumber": 1,
            "PageSize": 10,
            "active": 1
        }
        return store(`campaigns/close`, data)
            .then((response) => {
                dispatch(fetchCampaigns(pageInfo));
                return response;
            })
            .catch((error) => {
            });
    };
}

export function selectCandidate(data: any, id?: any, key?: any) {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            
        return;
        } 
        const state = getStore();
        const pageInfo = {
            "PageNumber": 1,
            "PageSize": 10,
            "active": key,
            "id": id
        }
        dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, true));
        return store(`campaigns/selectCandidate`, data)
            .then((response) => {
                // dispatch(fetchCampaigns(pageInfo));
                dispatch(getCampaignResult(pageInfo));
                dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, false));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, false));
            });
    };
}

export function hideCandidate(data: any, id?: any, key?: any) {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            
        return;
        } 
        const state = getStore();
        const pageInfo = {
            "PageNumber": 1,
            "PageSize": 10,
            "active": key,
            "id": id
        }
        dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, true));
        return store(`campaigns/hideCandidate`, data)
            .then((response) => {
                // dispatch(fetchCampaigns(pageInfo));
                dispatch(getCampaignResult(pageInfo));
                dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, false));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_CAMPAIGN_APPLICATION, false));
            });
    };
}

interface IAddProductActionType { type: string, product: IProduct };
interface IEditProductActionType { type: string, product: IProduct };
interface IRemoveProductActionType { type: string, id: number };
interface IChangeSelectedProductActionType { type: string, product: IProduct };
interface IClearSelectedProductActionType { type: string };
interface ISetModificationStateActionType { type: string, value: ProductModificationStatus };
interface IChangeProductAmountType { type: string, id: number, amount: number };
interface ISetLoaderActionType { type: string, value: boolean };
