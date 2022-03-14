import {
    GET_RUN_CARD,
    SET_LOADER_ADMIN_DAHBOARD,
    SET_LOADER_ADMIN_USERS,
    SET_ADMIN_USERS,
    SET_LOADER_CREATE_ADMIN_USER,
    SET_LOADER_FETCH_USERS,
    SET_USERS,
    SET_LOADER_USERS,
    SET_SECTOR_TYPES,
    SET_SALES_AGENTS,
    SET_CONTRACT_DURATION,
    SET_SELECTED_USER_DETAILS,
    SET_SELECTED_USER
} from '../types/adminCompany';
import * as api from "../../services/api";
import {setCookie} from '../../services/cookie';
import * as authAction from './account.actions';

export function GetRunCard(data) {
    return {
        type: GET_RUN_CARD,
        value: data,
    };
}

export function setLoader(type, data) {
    return {
        type: type,
        value: data,
    };
}

export function setAdminUsers(adminUsers) {
    return {
        type: SET_ADMIN_USERS,
        value: adminUsers,
    };
}

export function setUsers(Users) {
    //  Users = ''  //to check
    return {
        type: SET_USERS,
        value: Users,
    };
}

export function setData(type, data) {
    return {
        type: type,
        value: data,
    };
}
export function setSelectedUser(data) {
    return {
        type: SET_SELECTED_USER,
        value: data,
    };
}

export function fetchRunCard() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }

        dispatch(setLoader(SET_LOADER_ADMIN_DAHBOARD, true));
        return api.get(`payments/getRunCard`)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ADMIN_DAHBOARD, false));
                dispatch(GetRunCard(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ADMIN_DAHBOARD, false));
                return error;
            });
    };
}

export function fetchAdminUsers(pageInfo) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_ADMIN_USERS, true));
        return api.store(`userdash/getAdminUsers`, pageInfo)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                dispatch(setAdminUsers(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                return error;
            });
    };
}

export function createAdminUser(adminUserData) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_ADMIN_USERS, true));
        return api.store(`userdash/createAdminUser`, adminUserData)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                dispatch(fetchAdminUsers({
                    "PageNumber": 1,
                    "PageSize": 6,
                    "SearchText": '',
                }));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                return error;
            });
    };
}

export function updateAdminUser(userData) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_ADMIN_USERS, true));
        return api.store(`userdash/updateAdminUser`, userData)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                dispatch(fetchAdminUsers({
                    "PageNumber": 1,
                    "PageSize": 6,
                    "SearchText": '',
                }));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_ADMIN_USERS, false));
                return error;
            });
    };
}

export function fetchUsers(pageInfo) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_FETCH_USERS, true));
        return api.store(`User/GetClients`, pageInfo)
            .then((response) => {
                //console.log('get clients', response.data)
                dispatch(setLoader(SET_LOADER_FETCH_USERS, false));
                dispatch(setUsers(response.data));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_FETCH_USERS, false));
                return error;
            });
    };
}

export function createCompany(UserData) {
    //console.log('CS company data creation in action', UserData.companyData)
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return api.store(`User/AddUpdateClient`, UserData.companyData)
            .then((response) => {
    //console.log('CS company data creation api response', response.data)

                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(fetchUsers({
                    "PageNumber": 1,
                    "PageSize": 6,
                    "SearchText": '',
                }));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}
export function updateUser(userData) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_USERS, true));
        return api.store(`userdash/updateAdminUser`, userData)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                dispatch(fetchAdminUsers({
                    "PageNumber": 1,
                    "PageSize": 6,
                    "SearchText": '',
                }));
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_USERS, false));
                return error;
            });
    };
}

export function fetchGetContractDuration() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        return api.get(`User/GetContractDuration`)
            .then((response) => {
                dispatch(setData(SET_CONTRACT_DURATION, response.data));
                return response;
            })
            .catch((error) => {
                return error;
            });
    };
}

export function fetchGetSalesAgents() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        return api.get(`User/GetSalesAgents`)
            .then((response) => {
                dispatch(setData(SET_SALES_AGENTS, response.data));
                return response;
            })
            .catch((error) => {
                return error;
            });
    };
}

export function fetchGetSectorTypes() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        return api.get(`User/GetSectorTypes`)
            .then((response) => {
                dispatch(setData(SET_SECTOR_TYPES, response.data));
                return response;
            })
            .catch((error) => {
                return error;
            });
    };
}

export function loginAsClient(userIndex) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        return api.store(`auth/LoginAsClient`, userIndex)
            .then((response) => {
            setCookie('company_token', response.data.value)
                return response;
            })
            .catch((error) => {
                // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('User not found.'));
                return error;
            });
    };
}

export function fetchSelectedUserDetails(index) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            //dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        // return api.get(`userdash/getUserDetail/${index}`)
        return api.get(`User/GetClientDetail/${index}`)
            .then((response) => {
                dispatch(setSelectedUser(response.data))
                dispatch(fetchAdminUsers({
                    "PageNumber": 1,
                    "PageSize": 6,
                    "SearchText": '',
                }));
                return response;
            })
            .catch((error) => {
                return error;
            });
    };
}