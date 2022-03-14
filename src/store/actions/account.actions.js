import { storeWithoutHeader, fetchWithoutHeader } from "../../services/api";
import { setCookie, getCookie, deleteCookie } from "../../services/cookie";
import * as api from '../../services/api';
import moment from 'moment';

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const LOGIN_LOADER = "LOGIN_LOADER";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const IS_USER_LOGGED_IN = "IS_USER_LOGGED_IN";
export const SET_DEPTS_ACCESS = "SET_DEPTS_ACCESS";
export const SET_USER_EXPIRED = "SET_USER_EXPIRED";
export const lOADERSTART = "lOADERSTART";
export const USER_FORGOTPASSWORD_SUCCESS = "USER_FORGOTPASSWORD_SUCCESS";
export const USER_RESETPASSWORD_SUCCESS = "USER_RESETPASSWORD_SUCCESS";

export function login(email) {
    return { type: LOG_IN, email: email };
}

export function logout() {
    return { type: LOG_OUT };
}

export function setLoader(type, value) {
    return { type: type, value: value };
}

export function loginSuccess(authResult) {
    return { type: USER_LOGIN_SUCCESS, access_token: authResult };
}

export function setUser(authResult) {
    return { type: SET_USER_TOKEN, value: authResult };
}

export function isUserLoggedIn(isLogged) {
    return { type: IS_USER_LOGGED_IN, value: isLogged };
}

export function setDepts(depts) {
  //export function setDepts() {
    //   var depts = ['dep8', 'dep9', 'dep10']
  //var depts = ['dep9','dep1','dep2','dep3','dep4','dep5','dep8', 'dep10',]
    return { type: SET_DEPTS_ACCESS, deptsAccess: depts };
}

export function setExpired(value) {
    return { type: SET_USER_EXPIRED, value: value };
}

export function loaderRequest(req) {
    return {
        type: lOADERSTART,
        value: req,
    };
}

export function forgotPasswordSuccess(data) {
    return {
        type: USER_FORGOTPASSWORD_SUCCESS,
        value: data
    }
}

export function resetPasswordSuccess(data) {
    return {
        type: USER_RESETPASSWORD_SUCCESS,
        value: data
    }
}

export function loginApi(data) {
    return dispatch => {
        dispatch(setLoader(LOGIN_LOADER, true));
        return new Promise((resolve, reject) => {
            storeWithoutHeader(`auth/token`, data)
                .then((response) => {
                    dispatch(setLoader(LOGIN_LOADER, false));
                    dispatch(setDepts(getDepts(response.data.value)))
                    let deptsAccess = getDepts(response.data.value);
                    //  console.log('deptsAccess in action', deptsAccess)
                    setCookie('access_token', response.data.value, 1);
                    dispatch(loginSuccess(response.data.value))
                    dispatch(setUser(parseJwt(response.data.value)))
                    dispatch(isUserLoggedIn(true))
                    resolve({ success: response.data, deptsAccess: deptsAccess });
                })
                .catch((error) => {
                    dispatch(setLoader(LOGIN_LOADER, false));
                    dispatch(isUserLoggedIn(false));
                    reject({ success: false, error: error })
                });
        })
    }
}

export function forgotPasswordAction(data) {
    return dispatch => {
        return api.storeWithoutHeader(`auth/forgotpassword`, data)
            .then((response) => {
                dispatch(forgotPasswordSuccess(true))
                return response.data
            })
            .catch((error) => {
                dispatch(forgotPasswordSuccess(false))
                return error
            })
    }
}

export function resetPasswordAction(data) {
    return dispatch => {
        return api.storeWithoutHeader(`auth/resetpassword`, data.resetPasswordData)
            .then((response) => {
                dispatch(resetPasswordSuccess(true));
                return response.data
            })
            .catch((error) => {
                dispatch(resetPasswordSuccess(false));
                return error;
            })
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url && base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export function getDepts(data) {
    const depts = data && parseJwt(data) && parseJwt(data).pageAccess;
    var deptsList = JSON.stringify(depts);
    var deptsString = new String();
    deptsString = deptsList && deptsList.toString().replace(/"/g, "");
    var allDepts = eval(deptsString);

    let accessedDepts = [];
    allDepts && allDepts.filter((dept) => {
        if (Object.values(dept)[0] === 1) {
            accessedDepts.push(Object.keys(dept)[0])
        }
    });
    return accessedDepts;
};

export function isTokenExpired() {
    const data = getCookie("access_token");
    const profile = data && parseJwt(data);
    const tokenTimmeStamp = profile ? profile.exp : undefined;
    if (!tokenTimmeStamp) {
        return true;
    }
    const tokenDate = moment.unix(tokenTimmeStamp);
    const tokenDateParsed = moment(tokenDate);

    const currentDate = moment();
    return (tokenDateParsed.diff(currentDate, 'seconds') < 0);
}
// }

export function appLoad() {
    return dispatch => {
        const userToken = getCookie("access_token");
        dispatch(fitMeAuthorization());
        if (userToken) {
            dispatch(loginSuccess(userToken));
            if (isTokenExpired()) {
                dispatch(setExpired(true));
                dispatch(isUserLoggedIn(false));
            }
            if (userToken && !isTokenExpired()) {
                dispatch(setExpired(false));
                dispatch(setDepts(getDepts(userToken)));
                dispatch(setUser(parseJwt(userToken)));
                dispatch(isUserLoggedIn(true));
            }
        }
    }
}

export function fitMeAuthorization() {
    return dispatch => {
        dispatch(loaderRequest(true));
        deleteCookie("fitmeAuthToken");
        fetchWithoutHeader(`user/usertoken/`)
            .then((response) => {
                if (!response || !response.data || (response.status !== 200)) {
                    dispatch(loaderRequest(false));
                    return;
                }
                const authToken = JSON.parse(response.data);
                setCookie("fitmeAuthToken", authToken.access_token, 1);
                dispatch(loaderRequest(false));
            })
            .catch((error) => {
                dispatch(loaderRequest(false));
            });
    };
}

export function logOut() {
    return dispatch => {
        deleteCookie('access_token');
        deleteCookie('fitmeAuthToken');
        localStorage.clear();
        sessionStorage.clear();
        dispatch(isUserLoggedIn(false));
    }
}

