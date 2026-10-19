import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.1.129:3000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    async (response) => {
        const novoToken = response.headers["x-new-token"];

        if (novoToken) {
            await SecureStore.setItemAsync(
                "auth_token",
                novoToken
            );
        }

        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);