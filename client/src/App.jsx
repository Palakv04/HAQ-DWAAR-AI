import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';

import { DashboardPage } from './pages/DashboardPage';
import { PassportPage } from './pages/PassportPage';
import { SchemesPage } from './pages/SchemesPage';
import { AiMitraPage } from './pages/AiMitraPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { NotificationAnalysisPage } from './pages/NotificationAnalysisPage';
import { ClaimVerificationPage } from './pages/ClaimVerificationPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

import { AiMitraVoiceModal } from './components/AiMitraVoiceModal';
import { DigiLockerSyncModal } from './components/DigiLockerSyncModal';
import { ActionPlanModal } from './components/ActionPlanModal';
import { CscKendraModal } from './components/CscKendraModal';
import { DemoJourney } from './components/DemoJourney';

export function AppContent() {
  const navigate = useNavigate();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceModalQuery, setVoiceModalQuery] = useState('');

  const [digiLockerModalOpen, setDigiLockerModalOpen] = useState(false);
  const [targetDocType, setTargetDocType] = useState(null);

  const [actionPlanModalOpen, setActionPlanModalOpen] = useState(false);
  const [selectedSchemeForPlan, setSelectedSchemeForPlan] = useState(null);

  const [cscModalOpen, setCscModalOpen] = useState(false);

  const handleOpenVoice = (initialQuery = '') => {
    setVoiceModalQuery(initialQuery);
    setVoiceModalOpen(true);
  };

  const handleOpenDigiLocker = (docType = null) => {
    setTargetDocType(docType);
    setDigiLockerModalOpen(true);
  };

  const handleOpenActionPlan = (scheme) => {
    setSelectedSchemeForPlan(scheme);
    setActionPlanModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f5fa] text-[#0f172a] selection:bg-purple-200 selection:text-purple-900">
      {/* Top Navbar */}
      <Navbar
        onOpenCscModal={() => setCscModalOpen(true)}
        onOpenDigiLockerModal={() => handleOpenDigiLocker()}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full pt-5 sm:pt-6">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                onOpenVoiceModal={handleOpenVoice}
                onOpenActionPlan={handleOpenActionPlan}
                onOpenDigiLocker={handleOpenDigiLocker}
                onOpenCscModal={() => setCscModalOpen(true)}
                demoJourney={
                  <DemoJourney
                    onOpenVoiceModal={handleOpenVoice}
                    onOpenActionPlan={handleOpenActionPlan}
                    onOpenDigiLocker={handleOpenDigiLocker}
                    onOpenPassport={() => navigate('/passport')}
                    onOpenApplications={() => navigate('/applications')}
                  />
                }
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route
            path="/schemes"
            element={
              <SchemesPage
                onOpenActionPlan={handleOpenActionPlan}
                onOpenDigiLocker={handleOpenDigiLocker}
              />
            }
          />
          <Route
            path="/ai-mitra"
            element={
              <AiMitraPage
                onOpenActionPlan={handleOpenActionPlan}
                onOpenDigiLocker={handleOpenDigiLocker}
              />
            }
          />
          <Route
            path="/documents"
            element={<DocumentsPage onOpenDigiLocker={handleOpenDigiLocker} />}
          />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/notification-analysis" element={<NotificationAnalysisPage />} />
          <Route path="/verify-claim" element={<ClaimVerificationPage />} />
        </Routes>
        </div>
      </main>

      {/* Global Modals */}
      <AiMitraVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        initialQuery={voiceModalQuery}
        onOpenActionPlan={handleOpenActionPlan}
      />

      <DigiLockerSyncModal
        isOpen={digiLockerModalOpen}
        onClose={() => setDigiLockerModalOpen(false)}
        targetDocType={targetDocType}
      />

      <ActionPlanModal
        isOpen={actionPlanModalOpen}
        onClose={() => setActionPlanModalOpen(false)}
        scheme={selectedSchemeForPlan}
        onOpenDigiLocker={handleOpenDigiLocker}
      />

      <CscKendraModal isOpen={cscModalOpen} onClose={() => setCscModalOpen(false)} />

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom Navigation for Mobile Devices */}
      <BottomNav onOpenVoiceModal={() => handleOpenVoice()} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
