import { SET_WIZARD_STEP, 
    SET_ACCOUNT_NUMBER, 
    SET_SIGNUP_CONFIRMATION, 
    SET_LOADER_ONBOARDING, 
    SET_ERROR_PAYMENTMETHOD, 
    SET_SUCCESS_PAYMENTMETHOD,
    SET_USER_DATA,
    CAMPAIGN_COMPLETED 
} from '../../common/types/onBoardingWizard';
//import * as notificationsAction from '../../actions/notification';
import * as api from "../../services/api";

export function setOnboardingWizardStep(step) {
    return {
        type: SET_WIZARD_STEP,
        value: step,
    };
}

export function setAccountNumber(accountNumber) {
    return {
        type: SET_ACCOUNT_NUMBER,
        value: accountNumber,
    };
}

export function setSignupConfirmation(status) {
    return {
        type: SET_SIGNUP_CONFIRMATION,
        value: status,
    };
}

export function setLoader(data) {
    return {
        type: SET_LOADER_ONBOARDING,
        value: data,
    };
}


export function setPaymentError(data) {
    return {
        type: SET_ERROR_PAYMENTMETHOD,
        value: data,
    };
}

export function setPaymentSuccess(data) {
    return {
        type: SET_SUCCESS_PAYMENTMETHOD,
        value: data,
    };
}
export function setUserData(userData){
    return{
        type:SET_USER_DATA,
        value: userData
    };
}
export function setCompleted(){
    return {
        type: CAMPAIGN_COMPLETED,
        value: true
    }
}

export function onboardingWizardSignUp(userInfo) {
    return (dispatch, getStore) => {
        dispatch(setLoader(true));
        const state = getStore();
        delete userInfo.userData.confirmPassword;
        
        userInfo['fullName'] = '';
        userInfo['companyName'] = '';
        userInfo['email'] = '';
        userInfo['password'] = '';
        userInfo['contactNumber']='';
        userInfo['token'] = '';
        
        api.postAsJsonLocal('auth/signup', userInfo.userData)
            .then((response) => {
                dispatch(setLoader(false));
                dispatch(setAccountNumber(response.data));
            })
            .catch((error) => {
                dispatch(setLoader(false));
            });
    };
}
export function onboardingWizardAddressUpdate(userInfo) {
    return (dispatch, getStore) => {
   
        dispatch(setLoader(true));
        const state = getStore();
        delete userInfo.userData.confirmPassword;
        userInfo['address'] = '';
        userInfo['city'] = '';
        userInfo['postalCode'] = 0;
        userInfo['accountNumber'] = state.onboardingWizard.accountNumber;
        userInfo['nosOfEmployee'] = Number(userInfo['nosOfEmployee']);
        api.postAsJsonLocal('auth/savesignup', userInfo.userData)
            .then((response) => {
                dispatch(setLoader(false));
                dispatch(setOnboardingWizardStep('confirm'));
            })
            .catch((error) => {
                dispatch(setLoader(false));
            });
    };
}

export function confirmSignup(token) {
    return (dispatch, getStore) => {
        
        dispatch(setLoader(true));
        return api.postAsJsonLocal(`auth/confirmSignup/${token}`, {})
            .then((response) => {
                dispatch(setLoader(false));
                dispatch(setSignupConfirmation(response.data));
            })
            .catch((error) => {
                dispatch(setLoader(false));
                dispatch(setSignupConfirmation(500));
            });
    };
}

export function addPaymentMethod(card) {
    return (dispatch, getStore) => {
        dispatch(setLoader(true));
        return api.store(`payments/addpaymentmethod`, card)
            .then((response) => {
                dispatch(setLoader(false));
                
                if (response.data === 1) {
                    dispatch(setPaymentSuccess(response.data))
                } else {
                    dispatch(setPaymentError(response.data.message));
                }
                return response.data;
            })
            .catch((error) => {
                //dispatch(notificationsAction.ADD_NOTIFICATION_ERROR(error.message));
                dispatch(setLoader(false));
            });
    };
}
