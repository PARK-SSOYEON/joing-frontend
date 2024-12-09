import apiClient from "./apiClient.ts";

export const profileEvaluation = async (channelId: string) => {
    try {
        const response = await apiClient.get('/api/v1/users/evaluation', {
            params: {
                channelId,
            },
        });

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

export const patchCreatorInfo = async (data: {
    nickname: string;
    email: string;
    channelId: string;
    channelUrl: string;
    mediaType: string;
    category: string;
}) => {
    try {
        const response = await apiClient.patch('/api/v1/users/creator', data);

        if (response.status === 200) {
            return {success: true};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return {success: false, error};
    }
};

export const patchProductManagerInfo = async (data: {
    nickname: string;
    email: string;
    favoriteCategories: string[];
}) => {
    try {
        const response = await apiClient.patch('/api/v1/users/productmanager', data);

        if (response.status === 200) {
            return {success: true};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return {success: false, error};
    }
};
