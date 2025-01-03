import apiClient from "./apiClient.ts";

export const recommendCreator = async (itemId: number) => {
    try {
        const response = await apiClient.get(`/api/v1/recommendations/items/${itemId}`);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch RecommendCreator: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error in fetch RecommendCreator:', error);
        throw error;
    }
};

export const recommendItem = async () => {
    try {
        const response = await apiClient.get('/api/v1/recommendations/users');

        if (response.status !== 200) {
            throw new Error(`Failed to fetch RecommendItem: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error in fetch RecommendItem:', error);
        throw error;
    }
};
