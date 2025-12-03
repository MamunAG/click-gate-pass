/* eslint-disable react-refresh/only-export-components */
import axios, { AxiosError } from "axios";
import React, { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";
import useApiUrl from "@/hooks/use-ApiUrl";

export const localStorageKey = {
  accessTokenKey: "click_api_token",
  refreshTokenKey: "click_api_refresh_token",
};

export interface AuthContextType {
  token: string | null;
  user: string | null;
  message: string | null;
  isLoading: boolean;
  loginAction: (data: { username: string; password: string }) => Promise<void>;
  logOut: () => void;
  setNewAccessToken: (token: string) => void;
  setNewRefreshToken: (token: string) => void;
  removeAccessToken: () => void;
  removeRefreshToken: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("user") || ""
  );
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.accessTokenKey) || ""
  );
  const [, setRefreshToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.refreshTokenKey) || ""
  );
  const navigate = useNavigate();
  const api = useApiUrl();

  const loginAction = async (data: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      setMessage(null);

      const authData = {
        Email: data.username,
        Password: data.password,
      };

      const response = await axios.post(
        `${api.ProductionRootUrl}/api/production/account/login`,
        authData
      );

      if (response.data) {
        setUser(data.username);
        setToken(response.data.Token);
        setRefreshToken(response.data.RefreshToken);

        await localStorage.setItem("user", data.username);
        setNewAccessToken(response.data.Token);
        setNewRefreshToken(response.data.RefreshToken);

        // console.log(response.data);

        navigate("/dashboard");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        throw new Error("Can not authenticate. Some error happened.");
      }

      // console.log(response);
    } catch (err) {
      setIsLoading(false);
      if (err === typeof AxiosError) {
        console.error("asdas", err as AxiosError);
      }
      if (err as AxiosError) {
        console.log((err as AxiosError).response?.data);
        setMessage(JSON.stringify((err as AxiosError).response?.data));
      }
    }
  };
  const setNewAccessToken = (token: string) =>
    localStorage.setItem(localStorageKey.accessTokenKey, token);

  const removeAccessToken = () =>
    localStorage.removeItem(localStorageKey.accessTokenKey);

  const setNewRefreshToken = (token: string) =>
    localStorage.setItem(localStorageKey.refreshTokenKey, token);

  const removeRefreshToken = () =>
    localStorage.removeItem(localStorageKey.refreshTokenKey);

  const logOut = () => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    removeAccessToken();
    removeRefreshToken();
    navigate("/login");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loginAction,
        logOut,
        message,
        isLoading,
        setNewAccessToken,
        setNewRefreshToken,
        removeAccessToken,
        removeRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
