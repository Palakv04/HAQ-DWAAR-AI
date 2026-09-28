import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Landmark,
  GraduationCap,
  Tractor,
  Briefcase,
  Heart,
  Shield,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { SchemeCard } from '../components/SchemeCard';

export const SchemesPage = ({ onOpenActionPlan, onOpenDigiLocker }) => {
  const { language, activeMode, changeMode } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, [category, level, search, activeMode]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (level !== 'all') params.append('level', level);
      if (search.trim()) params.append('search', search.trim());

      const res = await apiClient(`/schemes?${params.toString()}`);
      if (res.success) {
        setSchemes(res.schemes);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Schemes (सभी)' },
    { id: 'education', label: 'Education (शिक्षा)' },
    { id: 'agriculture', label: 'Agriculture (खेती)' },
    { id: 'employment', label: 'Employment (रोजगार)' },
    { id: 'health', label: 'Health (स्वास्थ्य)' },
    { id: 'social_security', label: 'Social Security (पेंशन)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2b0f4c] via-[#4d1e8d] to-[#6c28a8] rounded-3xl p-6 sm:p-8 text-white shadow-haq flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-orange-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Verified Database
            </span>
            <span className="text-xs text-purple-200">Zero Fake Schemes Guaranteed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {language === 'hi' ? 'सरकारी योजना निर्देशिका' : 'Government Welfare Schemes'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Every scheme below contains verified eligibility rules, required document checklists, and direct links to official state and central portals.
          </p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20 shrink-0">
          <div className="text-2xl font-black text-orange-400">{schemes.length}</div>
          <div className="text-[10px] text-purple-200 font-bold uppercase">Schemes Cataloged</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="योजना का नाम, विभाग या कीवर्ड खोजें (e.g. छात्रवृत्ति, किसान, टूलकिट)..."
              className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-purple-600"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#f8f6fc] border border-purple-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-bold focus:outline-purple-600"
            >
              <option value="all">All Levels (Central &amp; State)</option>
              <option value="Central">Central Govt (केंद्र सरकार)</option>
              <option value="State">State Govt (राज्य सरकार)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                category === cat.id
                  ? 'bg-[#2b0f4c] text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs font-bold text-gray-500">
          Loading verified schemes and running eligibility engine...
        </div>
      ) : schemes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs font-bold text-gray-500">
          No schemes found matching your search. Try resetting filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schemes.map((scheme, idx) => (
            <SchemeCard
              key={scheme._id || idx}
              scheme={scheme}
              onOpenActionPlan={onOpenActionPlan}
              onOpenDigiLocker={onOpenDigiLocker}
            />
          ))}
        </div>
      )}
    </div>
  );
};
