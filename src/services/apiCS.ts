import axios from 'axios';
import * as utils from './cookie';
import { API_CONFIG } from '../config';

export function fetchPsyCS(pathParam: string) {
    return axios
        .get(API_CONFIG.bfmApi + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('fitmeAuthToken')}` } });
}

export function fetchCS(pathParam: string) {
    return axios
        .get(API_CONFIG.bfmApi + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function storeCS(pathParam: string, data: any) {
    return axios
        .post(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function updateCS(pathParam: string, data: any) {
    return axios
        .put(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function patchCS(pathParam: string, data: any) {
    return axios
        .patch(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function destroyCS(pathParam: string) {
    return axios.delete(API_CONFIG.baseUrl + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function storeWithoutHeaderCS(pathParam: string, data: any) {
    return axios.post(API_CONFIG.baseUrl + pathParam, data);
}

export function fetchWithoutHeaderCS(pathParam: string) {
    return axios.get(API_CONFIG.baseUrl + pathParam);
}

export function fileUploadCS(url: string, formValue: any) {
    var options = {
        headers: {
            'Content-Type': "multipart/form-data",
            'Authorization': `Bearer ${utils.getCookie('idToken')}`,
        }
    };
    return axios.put(API_CONFIG.baseUrl + url, formValue, options);
}

export function formPostCS(url: any, formValue: any) {
    var headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': `Bearer ${utils.getCookie('fitmeAuthToken')}`,
    }
    return axios.post(`${API_CONFIG.bfmApi}${url}`, formValue, { headers });
}

export function savePsyDataCS(url: any, formValue: any) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function postAsJsonCS(url: any, formValue: any, headers: { 'Content-Type': string; }) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function ipCS(url: any) {
    var headers = { 'Content-Type': "application/json" }
    return axios.get(`${url}`, { headers });
}

export function postAsJsonLocalCS(url: any, formValue: any, headers: { 'Content-Type': string; }) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function getCS(pathParam: string) {
    return axios.get(API_CONFIG.baseUrl + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function storeWithouHeader(pathParam: any, data: any) {
    return axios
        .post(API_CONFIG.baseUrl + pathParam, data);
}

