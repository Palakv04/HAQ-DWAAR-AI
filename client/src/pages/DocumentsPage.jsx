import React, { useState } from 'react';
import {
  FolderSync,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Upload,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

export const DocumentsPage = ({ onOpenDigiLocker }) => {
  const { documents, refreshUserData, language } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDocData, setNewDocData] = useState({
    docType: 'caste_certificate',
    title: 'Caste Certificate (जाति प्रमाण पत्र)',
    docNumber: 'BR-CST-2024-9021',
    issuer: 'Circle Officer, Kalyanpur',
  });
  const [uploading, setUploading] = useState(false);

  const handleManualUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const res = await apiClient('/documents/upload', {
        method: 'POST',
        body: newDocData,
      });
      if (res.success) {
        setUploadModalOpen(false);
        await refreshUserData();
      }
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setUploading(false);
    }
  };

  const verifiedCount = documents.filter((d) => d.status === 'verified').length;
  const pendingCount = documents.filter((d) => d.status === 'action_needed' || d.status === 'expired').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] rounded-3xl p-6 sm:p-8 text-white shadow-haq flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-emerald-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              DigiLocker Verified Vault
            </span>
            <span className="text-xs text-purple-200">MeitY Certified Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? 'दस्तावेज़ स्वास्थ्य व डिजिलॉकर वॉल्ट' : 'Document Health & DigiLocker Vault'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Keep your certificates digitally synchronized to eliminate paper delays and automatically satisfy scheme criteria.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenDigiLocker?.()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sync All DigiLocker</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-black text-[#2b0f4c]">{verifiedCount}</div>
            <div className="text-[11px] font-bold text-gray-500">Verified Certificates</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="text-lg font-black text-[#2b0f4c]">{pendingCount}</div>
            <div className="text-[11px] font-bold text-gray-500">Action Pending</div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2b0f4c]">Manual Add</div>
              <div className="text-[11px] text-gray-500">Upload Seal Copy</div>
            </div>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-50">
          <h3 className="text-base font-extrabold text-[#2b0f4c]">
            सत्यापित प्रमाणपत्र सूची (Citizen Document Vault)
          </h3>
          <span className="text-xs text-gray-500 font-semibold">{documents.length} Records</span>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => {
            const isVerified = doc.status === 'verified';
            const isActionNeeded = doc.status === 'action_needed' || doc.status === 'expired';

            return (
              <div
                key={doc._id}
                className="border border-purple-100 rounded-2xl p-4 hover:border-purple-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#faf9fc]"
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-extrabold text-[#2b0f4c]">
                        {language === 'hi' && doc.titleHi ? doc.titleHi : doc.title}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mt-0.5">
                      {doc.issuer} • <span className="font-mono">{doc.docNumber || 'Unlinked'}</span>
                    </div>

                    {doc.remarks && (
                      <div className="text-[11px] text-gray-500 mt-1 italic">
                        Notice: {doc.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  {!isVerified && (
                    <button
                      onClick={() => onOpenDigiLocker?.(doc.docType)}
                      className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                    >
                      <Lock className="w-3.5 h-3.5 text-orange-400" />
                      <span>Sync via DigiLocker</span>
                    </button>
                  )}
                  {isVerified && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      e-KYC Verified ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-purple-200 text-gray-900">
            <h3 className="text-base font-extrabold text-[#2b0f4c]">
              मैनुअल दस्तावेज़ जोड़ें (Add Certificate)
            </h3>
            <form onSubmit={handleManualUpload} className="space-y-3 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">Document Type</label>
                <select
                  value={newDocData.docType}
                  onChange={(e) => setNewDocData({ ...newDocData, docType: e.target.value })}
                  className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900"
                >
                  <option value="caste_certificate">Caste Certificate (जाति प्रमाण पत्र)</option>
                  <option value="marksheet_12th">12th Marksheet</option>
                  <option value="income_certificate">Income Certificate</option>
                  <option value="land_record_khatauni">Land Record / Khatauni</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocData.title}
                  onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                  className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Certificate / Registration Number</label>
                <input
                  type="text"
                  value={newDocData.docNumber}
                  onChange={(e) => setNewDocData({ ...newDocData, docNumber: e.target.value })}
                  className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={newDocData.issuer}
                  onChange={(e) => setNewDocData({ ...newDocData, issuer: e.target.value })}
                  className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white font-bold px-5 py-2 rounded-xl"
                >
                  {uploading ? 'Verifying...' : 'Save & Verify Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
