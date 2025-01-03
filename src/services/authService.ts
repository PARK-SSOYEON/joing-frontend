import apiClient from './apiClient';
import {resetUserRole} from "../contexts/UserContext.tsx";
import {resetAccessToken} from "../contexts/AuthContext.tsx";

export const creatorJoin = async (data: {
    nickname: string;
    email: string;
    channelId: string;
    channelUrl: string;
    profileImage: string;
    subscribers: number;
    mediaType: string;
    category: string;
}) => {
    try {
        const response = await apiClient.post('/api/v1/users/signup/creator', data);

        if (response.status === 201) {
            localStorage.setItem("role", response.data.type);
            return {success: true};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return {success: false, error};
    }
};

export const productmanagerJoin = async (data: {
    nickname: string;
    email: string;
    favoriteCategories: string[];
}) => {
    try {
        const response = await apiClient.post('/api/v1/users/signup/productmanager', data);

        if (response.status === 201) {
            localStorage.setItem("role", response.data.type);
            return {success: true};
        }
        throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
        return {success: false, error};
    }
};

export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.warn('No access token found for logout');
        return;
    }

    try {
        await apiClient.post('/logout');
        resetUserRole();
        resetAccessToken();
        clearTokens();
    } catch (error) {
        console.error('Logout failed:', error);
        alert("로그아웃에 실패했습니다. 네트워크 상태를 확인해주세요.");
    }
};

const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('notices');
};

export const extractAndSaveToken = (): void => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const type = params.get("type");

    if (token) {
        localStorage.setItem("accessToken", token);
        params.delete("token");
    }

    if (type) {
        localStorage.setItem("role", type);
        params.delete("type");
    }

    if (token || type) {
        const newUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, document.title, newUrl);
    }
};
