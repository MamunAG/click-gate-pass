/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import useApiUrl from "@/hooks/use-ApiUrl";
import axios, { AxiosError } from "axios";
import React, { useContext, createContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import useApiUrl from "src/hooks/use-ApiUrl";

// eslint-disable-next-line react-refresh/only-export-components
export const localStorageKey = {
  accessTokenKey: "next_sol_access_token",
  refreshTokenKey: "next_sol_refresh_token",
  tokenSaveTimeKey: "next_sol_access_token_save_time",
  selectedCompany: "next_sol_selectedCompany"
};

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  tokenSavedTime: Date | null;
  user: string | null;
  message: string | null;
  isLoading: boolean;
  selectedCompany: string | null;
  loginAction: (data: { username: string; password: string }) => Promise<void>;
  logOut: () => void;
  setNewAccessToken: (token: string) => void;
  setNewRefreshToken: (token: string) => void;
  removeAccessToken: () => void;
  removeRefreshToken: () => void;
  setSelectedCompany: (companyId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect-to");
  // console.log("rutl: ", redirectTo);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("user") || ""
  );
  const [message, setMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.accessTokenKey) || ""
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem(localStorageKey.refreshTokenKey) || ""
  );
  const [tokenSavedTime, setTokenSavedTime] = useState<Date | null>(
    new Date(localStorage.getItem(localStorageKey.tokenSaveTimeKey) || "")
  );

  const [selectedCompany, setSelectedCompany] = useState<string | null>(
    localStorage.getItem(localStorageKey.selectedCompany) || ""
  );

  const navigate = useNavigate();
  const api = useApiUrl();

  const loginAction = async (data: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      setMessage(null);
      setSelectedCompany("");

      const authData = {
        Email: data.username,
        Password: data.password,
      };

      const response = await axios.post(
        `${api.ProductionRootUrl}/api/account/login`,
        authData
      );

      if (response.data) {
        setUser(data.username);
        setAccessToken(response.data.AccessToken);
        setRefreshToken(response.data.RefreshToken);
        setTokenSavedTime(new Date());

        await localStorage.setItem("user", data.username);
        setNewAccessToken(response.data.AccessToken);
        setNewRefreshToken(response.data.RefreshToken);

        // console.log(response.data);
        if (redirectTo) {
          navigate(`/${redirectTo}`);
          window.location.reload();
        } else {
          navigate("/");
          window.location.reload();
        }
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

  const setSelectedCompanyInLocalStorage = (companyId: string) =>
    localStorage.setItem(localStorageKey.selectedCompany, companyId);

  const logOut = () => {
    setIsLoading(true);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    removeAccessToken();
    removeRefreshToken();
    navigate("/sign-in");
    setIsLoading(false);
    setSelectedCompany("");
    localStorage.removeItem(localStorageKey.selectedCompany);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        tokenSavedTime,
        user,
        loginAction,
        logOut,
        message,
        isLoading,
        setNewAccessToken,
        setNewRefreshToken,
        removeAccessToken,
        removeRefreshToken,
        selectedCompany,
        setSelectedCompany: setSelectedCompanyInLocalStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
