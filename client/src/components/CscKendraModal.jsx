import React, { useState } from 'react';
import {
  X,
  Phone,
  Ticket,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  Building2,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CscKendraModal = ({ isOpen, onClose }) => {
  const { profile, language } = useAuth();
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [callActive, setCallActive] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-purple-200 overflow-hidden text-gray-900">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2b0f4c] to-[#4d1e8d] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">निकटतम जन सेवा केंद्र (CSC Kendra)</h3>
              <p className="text-[11px] text-purple-200">Common Service Center Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Kendra Card */}
          <div className="border border-purple-100 rounded-2xl p-4 bg-purple-50/50 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded uppercase">
                  Verified e-Gov Hub
                </span>
                <h4 className="text-sm font-extrabold text-[#2b0f4c] mt-1">
                  {profile?.district || 'Nearby'} CSC Digital Seva Kendra
                </h4>
                <div className="text-xs text-gray-600 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>Nearest CSC, {profile?.district || 'Your District'}, {profile?.state || 'Your State'}</span>
                </div>
              </div>
              <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Open Now
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-purple-100/80">
              <div className="flex items-center space-x-1.5 text-gray-700">
                <Clock className="w-3.5 h-3.5 text-purple-700" />
                <span>Open till 7:00 PM</span>
              </div>
              <div className="flex items-center space-x-1.5 text-gray-700">
                <Ticket className="w-3.5 h-3.5 text-orange-600" />
                <span>Wait: ~15 mins</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-purple-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs">
                  VLE
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2b0f4c]">CSC VLE Operator</div>
                  <div className="text-[10px] text-gray-500">Certified Nodal Assistant</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                ★ 4.9 Top Rated
              </span>
            </div>
          </div>

          {/* Token booking result */}
          {tokenGenerated ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center space-y-1.5 animate-in zoom-in-95">
              <div className="inline-flex w-10 h-10 rounded-full bg-emerald-500 text-white items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-extrabold text-emerald-950">
                Token Booked: HQD-TOKEN-#24
              </h5>
              <p className="text-xs text-emerald-800 leading-snug">
                Your digital queue token has been sent to your registered mobile. Present this QR at the counter to skip physical queues.
              </p>
            </div>
          ) : callActive ? (
            <div className="bg-orange-50 border border-orange-300 rounded-2xl p-4 text-center space-y-1.5 animate-in zoom-in-95">
              <Phone className="w-6 h-6 text-orange-600 mx-auto animate-bounce" />
              <h5 className="text-sm font-extrabold text-orange-950">
                Calling CSC VLE Operator...
              </h5>
              <p className="text-xs text-orange-800">
                Dialing Toll-Free Relay: +91 1800-180-1515 (CSC National Helpline)
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCallActive(true)}
                className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white font-extrabold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>कॉल करें (Call)</span>
              </button>

              <button
                onClick={() => setTokenGenerated(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
              >
                <Ticket className="w-4 h-4" />
                <span>बुक टोकन (Token)</span>
              </button>
            </div>
          )}

          <div className="text-[11px] text-gray-500 text-center leading-relaxed">
            CSC e-Gov Kendras assist with biometric scanning, document printouts, and direct portal authentication.
          </div>
        </div>
      </div>
    </div>
  );
};
