import axios from 'axios';
import * as utils from './cookie';
import { API_CONFIG } from '../config';
export function fetchPsy(pathParam: string) {
    return axios
        .get(API_CONFIG.bfmApi + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('fitmeAuthToken')}` } });
}

export function fetch(pathParam: string) {
    return axios
        .get(API_CONFIG.bfmApi + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function store(pathParam: string, data: any) {
    return axios
        .post(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function storeCS(pathParam: string, data: any) {
    return axios
        .post(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function update(pathParam: string, data: any) {
    return axios
        .put(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function patch(pathParam: string, data: any) {
    return axios
        .patch(API_CONFIG.baseUrl + pathParam, data, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function destroy(pathParam: string) {
    return axios.delete(API_CONFIG.baseUrl + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function storeWithoutHeader(pathParam: string, data: any) {
    return axios.post(API_CONFIG.baseUrl + pathParam, data);
}

export function fetchWithoutHeader(pathParam: string) {
    return axios.get(API_CONFIG.baseUrl + pathParam);
}

export function fileUpload(url: string, formValue: any) {
    var options = {
        headers: {
            'Content-Type': "multipart/form-data",
            'Authorization': `Bearer ${utils.getCookie('idToken')}`,
        }
    };
    return axios.put(API_CONFIG.baseUrl + url, formValue, options);
}

export function formPost(url: any, formValue: any) {
    var headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': `Bearer ${utils.getCookie('fitmeAuthToken')}`,
    }
    return axios.post(`${API_CONFIG.bfmApi}${url}`, formValue, { headers });
}

export function savePsyData(url: any, formValue: any) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function postAsJson(url: any, formValue: any, headers: { 'Content-Type': string; }) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function ip(url: any) {
    var headers = { 'Content-Type': "application/json" }
    return axios.get(`${url}`, { headers });
}

export function postAsJsonLocal(url: any, formValue: any, headers: { 'Content-Type': string; }) {
    var headers = { 'Content-Type': "application/json" }
    return axios.post(`${API_CONFIG.baseUrl}${url}`, formValue, { headers });
}

export function get(pathParam: string) {
    return axios.get(API_CONFIG.baseUrl + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('access_token')}` } });
}

export function getCS(pathParam: string) {
    return axios.get(API_CONFIG.baseUrl + pathParam, { headers: { 'Authorization': `Bearer ${utils.getCookie('company_token')}` } });
}

export function storeWithouHeader(pathParam: any, data: any) {
    return axios
        .post(API_CONFIG.baseUrl + pathParam, data);
}

