import apiClient from "./apiClient.ts";
import {ProfileInfo} from "../pages/Mypage.tsx";

export const profileEvaluation = async (channelId: string) => {
    try {
        const response = await apiClient.get(`/api/v1/users/evaluation/${channelId}`);

        if (response.status === 200) {
            return response.data;
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return error;
    }
};

export const getCreatorInfo = async () => {
    try {
        const response = await apiClient.get('/api/v1/users/creator');

        if (response.status === 200) {
            return response.data;
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return error;
    }
};

export const getProductManagerInfo = async () => {
    try {
        const response = await apiClient.get('/api/v1/users/productmanager');

        if (response.status === 200) {
            return response.data;
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return error;
    }
};

export const patchCreatorInfo = async (data: Partial<ProfileInfo>) => {
    try {
        const response = await apiClient.patch('/api/v1/users/creator', data);

        if (response.status === 200) {
            return {success: true, data: response.data};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (_error) {
        return {success: false};
    }
};

export const patchProductManagerInfo = async (data: Partial<ProfileInfo>) => {
    try {
        const response = await apiClient.patch('/api/v1/users/productmanager', data);

        if (response.status === 200) {
            return {success: true, data: response.data};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (_error) {
        return {success: false};
    }
};
