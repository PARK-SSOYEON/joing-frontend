import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const apiClient = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

const setAuthorizationHeader = (config: AxiosRequestConfig, token: string | null): void => {
    if (token && config.headers) {
        config.headers.access = token;
    }
};

apiClient.interceptors.request.use((
        config: InternalAxiosRequestConfig,
    ): InternalAxiosRequestConfig => {
        const excludedPaths = [
            '/api/test',
            '/api/v1/users/evaluation',
        ];

        const isExcluded =
            excludedPaths.some(path => config.url?.includes(path));

        if (!isExcluded) {
            const accessToken = localStorage.getItem('accessToken');
            setAuthorizationHeader(config, accessToken);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {

        const rawData = error.response?.data || null;

        if (!rawData) {
            return Promise.reject(error);
        }

        try {
            const responseData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

            if (typeof responseData !== 'object') {
                console.error('Parsed response is not a valid object:', responseData);
                return Promise.reject(error);
            }

            const { status, message } = responseData;
            console.log('Response Error Data:', { status, message });

        } catch (parseError) {
            console.error('Failed to parse response data:', rawData);
            return Promise.reject(parseError);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
