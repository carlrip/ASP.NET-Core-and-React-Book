import React, { createContext, FC } from 'react';
import auth0 from 'auth0-js';
import { authSettings } from './AppSettings';

const authZeroClient = new auth0.WebAuth(authSettings);

const userNameKey = 'userName';
const accessTokenKey = 'accessToken';
const expiryKey = 'expiry';

const getUserName = () => localStorage.getItem(userNameKey);
const setUserName = (userName: string) =>
  localStorage.setItem(userNameKey, userName);

export const getAccessToken = () => localStorage.getItem(accessTokenKey);
const setAccessToken = (accessToken: string) =>
  localStorage.setItem(accessTokenKey, accessToken);

const getExpiry = () => localStorage.getItem(expiryKey);
const setExpiry = (expiry: string) => localStorage.setItem(expiryKey, expiry);

const isAuthenticated = () => {
  const expiry = getExpiry();
  if (expiry === null) {
    return false;
  } else {
    const expiryInMillisecs = Number(expiry) * 1000;
    return new Date().getTime() < expiryInMillisecs;
  }
};

const signIn = () => authZeroClient.authorize();

const signInCallback = () => {
  authZeroClient.parseHash((err, authResult) => {
    saveAuthInLocalStorage(err, authResult);
    window.location.replace(window.location.origin);
  });
};

const signOut = () => {
  clearAuthFromLocalStorage();
  authZeroClient.logout({
    returnTo: window.location.origin + '/signout-callback',
  });
};

const renew = () => {
  if (
    window.location.pathname !== '/signin-callback' &&
    window.location.pathname !== '/signout-callback'
  ) {
    authZeroClient.checkSession({}, saveAuthInLocalStorage);
  }
};

const saveAuthInLocalStorage = (
  err: auth0.Auth0ParseHashError | null,
  authResult: auth0.Auth0DecodedHash | null,
) => {
  if (err) {
    console.log(err);
  }
  if (
    !err &&
    authResult &&
    authResult.accessToken &&
    authResult.idTokenPayload &&
    authResult.idTokenPayload.exp
  ) {
    setAccessToken(authResult.accessToken);
    setExpiry(authResult.idTokenPayload.exp);
    setUserName(authResult.idTokenPayload.name);
  } else {
    clearAuthFromLocalStorage();
  }
};

const clearAuthFromLocalStorage = () => {
  localStorage.removeItem(userNameKey);
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(expiryKey);
};

interface AuthContext {
  authZeroClient: auth0.WebAuth;
  getAccessToken: () => string | null;
  isAuthenticated: () => boolean;
  getUserName: () => string | null;
  signIn: () => void;
  signInCallback: () => void;
  signOut: () => void;
  renew: () => void;
}
const authContextValue = (): AuthContext => ({
  authZeroClient,
  getAccessToken,
  isAuthenticated,
  getUserName,
  signIn,
  signInCallback,
  signOut,
  renew,
});
export const AuthContext = createContext<AuthContext>(authContextValue());

export const AuthProvider: FC = ({ children }) => {
  return (
    <AuthContext.Provider value={authContextValue()}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
