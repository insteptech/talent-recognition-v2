//import * as notificationsAction from '../actions/notifications.action';
import { getCookie, setCookie, deleteCookie } from './../../services/cookie';
import lOADERSTART from '../../common/components/loader/index'
import * as api from '../../services/api';
import moment from 'moment';
//import { isTokenExpired, setExpired } from './account.actions';
import { request } from 'http';

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_ERROR = "USER_LOGIN_ERROR";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_CAMPAIGN_SUCCESS = "USER_CAMPAIGN_SUCCESS";
export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const SET_DEPTS_ACCESS = 'SET_DEPTS_ACCESS';
export const IS_USER_LOGGED_IN = 'IS_USER_LOGGED_IN';
export const SET_USER_EXPIRED = 'SET_USER_EXPIRED';
export const USER_FORGOTPASSWORD_SUCCESS = "USER_FORGOTPASSWORD_SUCCESS";
export const USER_RESETPASSWORD_SUCCESS = "USER_RESETPASSWORD_SUCCESS";
export const SET_LOADER_LOGIN = "SET_LOADER_LOGIN";


export function loginSuccess(authResult) {
    return {
        type: USER_LOGIN_SUCCESS,
        access_token: authResult,
    };
}

export function campaignSuccess(campaign) {
    return {
        type: USER_CAMPAIGN_SUCCESS,
        ...campaign,
    };
}

export function loaderRequest(depts) {
    return {
        type: lOADERSTART,
        deptsAccess: depts,
    };
}

export function setDepts(depts) {
    return {
        type: SET_DEPTS_ACCESS,
        deptsAccess: depts,
    };
}

export function setUser(authResult) {
    return {
        type: SET_USER_TOKEN,
        value: authResult,
    };
}

export function isUserLoggedIn(isLogged) {
    return {
        type: IS_USER_LOGGED_IN,
        value: isLogged,
    };
}

export function setExpired() {
    return {
        type: SET_USER_EXPIRED,
        value: true
    }
}

export function appLoad() {
    return dispatch => {
        const userToken = getCookie("access_token");

        dispatch(fitMeAuthorization());

        if (userToken) {
            dispatch(loginSuccess(userToken))
            if (isTokenExpired()) {
                dispatch(setExpired(true))
                dispatch(isUserLoggedIn(false))
            }

            if (userToken && !isTokenExpired()) {
                dispatch(setExpired(false));
                dispatch(setUser(parseInt(true)));
                dispatch(setDepts(getDepts(userToken)))
                dispatch(isUserLoggedIn(true));
            }
        }
    }
}

export function fitMeAuthorization() {
    return dispatch => {
        if (isTokenExpired()) {
            //     dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(setExpired(true));
            dispatch(isUserLoggedIn(false));
            return;
        }
        dispatch(loaderRequest(true));
        deleteCookie("fitMeAuthtoken");
        api.fetchWithoutHeader(`user/usertoken/`)
            .then((response) => {
                if (!request || !request.data || (response.status !== 200)) {
                    dispatch(loaderRequest(false));
                    return;
                }
                const authToken = JSON.parse(response.data);
                setCookie("fitMeAuthToken", authToken.access_token);
                dispatch(loaderRequest(false))
            })
            .catch((error) => {
                dispatch(loaderRequest(false));
            });
    };
}

export function getCampaign(id) {
    return dispatch => {
        if (isTokenExpired()) {
            //     dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Your session has expired, please login again.'));
            dispatch(setExpired(true));
            dispatch(isUserLoggedIn(false));
            return;
        }
        dispatch(loaderRequest(true));
        api.fetchWithoutHeader(`user/GetCompanyInfo/${id}`)
            .then((response) => {
                if (!response || !response.data || (response.status !== 200)) {
                    dispatch(loaderRequest(false));
                    return;
                }
                setCookie("campaignInfo", JSON.stringify(response.data));
                dispatch(campaignSuccess(response.data));
                dispatch(loaderRequest(false));
            })
            .catch((error) => {
                dispatch(loaderRequest(false));
            })
    };
}

export function getIp(item) {
    return dispatch => {
        return api.storeWithoutHeader(`user/SaveCampaign`, item)
            .then((response) => {
                return response.data
            })
            .catch((error) => {

            })
    }
}

export function saveCampaign(item) {
    return dispatch => {
        return api.storeWithoutHeader(`user/SaveCampaign`, item)
            .then((response => {
                return response.data
            }))
            .catch((error) => {

            })
    }
}
export function saveCampaignWizard(item) {
    return dispatch => {
        return api.storeWithoutHeader(`user/SaveCampaign`, item)
            .then((response => {
                return response.data;
            }))
            .catch((error) => {

            })
    }
}

function parseJwt(token) {
    if (!token) return;

    var base64Uri = token.split('.')[1];
    var base64 = base64Uri && base64Uri.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));
    return JSON.parse(jsonPayload);
};

function getDepts(data) {
    const depts = parseJwt(data) && parseJwt(data).pageAccess;
    var deptsList = JSON.stringify(depts);
    var deptsString = new String();
    deptsString = deptsList.toString().replace(/'/g, '');
    var allDepts = eval(deptsString);
    var accessedDepts = allDepts && allDepts.filter(dept => {
        if (Object.value(depts)[0] === 1) {
            return dept
        }
    })
    return accessedDepts;
}

export function getDeptsData(data) {
    const depts = parseJwt(data) && parseJwt(data).pageAccess;
    var deptsList = depts;
    var deptsString = new String();
    deptsString = deptsList.toString().replace(/"/g, '');
    var allDepts = eval(deptsString);
    var accessedDepts = allDepts && allDepts.filter(dept => {
        if (Object.value(depts)[0] === 1) {
            return dept
        }
    })
    return accessedDepts;
}

export function isTokenExpired() {
    const data = getCookie('access_token');
    const profile = parseJwt(data);
    const tokenTimmeStamp = profile ? profile.exp : undefined;
    if (!tokenTimmeStamp) {
        return true;
    }
    const tokenDate = moment.unix(tokenTimmeStamp);
    const tokenDateParsed = moment(tokenDate);

    const currentDate = moment();
    return (tokenDateParsed.diff(currentDate, 'seconds') < 0);
}