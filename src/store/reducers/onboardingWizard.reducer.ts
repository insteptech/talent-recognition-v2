import { IOnboardWizard } from '../models/onBoardingWizard.interface';
import {IActionBase} from '../models/root.interface'
import { useDispatch, useSelector } from "react-redux";
import { SET_WIZARD_STEP, 
    SET_ACCOUNT_NUMBER, 
    SET_SIGNUP_CONFIRMATION, 
    SET_LOADER_ONBOARDING, 
    SET_ERROR_PAYMENTMETHOD, 
    SET_SUCCESS_PAYMENTMETHOD,
    SET_USER_DATA,
    CAMPAIGN_COMPLETED } from '../../common/types/onBoardingWizard';

const initalState : IOnboardWizard = {
    id: null,
    wizardUserData:{
        fullName:       "",
        email:          "",
        companyName:    "",
        password:       "",
        confirmPassword:"",
        address:        "",
        city:           "",
        postalCode:     "",
        nosOfEmployee:  "",
        completed       :"",
        accountNumber   :"",
        contactNumber   :"",
        confirmSignedUp:'',
    }
}

function onBoardingWizardReducer(state:IOnboardWizard = initalState, action:IActionBase) : IOnboardWizard{
    switch(action.type){
        case SET_WIZARD_STEP:{
            return {...state, id:action.value}
        }
        case SET_ACCOUNT_NUMBER:{
            return { ...state, accountNumber:action.value}
        }
       
        case SET_SIGNUP_CONFIRMATION:{
            return {...state, confirmSignedUp:action.value}
        }
        case SET_LOADER_ONBOARDING:{
            return {...state, id:action.value}
        }
        case SET_ERROR_PAYMENTMETHOD:{
            return {...state, id:action.value}
        }
        case SET_SUCCESS_PAYMENTMETHOD:{
            return {...state, id: action.value}
        }
        case SET_USER_DATA:{
            return {...state, wizardUserData:action.value}
        }
        case CAMPAIGN_COMPLETED:{
            return {...state, completed:action.value}
        }
        default:
            return state;
    } 
}

export default onBoardingWizardReducer;
