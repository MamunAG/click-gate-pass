/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { localStorageKey, useAuth } from "./auth-provider";
import useApiUrl from "@/hooks/use-ApiUrl";

let isRefreshing = false; // To track if the token is being refreshed
let failedQueue: any[] = []; // Queue for requests during token refresh

const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom: any) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

export default function useAxiosInstance() {
    const { ProductionUrl } = useApiUrl();
    const auth = useAuth();
    const api = useApiUrl();

    const axiosInstance = axios.create({
        baseURL: ProductionUrl,
        headers: {
            "Content-Type": "application/json",
        },
    });

    axiosInstance.interceptors.request.use(
        (request) => {
            const accessToken = auth?.accessToken;
            if (accessToken) {
                request.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return request;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => response, // Directly return successful responses.
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err: any) => Promise.reject(err));
                }

                isRefreshing = true;

                try {
                    const lStorageKey = localStorageKey;
                    const refreshToken = localStorage.getItem(
                        lStorageKey.refreshTokenKey
                    ); // Retrieve the stored refresh token.
                    // Make a request to your auth server to refresh the token.
                    // console.log("Token", auth?.token);
                    // console.log("RefreshToken", refreshToken);
                    const authData = {
                        Token: auth?.accessToken,
                        RefreshToken: refreshToken,
                    };

                    const response = await axios.post(
                        `${api.ProductionRootUrl}/api/production/account/refreshtoken`,
                        authData
                    );
                    console.log("refresh token data:", response.data);
                    const { Token: accessToken, RefreshToken: newRefreshToken } =
                        response.data;
                    // Store the new access and refresh tokens.

                    auth?.setNewAccessToken(accessToken);
                    localStorage.setItem(lStorageKey.accessTokenKey, accessToken);

                    auth?.setNewRefreshToken(newRefreshToken);
                    localStorage.setItem(lStorageKey.refreshTokenKey, newRefreshToken);

                    processQueue(null, accessToken);

                    // Update the authorization header with the new access token.
                    axiosInstance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest); // Retry the original request with the new access token.
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                    console.error("Token refresh failed:", refreshError);
                    await auth?.removeAccessToken();
                    await auth?.removeRefreshToken();
                    // window.location.href = "/sign-in";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error); // For all other errors, return the error as is.
        }
    );

    return axiosInstance;
}
