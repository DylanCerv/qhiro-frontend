import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { auth, sendPasswordResetEmail, signInWithEmailAndPassword } from '../config/firebase';
import { ui } from '../i18n/es';

const TOKEN_KEY = 'qhiro_auth_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async (authToken) => {
    api.setToken(authToken);
    const response = await api.getMe();
    setProfile(response.user);
    setToken(authToken);
    localStorage.setItem(TOKEN_KEY, authToken);
    setError(null);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    loadProfile(savedToken).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      api.setToken(null);
      setProfile(null);
      setToken(null);
    }).finally(() => setLoading(false));
  }, [loadProfile]);

  const registerClient = useCallback(async (payload) => {
    setError(null);
    const response = await api.register(payload);
    // Access requests stay pending: never open an authenticated session.
    api.setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    setProfile(null);
    setToken(null);
    return response;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const session = await api.login({ email, password });
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    }
    try {
      await loadProfile(session.token);
    } catch (err) {
      api.setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      setProfile(null);
      setToken(null);
      const message = err?.message ?? ui.auth.accountPending;
      throw new Error(message);
    }
  }, [loadProfile]);

  const resetPassword = useCallback(async (email) => {
    setError(null);
    if (!email) {
      throw new Error('Ingresa tu correo electrónico para recuperar la contraseña.');
    }
    if (!auth) {
      throw new Error('La recuperación de contraseña no está disponible en este momento.');
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setProfile(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    await loadProfile(token);
  }, [loadProfile, token]);

  const value = useMemo(
    () => ({
      profile,
      token,
      loading,
      error,
      isAuthenticated: Boolean(profile),
      isAdmin: profile?.role === 'admin',
      isClient: profile?.role === 'client',
      login,
      registerClient,
      resetPassword,
      logout,
      refreshProfile,
      setError,
    }),
    [profile, token, loading, error, login, registerClient, resetPassword, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
