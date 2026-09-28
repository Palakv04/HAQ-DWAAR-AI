import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Tractor,
  Users,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

export const PassportPage = () => {
  const { profile, readiness, refreshUserData, language } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    age: 20,
    gender: 'Male',
    state: 'Bihar',
    district: 'Samastipur',
    blockPanchayat: 'Kalyanpur Gram Panchayat',
    education: '12th_pass',
    marks12thPercentage: 78.4,
    occupation: 'student',
    casteCategory: 'OBC',
    annualIncome: 160000,
    incomeRange: '1 - 2.5 Lakhs',
    studentDetails: {
      institution: 'Samastipur College',
      course: 'B.Tech Computer Science',
      currentYear: 1,
      annualTuitionFees: 85000,
    },
    farmerDetails: {
      isFarmerFamily: true,
      landHoldingAcres: 1.5,
      landOwnership: 'owned',
      crops: ['Wheat', 'Maize'],
    },
    familyDetails: {
      membersCount: 5,
      rationCardNumber: 'BR-SAM-9012',
      rationCardType: 'PHH (Kalyan Patra)',
    },
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || 20,
        gender: profile.gender || 'Male',
        state: profile.state || 'Bihar',
        district: profile.district || 'Samastipur',
        blockPanchayat: profile.blockPanchayat || 'Kalyanpur Gram Panchayat',
        education: profile.education || '12th_pass',
        marks12thPercentage: profile.marks12thPercentage || 78.4,
        occupation: profile.occupation || 'student',
        casteCategory: profile.casteCategory || 'OBC',
        annualIncome: profile.annualIncome || 160000,
        incomeRange: profile.incomeRange || '1 - 2.5 Lakhs',
        studentDetails: {
          institution: profile.studentDetails?.institution || 'Samastipur College',
          course: profile.studentDetails?.course || 'B.Tech Computer Science',
          currentYear: profile.studentDetails?.currentYear || 1,
          annualTuitionFees: profile.studentDetails?.annualTuitionFees || 85000,
        },
        farmerDetails: {
          isFarmerFamily: profile.farmerDetails?.isFarmerFamily ?? true,
          landHoldingAcres: profile.farmerDetails?.landHoldingAcres || 1.5,
          landOwnership: profile.farmerDetails?.landOwnership || 'owned',
          crops: profile.farmerDetails?.crops || ['Wheat', 'Maize'],
        },
        familyDetails: {
          membersCount: profile.familyDetails?.membersCount || 5,
          rationCardNumber: profile.familyDetails?.rationCardNumber || 'BR-SAM-9012',
          rationCardType: profile.familyDetails?.rationCardType || 'PHH (Kalyan Patra)',
        },
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      studentDetails: {
        ...prev.studentDetails,
        [name]: value,
      },
    }));
  };

  const handleFarmerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      farmerDetails: {
        ...prev.farmerDetails,
        [name]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient('/profile', {
        method: 'PUT',
        body: formData,
      });
      if (res.success) {
        setSaveSuccess(true);
        await refreshUserData();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] rounded-3xl p-6 text-white shadow-haq flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] bg-orange-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Citizen Entitlement ID
            </span>
            <span className="text-xs text-purple-200">Aadhaar e-KYC Verified</span>
          </div>
          <h1 className="text-2xl font-black mt-1">
            {language === 'hi' ? 'नागरिक अधिकार पासपोर्ट (Benefit Passport)' : 'Citizen Benefit Passport'}
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            This structured profile feeds the deterministic eligibility engine. Keep it updated to unlock maximum state &amp; central benefits.
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center shrink-0 border border-white/20">
          <div className="text-2xl font-black text-orange-400">
            {profile?.profileCompletion || 85}%
          </div>
          <div className="text-[10px] text-purple-200 font-bold uppercase">Passport Completion</div>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold p-4 rounded-2xl flex items-center space-x-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Benefit Passport successfully persisted in MongoDB and readiness scores re-evaluated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Demographics */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-purple-50">
            <User className="w-5 h-5 text-purple-800" />
            <h3 className="text-base font-extrabold text-[#2b0f4c]">1. व्यक्तिगत विवरण (Personal &amp; Location)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">State (राज्य)</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">District (जिला)</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Panchayat / Block</label>
              <input
                type="text"
                name="blockPanchayat"
                value={formData.blockPanchayat}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education, Income & Caste */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-purple-50">
            <GraduationCap className="w-5 h-5 text-purple-800" />
            <h3 className="text-base font-extrabold text-[#2b0f4c]">
              2. शिक्षा व सामाजिक वर्ग (Education, Caste &amp; Income)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
            <div>
              <label className="block mb-1">Highest Education Level</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              >
                <option value="10th_pass">10th Pass</option>
                <option value="12th_pass">12th Pass</option>
                <option value="undergraduate">Undergraduate (College)</option>
                <option value="diploma">Polytechnic / Diploma</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">12th Board Marks (%)</label>
              <input
                type="number"
                step="0.1"
                name="marks12thPercentage"
                value={formData.marks12thPercentage}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>

            <div>
              <label className="block mb-1">Social Category (जाति वर्ग)</label>
              <select
                name="casteCategory"
                value={formData.casteCategory}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="EBC">EBC (Extremely Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Primary Occupation</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              >
                <option value="student">Student (विद्यार्थी)</option>
                <option value="farmer">Farmer / Kisan (किसान)</option>
                <option value="artisan">Artisan / Craftsperson (कारीगर)</option>
                <option value="self_employed">Self Employed (दुकानदार / व्यवसायी)</option>
                <option value="daily_wage">Daily Wage Worker (दैनिक मजदूर)</option>
                <option value="unemployed">Unemployed Youth</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Annual Household Income (₹)</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>

            <div>
              <label className="block mb-1">Income Bracket</label>
              <select
                name="incomeRange"
                value={formData.incomeRange}
                onChange={handleChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              >
                <option value="< 1 Lakh">Below ₹1 Lakh</option>
                <option value="1 - 2.5 Lakhs">₹1 Lakh - ₹2.5 Lakhs</option>
                <option value="2.5 - 5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs</option>
                <option value="> 5 Lakhs">Above ₹5 Lakhs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Student Details */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-purple-50">
            <Building className="w-5 h-5 text-purple-800" />
            <h3 className="text-base font-extrabold text-[#2b0f4c]">
              3. उच्च शिक्षा विवरण (Higher Education Details)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
            <div>
              <label className="block mb-1">Enrolled College / University</label>
              <input
                type="text"
                name="institution"
                value={formData.studentDetails.institution}
                onChange={handleStudentChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Degree / Course Name</label>
              <input
                type="text"
                name="course"
                value={formData.studentDetails.course}
                onChange={handleStudentChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Annual Tuition Fees (₹)</label>
              <input
                type="number"
                name="annualTuitionFees"
                value={formData.studentDetails.annualTuitionFees}
                onChange={handleStudentChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Current Academic Year</label>
              <input
                type="number"
                name="currentYear"
                value={formData.studentDetails.currentYear}
                onChange={handleStudentChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Farmer / Family details */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-purple-50">
            <Tractor className="w-5 h-5 text-purple-800" />
            <h3 className="text-base font-extrabold text-[#2b0f4c]">
              4. कृषि व परिवार विवरण (Agriculture &amp; Family Record)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-700">
            <div>
              <label className="block mb-1">Land Holding (Acres)</label>
              <input
                type="number"
                step="0.1"
                name="landHoldingAcres"
                value={formData.farmerDetails.landHoldingAcres}
                onChange={handleFarmerChange}
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Ration Card Number</label>
              <input
                type="text"
                name="rationCardNumber"
                value={formData.familyDetails.rationCardNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    familyDetails: { ...prev.familyDetails, rationCardNumber: e.target.value },
                  }))
                }
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
            <div>
              <label className="block mb-1">Ration Card Category</label>
              <input
                type="text"
                name="rationCardType"
                value={formData.familyDetails.rationCardType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    familyDetails: { ...prev.familyDetails, rationCardType: e.target.value },
                  }))
                }
                className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2b0f4c] hover:bg-[#3d156b] text-white font-extrabold py-3 px-8 rounded-xl text-sm transition flex items-center space-x-2 shadow-md shadow-purple-900/20 active:scale-[0.99]"
          >
            <Save className="w-4 h-4 text-orange-400" />
            <span>{saving ? 'Saving to Database...' : 'Save Benefit Passport & Recalculate'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
