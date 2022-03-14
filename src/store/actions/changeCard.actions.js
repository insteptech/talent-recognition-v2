import { get, store } from "../../services/api";
import * as authAction from './account.actions';

export const SET_LOADER = "SET_LOADER";
export const GET_RUN_CARD = "GET_RUN_CARD";


export function setLoader(type, value) {
    return { type: type, value: value };
}

export function GetRunCard(data) {
    return {
        type: GET_RUN_CARD,
        value: data,
    };
}

export function fetchRunCard() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }

        dispatch(setLoader(SET_LOADER, true));

        get('payments/getRunCard')
            .then((response) => {
                dispatch(GetRunCard(response.data));
                dispatch(setLoader(SET_LOADER, false));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER, false));
            });
    };
}

export function chargeCard() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }

        dispatch(setLoader(SET_LOADER, true));
        return store(`payments/chargeCard`)
            .then((response) => {
                dispatch(fetchRunCard());
                dispatch(setLoader(SET_LOADER, false));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER, false));
            });
    }
}
