import React from 'react';
import { PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = () => {
  const { language } = useAuth();

  return (
    <footer className="bg-white border-t border-purple-100 mt-16 text-gray-700 text-xs pb-20 lg:pb-8">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-purple-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
              <h4 className="text-sm font-extrabold text-[#2b0f4c] tracking-tight">
                HaqDwaar Sovereign Welfare Network
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'hi'
                ? 'राष्ट्रीय ई-गवर्नेंस मानकों के तहत स्वचालित योजना खोज, आधार-सहमति पात्रता मिलान और प्रत्यक्ष लाभ अंतरण (DBT) सुविधा प्रदान करने वाला नागरिक मंच।'
                : 'An official citizen assistance layer powering affirmative scheme discovery, Aadhaar-consented entitlement matching, and direct benefit navigation under National e-Governance standards.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5 flex items-center space-x-3">
              <PhoneCall className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Citizen Toll-Free Helpline (24x7)</div>
                <div className="text-sm font-extrabold text-[#2b0f4c]">1800-180-8841</div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">National Gateway</div>
                <div className="text-xs font-bold text-emerald-900">DigiLocker Auth Partner API v3.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Accessibility Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="hover:text-purple-900 cursor-pointer">Privacy Policy (गोपनीयता नीति)</span>
          <span>•</span>
          <span className="hover:text-purple-900 cursor-pointer">Citizen Charter (नागरिक अधिकार)</span>
          <span>•</span>
          <span className="hover:text-purple-900 cursor-pointer">RTI Disclosure (सूचना का अधिकार)</span>
          <span>•</span>
          <span className="hover:text-purple-900 cursor-pointer">Security Compliance</span>
        </div>

        <div className="flex items-center space-x-3 font-medium">
          <span>Accessibility:</span>
          <button className="hover:text-purple-900 px-1 font-bold">A-</button>
          <button className="hover:text-purple-900 px-1 font-bold">A</button>
          <button className="hover:text-purple-900 px-1 font-bold">A+</button>
          <span>|</span>
          <button className="hover:text-purple-900">Audio Reader</button>
          <span>|</span>
          <button className="hover:text-purple-900">High Contrast</button>
        </div>
      </div>

      <div className="text-center py-2 text-[10px] text-gray-400 border-t border-purple-50/50">
        © 2026 Ministry of Public Welfare &amp; Citizen Entitlement • HaqDwaar AI Framework. Designed for 100% citizen accessibility.
      </div>
    </footer>
  );
};
