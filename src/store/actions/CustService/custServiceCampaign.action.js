import {    storeCS, 
            getCS, 
            storeWithouHeader, 
            fetchWithoutHeaderCS, 
            ipCS, 
            formPostCS, 
            fetchPsyCS, 
            savePsyDataCS, 
            postAsJsonCS } from "../../../services/apiCS";
import { setCookie, getCookie } from "../../../services/cookie";
import * as authAction from '../account.actions';
import {fetchCampaigns} from '../CustService/custServiceProducts.action';

export const SET_LOADER_CREATE_CAMPAIGN = "SET_LOADER_CREATE_CAMPAIGN";
export const SET_CAMPAIGN_INPROCESS_ID = "SET_CAMPAIGN_INPROCESS_ID";
export const SET_CAMPAIGN_MODE = "SET_CAMPAIGN_MODE";
export const SET_CAMPAIGN_DATA = "SET_CAMPAIGN_DATA";
export const SET_CAMPAIGN_ROLES = "SET_CAMPAIGN_ROLES";
export const SET_LOADER_MBTI = "SET_LOADER_MBTI";
export const SET_CAMPAIGN_MBTI = "SET_CAMPAIGN_MBTI";
export const SET_CAMPAIGN_PREFERENCES = "SET_CAMPAIGN_PREFERENCES";
export const SET_CAMPAIGN_PROCESSROLESELECTED = "SET_CAMPAIGN_PROCESSROLESELECTED";
export const SET_PRE_SPEND_RATIO = "SET_PRE_SPEND_RATIO";
export const SET_CAMPAIGN_RESULT = "SET_CAMPAIGN_RESULT";
export const SET_SELECTED_CAMPAIGN_DETAIL = "SET_SELECTED_CAMPAIGN_DETAIL";
export const SET_CAMPAIGN_DETAILS = "SET_CAMPAIGN_DETAILS";
export const USER_CAMPAIGN_SUCCESS = "USER_CAMPAIGN_SUCCESS";
export const SET_LOADER_SELECTED_CAMPAIGN = "SET_LOADER_SELECTED_CAMPAIGN";
export const SET_USER_CAMPAIGN_ID = "SET_USER_CAMPAIGN_ID";
export const CAMERA_SELFIE_UPLOAD_SUCCESS = "CAMERA_SELFIE_UPLOAD_SUCCESS";
export const CAMERA_SELFIE_NOT_FOUND = "CAMERA_SELFIE_NOT_FOUND";
export const RETURN_SELFIE = "RETURN_SELFIE";
export const THANK_YOU = "THANK_YOU";
export const CAMPAIGN_COMPLETED = "CAMPAIGN_COMPLETED";
export const SET_EXTRAVERSION = "SET_EXTRAVERSION";
export const UPDATE_CAMPAIGN_TYPE = "UPDATE_CAMPAIGN_TYPE"



export function setLoader(type, value) {
    return { type: type, value: value };
}

export function setCampaignInProcessID(id) {
    return {
        type: SET_CAMPAIGN_INPROCESS_ID,
        value: id,
    };
}


export function setCampaignMode(data) {
    return {
        type: SET_CAMPAIGN_MODE,
        value: data,
    };
}

export function setCampaignData(data) {
    return {
        type: SET_CAMPAIGN_DATA,
        value: data,
    };
}

export function setCampaignRoles(roles) {
    return {
        type: SET_CAMPAIGN_ROLES,
        value: roles,
    };
}

export function setPreSpendRadio(ratio) {
    return {
        type: SET_PRE_SPEND_RATIO,
        value: ratio,
    };
}

export function setCampaignMbti(mbti) {
    return {
        type: SET_CAMPAIGN_MBTI,
        value: mbti,
    };
}

export function setCampaignPreferences(preferences) {
    return {
        type: SET_CAMPAIGN_PREFERENCES,
        value: preferences,
    }
}
export function setProcessRoleSelected(processRole) {
    return {
        type: SET_CAMPAIGN_PROCESSROLESELECTED,
        value: processRole
    }
}

export function setCampaignResult(campaignResult) {
    return {
        type: SET_CAMPAIGN_RESULT,
        value: campaignResult,
    };
}

export function setSelectedCampaignDetail(selectedCampaignDetails) {
    return {
        type: SET_SELECTED_CAMPAIGN_DETAIL,
        value: selectedCampaignDetails,
    };
}

export function setCampaignDetail(campaign) {
    return {
        type: SET_CAMPAIGN_DETAILS,
        value: campaign,
    };
}

export function campaignSuccess(campaign) {
    return {
        type: USER_CAMPAIGN_SUCCESS,
        value: campaign,
    };
}

export function setApplicationId(id) {
    return {
        type: SET_USER_CAMPAIGN_ID,
        value: id,
    };
}

export function selfie_Uploaded(result) {
    return {
        type: CAMERA_SELFIE_UPLOAD_SUCCESS,
        value: result,
    };
}

export function cameraSelfieError(selfiError) {
    return {
        type: CAMERA_SELFIE_NOT_FOUND,
        value: selfiError
    }
}

export function returnSelfieScreen(value) {
    return {
        type: RETURN_SELFIE,
        value: value,
    };
}

export function thankYouScreen(value) {
    return {
        type: THANK_YOU,
        value: value,
    };
}

export function setCompleted(value) {
    return {
        type: CAMPAIGN_COMPLETED,
        value: value
    };
}

export function setExtraversionRed(data) {
    return {
        type: SET_EXTRAVERSION,
        value: data
    };
}

export function updateCampaignType(page) {
    return {
        type: UPDATE_CAMPAIGN_TYPE,
        value: page
    }
}

export function createCampaign(data) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, true));
        const state = getStore();
        dispatch( setCampaignData(data)) 

        const selectedCampaignCS = window.sessionStorage.getItem("selectedCampaignCS");
        const inprocessId1 = state.campaign.id || Number(selectedCampaignCS);
        const inprocessId = inprocessId1 !== null ? inprocessId1 : 0;
        const isPublished = state.campaign.campaign.published == 1 ? 1 : 0;
        const isActive = state.campaign.campaign.active == 1 ? 1 : 0;
        const isEditMode = state.campaign.isEditMode
        data['campaignID'] = inprocessId;
        data['isEditMode'] = isEditMode;
        data['published'] = isPublished;
        data['active'] = isActive;
        return storeCS('campaigns/create', data)
        .then((response) => {
                dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, false));
                dispatch(setCampaignInProcessID(response.data));
                window.sessionStorage.setItem("selectedCampaignCS", response.data);
                return response;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, false));
            });
    };
}

export function fetchCampaignRoles() {
    return (dispatch, getStore) => {

        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const state = getStore();
        getCS('campaigns/roles')
            .then((response) => {
                dispatch(setCampaignRoles(response.data));
            })
            .catch((error) => {
            });
    };
}

export function fetchCampaignMbti() {
    return (dispatch, getStore) => {

        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_MBTI, true));
        const state = getStore();
        const selectedCampaignCS = window.sessionStorage.getItem("selectedCampaignCS");
        const inprocessId = state.campaign.id || Number(selectedCampaignCS);
        if (inprocessId === null && Number(inprocessId) != 0) {
            return;
        }
        getCS(`campaigns/mbti/${inprocessId}`)
            .then((response) => {
                dispatch(setLoader(SET_LOADER_MBTI, false));
                dispatch(setCampaignMbti(response.data));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_MBTI, false));
            });
    };
}

export function fetchCampaignPreferences() {
    return (dispatch, getStore) => {

        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const state = getStore();
        const selectedCampaignCS = window.sessionStorage.getItem("selectedCampaignCS");
        const inprocessId = state.campaign.id || Number(selectedCampaignCS);
        if (inprocessId === null && Number(inprocessId) != 0) {
            return;
        }
        getCS(`campaigns/campaignpreference/${inprocessId}`)
            .then((response) => {
                dispatch(setCampaignPreferences(response.data));
            })
            .catch((error) => {
            })

    }
}

export function fetchProcessRoleSelected() {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const state = getStore();
        const inprocessId = state.campaign.id;
        if (inprocessId === null) {
            return;
        }
        getCS(`campaigns/ProcessRoleSelected/${inprocessId}`)
            .then((response) => {
                dispatch(setProcessRoleSelected(response.data));
                dispatch(fetchCampaignPreferences())
            })
            .catch((error) => {
            })
    }
}

export function updateCampaignTypeAction(data) {
    return (dispatch, getStore) => {
        return storeCS(`campaigns/UpdateCampaignType`, data).then((response) => {
            return response;
        })
            .catch((error) => {
            });
    };
}


export function fetchPreSpendRatio() {
    return (dispatch, getStore) => {

        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const state = getStore();
        getCS('campaigns/GetPreSpendValues')
            .then((response) => {
                dispatch(setPreSpendRadio(response.data.result));
            })
            .catch((error) => {
            });
    };
}

export function getCampaignResult(data) {
    return (dispatch, getStore) => {

        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, true));
        return storeCS(`campaign/result`, data)
            .then((response) => {
                dispatch(setCampaignResult(response.data));
                dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, false));
                return response.data;
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_CREATE_CAMPAIGN, false));
            });
    };
}

export function fetchCampaignDetails(id) {
    return (dispatch, getStore) => {

        const state = getStore();
        return getCS(`campaigns/detail/${id}`)
            .then((response) => {
            dispatch(setCampaignDetail(response.data.result));
            const CScampaignDetails = setCampaignDetail( response.data.result)
            return response;
        })
            .catch((error) => {
            });
    };
}


export function deleteDraftCampaign(id) {
    return (dispatch, getStore) => {
        if (authAction.isTokenExpired()) {
            dispatch(authAction.setExpired(true));
            dispatch(authAction.isUserLoggedIn(false));
            return;
        }
        const pageInfo = {
            "PageNumber": 1,
            "PageSize": 6,
            "active": 1
        }
        return storeCS(`campaigns/deleteDraft`, id)
        .then((response) => {
           dispatch(fetchCampaigns(pageInfo ));
            return response;
        })
            .catch((error) => {
            });
    };
}

export function saveCampaign(item) {
    return (dispatch, getStore) => {
        return storeWithouHeader(`user/SaveCampaign`, item)
            .then((response) => {
                dispatch(setApplicationId(response.data));
                return response.data
            })
            .catch((error) => {
            });
    };
}

export function saveCampaignWizard(item) {
    return (dispatch, getStore) => {
        return storeWithouHeader(`user/SaveCampaign`, item)
            .then((response) => {
                dispatch(setApplicationId(response.data));
                return response.data
            })
            .catch((error) => {
            });
    };
}

export function getCampaign(id) {
    return (dispatch, getStore) => {

        dispatch(setLoader(SET_LOADER_SELECTED_CAMPAIGN, true));
        fetchWithoutHeaderCS(`usCSer/GetCompanyInfo/${id}`)
            .then((response) => {
                if (!response || !response.data || (response.status !== 200)) {
                    dispatch(setLoader(SET_LOADER_SELECTED_CAMPAIGN, false));
                    return;
                }
                setCookie("campaignInfo", JSON.stringify(response.data), 1);
                dispatch(campaignSuccess(response.data));
                dispatch(setLoader(SET_LOADER_SELECTED_CAMPAIGN, false));
            })
            .catch((error) => {
                dispatch(setLoader(SET_LOADER_SELECTED_CAMPAIGN, false));
            });

    };
}

export function getIp() {
    return (dispatch, getStore) => {
        return ipCS(`//api.ipify.org/?format=json`)
            .then((response) => {
                setCookie("ip", JSON.stringify(response.data), 1);
            })
            .catch((error) => {

            });
    };
}

export function escapeJson(json) {
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };

    escapable.lastIndex = 0;
    return escapable.test(json) ? '"' + json.replace(escapable, function (a) {
        var c = meta[a];
        return (typeof c === 'string') ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + json + '"';
};

export function saveApiResponse(psyResult, bfmData, count) {
    return (dispatch, getStore) => {
        if (!psyResult || !psyResult.psy_groups || !bfmData || !bfmData.faces) {
            return;
        }
        var ip = JSON.parse(getCookie('ip'));
        const state = getStore();
        psyResult['testId'] = state.campaign.userId;
        psyResult['campaignID'] = state.campaign.userId;
        psyResult['true_id'] = bfmData.faces[0].person.true_id;
        psyResult['Link'] = state.campaign.selectCampaign.link;
        psyResult['IPAddress'] = ip.ip;

        savePsyDataCS('user/SavePsyResult', escapeJson(JSON.stringify(psyResult)))
            .then((response) => {
                if (response && response.status == 200 && count === 6) {
                    dispatch(executeReport())
                }
            })
            .catch((error) => {
            });
    };
}

export function getPycReport(data, count) {
    return dispatch => {
        if (!data || !data.faces || !data.faces[0].person) {
            return;
        }
        fetchPsyCS(`psy/${data.faces[0].person.true_id}`)
            .then((response) => {
                dispatch(saveApiResponse(response.data, data, count));
            })
            .catch((error) => {
                // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Error while processing request.'));
            });
    };
}

export function uploadToBfm(data) {
    return dispatch => {
        formPostCS("photo", data)
            .then((response) => {
                if (response && response.data && response.data.faces) {
                    dispatch(selfie_Uploaded(response.data));
                    dispatch(getPycReport(response.data, Number(data.get('requests'))));
                } else {
                    //dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('SomeThing Went Wrong.'));
                }
            })
            .catch((error) => {
                dispatch(logBfmError({ message: JSON.stringify(error), statusCode: error.response.status }));
                dispatch(cameraSelfieError(error.response.status))
                if (Number(data.get('requests')) === 6) {
                    dispatch(returnSelfieScreen(true));
                }
                //dispatch(notificationsAction.ADD_NOTIFICATION_ERROR(error));
            });
    };
}

export function executeReport() {
    return (dispatch, getStore) => {
        const state = getStore();
        const ApplicationID = state.campaign.userId;

        postAsJsonCS('user/ExecuteReport', Number(ApplicationID))
            .then((response) => {
                if (response && response.data == 0 && response.status == 200) {
                    dispatch(returnSelfieScreen(true));
                } else if (response && response.data != 0 && response.status == 200) {
                    dispatch(thankYouScreen(true));
                    //dispatch(notificationsAction.ADD_NOTIFICATION_SUCCESS('Your report has been saved successfully.'));
                }
            })
            .catch((error) => {
                // dispatch(notificationsAction.ADD_NOTIFICATION_ERROR('Error while processing request.'));
            });
    };
}

export function logBfmError(data) {
    return (dispatch, getStore) => {
        return storeWithouHeader(`auth/log`, data)
            .then((response) => {
            })
            .catch((error) => {
            });
    };
}

