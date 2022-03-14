import { get } from "../../services/api";
import { setCookie, getCookie, deleteCookie } from "../../services/cookie";
import * as authAction from './account.actions';

export const SET_LOADER = "SET_LOADER";
export const SET_INVOICE_COUNT = "SET_INVOICE_COUNT";


export function setLoader(type, value) {
    return { type: type, value: value };
}

export function setInvoiceCount(count) {
    return {
        type: SET_INVOICE_COUNT,
        value: count,
    };
}

export function getInvoiceCount() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }

        dispatch(setLoader(SET_LOADER, true));

        get('invoice/getInvoiceCount')
            .then((response) => {
                dispatch(setInvoiceCount(response.data.result.result));
                dispatch(setLoader(SET_LOADER, false));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER, false));
            });
    };
}

export function generateInvoices() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const state = getStore();
        const count = (state && state.invoices) ? state.invoices.invoices.length : 0;
        dispatch(setLoader(SET_LOADER, true));
        return get(`invoice/generateInvoice/${count}`)
            .then((response) => {
                dispatch(getInvoiceCount());
                dispatch(setLoader(SET_LOADER, false));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER, false));
            });
    }
}