import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem('haqdwaar_lang') || 'hi');
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('Student');

  const fetchProfileAndDocs = async () => {
    try {
      const [profileRes, docsRes] = await Promise.all([
        apiClient('/profile'),
        apiClient('/documents'),
      ]);

      if (profileRes.success) {
        setProfile(profileRes.profile);
        if (profileRes.profile.activeMode) {
          setActiveMode(profileRes.profile.activeMode);
        }
      }
      if (docsRes.success) {
        setDocuments(docsRes.documents);
        setReadiness(docsRes.readiness || profileRes.readiness);
      }
    } catch (err) {
      console.warn('Could not load profile or documents:', err.message);
    }
  };

  const loginDemoUser = async () => {
    try {
      setLoading(true);
      const res = await apiClient('/auth/demo-login', { method: 'POST' });
      if (res.success) {
        localStorage.setItem('haqdwaar_token', res.token);
        setUser(res.user);
        await fetchProfileAndDocs();
      }
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('haqdwaar_token');
      if (token) {
        try {
          const res = await apiClient('/auth/me');
          if (res.success) {
            setUser(res.user);
            await fetchProfileAndDocs();
          } else {
            await loginDemoUser();
          }
        } catch {
          await loginDemoUser();
        } finally {
          setLoading(false);
        }
      } else {
        await loginDemoUser();
      }
    };
    init();
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('haqdwaar_lang', lang);
  };

  const changeMode = async (mode) => {
    setActiveMode(mode);
    try {
      await apiClient('/profile/mode', {
        method: 'PATCH',
        body: { mode },
      });
      if (profile) {
        setProfile((prev) => ({ ...prev, activeMode: mode }));
      }
    } catch (err) {
      console.warn('Failed to persist mode update:', err);
    }
  };

  const refreshUserData = async () => {
    await fetchProfileAndDocs();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        readiness,
        documents,
        language,
        loading,
        activeMode,
        changeLanguage,
        changeMode,
        refreshUserData,
        loginDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
