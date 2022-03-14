import {IActionBase} from '../models/root.interface';
import {IAdmin} from '../models/adminCompany.interface';
import {
    GET_RUN_CARD,
    SET_LOADER_ADMIN_DAHBOARD,
    SET_ADMIN_USERS,
    SET_LOADER_ADMIN_USERS,
    SET_USERS,
    SET_LOADER_FETCH_USERS,
    SET_SECTOR_TYPES,
    SET_SALES_AGENTS,
    SET_CONTRACT_DURATION,
    SET_SELECTED_USER_DETAILS,
    SET_SELECTED_USER
} from '../types/adminCompany';

const initialState: IAdmin ={
    runCard:0,
    isLoader: false,
    adminUsers:[],
    isUserLoading:false,
    users:[],
    loadingUsers:false,
    sectorTypes: [],
    saleAgents: [],
    contractDuration:[],
    userDetails:{},
    selectedUser: {},
}

export function adminReducer(state:IAdmin = initialState, action:IActionBase){
    switch(action.type){
        case GET_RUN_CARD :
            return Object.assign({}, state,{
                ...state,
            runCard:action.value,
         });
         case SET_LOADER_ADMIN_DAHBOARD :
             return Object.assign({}, state, {
                 ...state,
                 isLoader:action.value,
             });
        case SET_ADMIN_USERS:
            return Object.assign({}, state,{
                ...state,
                adminUsers:action.value,
            });
        case SET_LOADER_ADMIN_USERS:
            return Object.assign({}, state, {
                ...state,
                isUserLoading:action.value,
            });
        case SET_USERS:
            return  {
                ...state,
                users:action.value,
            };
        case SET_LOADER_FETCH_USERS:
            return Object.assign({}, state,{
                ...state,
                loadingUsers:action.value,
            });
        case SET_SECTOR_TYPES:
            return Object.assign({}, state, {
                ...state,
                sectorTypes:action.value,
            });
        case SET_SALES_AGENTS:
            return Object.assign({}, state,{
                ...state,
                saleAgents:action.value,
            })
        case SET_CONTRACT_DURATION:
            return Object.assign({},state,{
                ...state,
                contractDuration:action.value,
            });
        case SET_SELECTED_USER_DETAILS:
            return Object.assign({},state,{
                ...state,
                userDetails:action.value,
            });
        case SET_SELECTED_USER: {
            return {
                ...state, selectedUser: action.value,
            };
        }
        default:
            return state;
        }    
}