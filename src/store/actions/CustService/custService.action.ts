import { IUser } from "../../models/user.interface";
import * as authAction from '../../actions/account.actions';
import { storeCS, getCS } from '../../../services/apiCS'

export const ADD_ADMIN: string = "ADD_ADMIN";
export const REMOVE_ADMIN: string = "REMOVE_ADMIN";
export const SET_LOADER_USERS: string = "SET_LOADER_USERS";
export const SET_USERS: string = "SET_USERS";
export const SET_LOADER_ACCOUNTS: string = "SET_LOADER_ACCOUNTS";
export const SET_ACCOUNTS: string = "SET_ACCOUNTS";
export const SET_ACCOUNT_INFO: string = "SET_ACCOUNT_INFO";
export const SET_PAYMENT_METHOD: string = "SET_PAYMENT_METHOD";
export const SET_SELECTED_USER: string = "SET_SELECTED_USER";
export const SET_SUCCESS_PAYMENT_METHOD: string = "SET_SUCCESS_PAYMENT_METHOD";
export const SET_ERROR_PAYMENT_METHOD: string = "SET_ERROR_PAYMENT_METHOD";
export const SET_INVOICES: string = "SET_INVOICES";

export function addAdmin(user: IUser): IAddAdminActionType {
    return { type: ADD_ADMIN, user: user };
}

export function removeAdmin(user: IUser): IRemoveAdminActionType {
    return { type: REMOVE_ADMIN, user: user };
}

export function setLoader(type: string, value: boolean): ISetLoaderActionType {
    return { type: type, value: value };
}

export function setUsers(users: any) {
    return {
        type: SET_USERS,
        value: users,
    };
}

export function setAccounts(accounts: any) {
    return {
        type: SET_ACCOUNTS,
        value: accounts,
    };
}

export function setInvoices(invoices: any) {
    return {
        type: SET_INVOICES,
        value: invoices,
    };
}

export function setAccountInfo(account: any) {
    return {
        type: SET_ACCOUNT_INFO,
        value: account,
    };
}

export function setPaymentMethod(payment: any) {
    // payment = [0]
    return {
        type: SET_PAYMENT_METHOD,
        value: payment,
    };
}

export function setSelectedUser(data: any) {
    return {
        type: SET_SELECTED_USER,
        value: data,
    };
}
export function setPaymentSuccess(data: any) {
    return {
        type: SET_SUCCESS_PAYMENT_METHOD,
        value: data,
    };
}

export function setPaymentError(data: any) {
    return {
        type: SET_ERROR_PAYMENT_METHOD,
        value: data,
    };
}
export function fetchUsers(pageInfo: any) {
    return (dispatch: (arg0: any) => void) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return storeCS(`userdash/getuserdash`, pageInfo)
        // return storeCS(`User/GetClients`, pageInfo)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(setUsers(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function fetchAccounts(pageInfo: any) {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_ACCOUNTS, true));
        return storeCS(`accountingdash/getAccountingDash`, pageInfo)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                dispatch(setAccounts(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                return error;
            });
    };
}

export function fetchAccountInfo() {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));

            return;
        }
        dispatch(setLoader(SET_LOADER_ACCOUNTS, true));
        return getCS(`accountingdash/getAccountInfo`)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                dispatch(setAccountInfo(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                return error;
            });
    };
}

export function fetchPaymentMethod() {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_ACCOUNTS, true));
        return getCS(`payments/getpaymentmethod`)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                dispatch(setPaymentMethod(response.data));
                let cCardNo = response.data
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                return error;
            });
    };
}

export function createUser(userData: any) {
    return (dispatch: (arg0: any) => void) => {
        const pageInfo = { "PageNumber": 1, "PageSize": 6, "active": 1 };
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return storeCS(`userdash/createUser`, userData)
            .then((response: any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(fetchUsers(pageInfo));
                return response;
            })
            .catch((error: any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function getUserDetail(userIndex: any) {
    return (dispatch: (arg0: ISetLoaderActionType) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return getCS(`userdash/getUserDetail/${userIndex}`)
            .then((response: { data: { result: any; }; }) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(setSelectedUser(response.data.result));
                let selUser = response.data.result
                return response;
            })
            .catch((error: any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function updateUser(userData: any) {
    return (dispatch: (arg0: any) => void) => {
        const pageInfo = { "PageNumber": 1, "PageSize": 6, "active": 1 };
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return storeCS(`userdash/updateUser`, userData)

            .then((response: any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(fetchUsers(pageInfo));
                return response;
            })
            .catch((error: any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function closeUser(userData: any) {
    return (dispatch: (arg0: any) => void) => {
        const pageInfo = { "PageNumber": 1, "PageSize": 6, "active": 1 };
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));

            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return storeCS(`userdash/closeUser`, userData)
            .then((response:any) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(fetchUsers(pageInfo))
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function addPaymentMethod(card: any) {
    return (dispatch: (arg0: ISetLoaderActionType) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));

            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return storeCS(`payments/addpaymentmethod`, card)
            .then((response:any) => {
                dispatch(setLoader(SET_LOADER_USERS, true));
                if (response.data === 1) {
                    dispatch(setPaymentSuccess(response.data))
                } else {
                    dispatch(setPaymentError(response.data.message));
                }
                return response.data;
            })
            .catch((error:any) => {
                dispatch(setLoader(SET_LOADER_USERS, true));
            });
    };
}

export function fetchInvoices(pageInfo: any) {
    return (dispatch: (arg0: any) => void, getStore: any) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));

            return;
        }
        dispatch(setLoader(SET_LOADER_ACCOUNTS, true));
        return storeCS(`accountingdash/getInvoiceDash`, pageInfo)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                dispatch(setInvoices(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ACCOUNTS, false));
                return error;
            });
    };
}

interface IAddAdminActionType { type: string, user: IUser };
interface IRemoveAdminActionType { type: string, user: IUser };
interface ISetLoaderActionType { type: string, value: boolean };
