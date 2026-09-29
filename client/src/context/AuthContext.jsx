import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { demoDocuments, demoProfile, demoReadiness, demoUser } from '../data/demoData';
import { translate } from '../data/i18n';

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
      console.warn('Using local demo citizen because the API is unavailable:', err.message);
      localStorage.setItem('haqdwaar_demo_mode', 'true');
      const savedProfile = localStorage.getItem('haqdwaar_demo_profile');
      let localProfile = demoProfile;
      if (savedProfile) {
        try {
          localProfile = { ...demoProfile, ...JSON.parse(savedProfile) };
        } catch {
          localStorage.removeItem('haqdwaar_demo_profile');
        }
      }
      setUser(demoUser);
      setProfile(localProfile);
      setDocuments(demoDocuments);
      setReadiness(demoReadiness);
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

  const t = (key) => translate(language, key);

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
    if (localStorage.getItem('haqdwaar_demo_mode') === 'true') {
      const savedProfile = localStorage.getItem('haqdwaar_demo_profile');
      let localProfile = demoProfile;
      if (savedProfile) {
        try {
          localProfile = { ...demoProfile, ...JSON.parse(savedProfile) };
        } catch {
          localStorage.removeItem('haqdwaar_demo_profile');
        }
      }
      setProfile(localProfile);
      setDocuments((current) => current.length ? current : demoDocuments);
      setReadiness((current) => current || demoReadiness);
      return;
    }
    await fetchProfileAndDocs();
  };

  const saveProfile = async (updates) => {
    if (localStorage.getItem('haqdwaar_demo_mode') === 'true') {
      const savedProfile = localStorage.getItem('haqdwaar_demo_profile');
      let currentProfile = demoProfile;
      if (savedProfile) {
        try {
          currentProfile = { ...demoProfile, ...JSON.parse(savedProfile) };
        } catch {
          localStorage.removeItem('haqdwaar_demo_profile');
        }
      }

      const nextProfile = {
        ...currentProfile,
        ...updates,
        studentDetails: { ...currentProfile.studentDetails, ...updates.studentDetails },
        farmerDetails: { ...currentProfile.farmerDetails, ...updates.farmerDetails },
        familyDetails: { ...currentProfile.familyDetails, ...updates.familyDetails },
      };
      localStorage.setItem('haqdwaar_demo_profile', JSON.stringify(nextProfile));
      setProfile(nextProfile);
      return { success: true, profile: nextProfile, readiness: readiness || demoReadiness };
    }

    const response = await apiClient('/profile', { method: 'PUT', body: updates });
    if (response.success) {
      setProfile(response.profile);
      setReadiness(response.readiness || readiness);
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        readiness,
        documents,
        language,
        t,
        loading,
        activeMode,
        changeLanguage,
        changeMode,
        refreshUserData,
        saveProfile,
        loginDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
