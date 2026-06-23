import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

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

  const login = async ({ email, password }) => {
    setError(null);
    const session = await api.login({ email, password });
    await loadProfile(session.token);
  };

  const registerClient = async (payload) => {
    setError(null);
    const response = await api.register(payload);
    await loadProfile(response.token);
  };

  const loginDemo = async () => {
    setError(null);
    await login({
      email: 'qhiro-symbiotic@qhiro-symbiotic.com',
      password: '123456789',
    });
  };

  const logout = async () => {
    setError(null);
    setProfile(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const refreshProfile = async () => {
    if (!token) return;
    await loadProfile(token);
  };

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
      loginDemo,
      registerClient,
      logout,
      refreshProfile,
      setError,
    }),
    [profile, token, loading, error, loadProfile],
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
