import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import {
    LOG_IN,
    LOG_OUT,
    LOGIN_LOADER,
    USER_LOGIN_SUCCESS,
    SET_USER_TOKEN,
    IS_USER_LOGGED_IN,
    SET_DEPTS_ACCESS,
    SET_USER_EXPIRED,
    lOADERSTART,
    USER_FORGOTPASSWORD_SUCCESS,
    USER_RESETPASSWORD_SUCCESS,
} from "../actions/account.actions";

const initialState: IAccount = {
    email: "admin@react-template.pl",
    loginLoader: false,
    isExpired: false,
    token: {},
    loginUser: {},
    isLoggedIn: false,
    deptsAccess: [],
    showLoader: false,
    forgotPasswordSuccess: false,
    resetPasswordSuccess: false,
};

function accountReducer(state: IAccount = initialState, action: IActionBase): IAccount {
    switch (action.type) {
        case LOG_IN: {
            return { ...state, email: (action.email) };
        }
        case LOG_OUT: {
            return { ...state, email: "" };
        }
        case LOGIN_LOADER: {
            return { ...state, loginLoader: (action.value) };
        }
        case USER_LOGIN_SUCCESS: {
            return {
                ...state,
                token: action.access_token,
                isExpired: false
            };
        }
        case SET_USER_TOKEN: {
            return {
                ...state,
                loginUser: action.value,
                isExpired: false
            };
        }
        case IS_USER_LOGGED_IN: {
            return {
                ...state,
                isLoggedIn: action.value,
                isExpired: !action.value
            };
        }
        case SET_DEPTS_ACCESS: {
            return {
                ...state,
                deptsAccess: action.deptsAccess
            };
        }
        case SET_USER_EXPIRED: {
            return {
                ...state,
                isExpired: action.value
            };
        }
        case lOADERSTART: {
            return {
                ...state,
                showLoader: action.value
            };
        }
        case USER_FORGOTPASSWORD_SUCCESS :{
            return {
                ...state,
                forgotPasswordSuccess: action.value
            }
        }
        case USER_RESETPASSWORD_SUCCESS :{
            return {
                ...state,
                resetPasswordSuccess : action.value
            }
        }

        default:
            return state;
    }
}


export default accountReducer;