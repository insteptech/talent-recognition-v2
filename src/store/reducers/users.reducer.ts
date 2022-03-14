import { IUserState, IActionBase } from "../models/root.interface";
import {
    ADD_ADMIN,
    REMOVE_ADMIN,
    SET_LOADER_USERS,
    SET_USERS,
    SET_LOADER_ACCOUNTS,
    SET_ACCOUNTS,
    SET_ACCOUNT_INFO,
    SET_PAYMENT_METHOD,
    SET_SELECTED_USER,
    SET_SUCCESS_PAYMENT_METHOD,
    SET_ERROR_PAYMENT_METHOD,
    SET_INVOICES
} from "../actions/users.action";

const initialState: IUserState = {
    users: [
        { id: 1, firstName: "John", lastName: "Smith", email: "jsmith@em.pl", },
        { id: 2, firstName: "Jannice", lastName: "Bing", email: "ohmy@fr.pl" }
    ],
    admins: [
        { id: 3, firstName: "Jannet", lastName: "Crock", email: "jcrock@em.pl" },
    ],
    isLoader: false,
    allUsers: {
        totalRecord: 0,
        result: []
    },
    accountLoader: false,
    allAccounts: {
        totalRecord: 0,
        result: []
    },
    accountInfo: {},
    paymentMethod: {},
    selectedUser: {},
    errorPaymentMethod: '',
    paymentSuccess: false,
    invoices: {
        totalRecord: 0,
        result: []
    },
};

function userReducer(state: IUserState = initialState, action: IActionBase): IUserState {
    switch (action.type) {
        case ADD_ADMIN: {
            return { ...state, users: state.users.filter(x => x.id !== action.user.id), admins: [...state.admins, action.user] };
        }
        case REMOVE_ADMIN: {
            return { ...state, admins: state.admins.filter(x => x.id !== action.user.id), users: [...state.users, action.user] };
        }
        case SET_LOADER_USERS: {
            return { ...state, isLoader: action.value };
        }
        case SET_USERS: {
            return {
                ...state, allUsers: action.value,
            };
        }
        case SET_LOADER_ACCOUNTS: {
            return { ...state, accountLoader: action.value };
        }
        case SET_ACCOUNTS: {
            return {
                ...state, allAccounts: action.value,
            };
        }
        case SET_ACCOUNT_INFO: {
            return {
                ...state, accountInfo: action.value,
            };
        }
        case SET_PAYMENT_METHOD: {
            return {
                ...state, paymentMethod: action.value,
            };
        }
        case SET_SELECTED_USER: {
            return {
                ...state, selectedUser: action.value,
            };
        }
        case SET_SUCCESS_PAYMENT_METHOD: {
            return {
                ...state,
                errorPaymentMethod: '',
                paymentSuccess: true
            };
        }
        case SET_ERROR_PAYMENT_METHOD: {
            return {
                ...state,
                errorPaymentMethod: action.value
            };
        }
        case SET_INVOICES: {
            return {
                ...state,
                invoices: action.value
            };
        }
        default:
            return state;
    }
}

export default userReducer;