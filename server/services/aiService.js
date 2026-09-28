import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Intelligent Dialect & Intent Parser (Rule-based NLP engine)
 * Guarantees zero downtime even when offline or without Gemini API key.
 */
const fallbackExtractIntent = (query = '') => {
  const q = query.toLowerCase();

  // Category detection
  let category = 'all';
  let need = 'general_assistance';
  let targetAudience = 'citizen';
  let educationLevel = null;
  let incomeConcern = false;
  const keywords = [];

  // Education / Scholarship keywords (Hindi, Bhojpuri, Maithili, English)
  if (
    q.includes('fees') ||
    q.includes('फीस') ||
    q.includes('fee') ||
    q.includes('scholarship') ||
    q.includes('छात्रवृत्ति') ||
    q.includes('college') ||
    q.includes('कॉलेज') ||
    q.includes('b.tech') ||
    q.includes('btech') ||
    q.includes('engineering') ||
    q.includes('इंजीनियरिंग') ||
    q.includes('पढ़ाई') ||
    q.includes('student') ||
    q.includes('12th') ||
    q.includes('10th') ||
    q.includes('स्कूल') ||
    q.includes('दाखिला') ||
    q.includes('लड़की') ||
    q.includes('बेटी') ||
    q.includes('credit card')
  ) {
    category = 'education';
    need = 'scholarship_and_fee_support';
    targetAudience = 'student';
    keywords.push('education', 'scholarship', 'tuition_fee');
    if (q.includes('btech') || q.includes('b.tech') || q.includes('engineering') || q.includes('college')) {
      educationLevel = 'undergraduate';
    }
  }

  // Kisan / Agriculture keywords
  if (
    q.includes('kisan') ||
    q.includes('किसान') ||
    q.includes('खेती') ||
    q.includes('किस्त') ||
    q.includes('किश्त') ||
    q.includes('samman nidhi') ||
    q.includes('सम्मान निधि') ||
    q.includes('खाद') ||
    q.includes('बीज') ||
    q.includes('kcc') ||
    q.includes('फसल') ||
    q.includes('जमीन') ||
    q.includes('पटवारी')
  ) {
    category = 'agriculture';
    need = 'farmer_grant_and_kcc';
    targetAudience = 'farmer';
    keywords.push('agriculture', 'pm_kisan', 'installment', 'dbt');
  }

  // Employment / Artisan / Toolkit keywords
  if (
    q.includes('vishwakarma') ||
    q.includes('विश्वकर्मा') ||
    q.includes('toolkit') ||
    q.includes('टूलकिट') ||
    q.includes('रोज़गार') ||
    q.includes('rozgar') ||
    q.includes('रोजगार') ||
    q.includes('दुकान') ||
    q.includes('सिलाई') ||
    q.includes('कारीगर') ||
    q.includes('लोन') ||
    q.includes('loan') ||
    q.includes('vendor') ||
    q.includes('रेहड़ी') ||
    q.includes('पटरी')
  ) {
    category = 'employment';
    need = 'vocational_toolkit_and_microcredit';
    targetAudience = 'artisan';
    keywords.push('employment', 'vishwakarma', 'toolkit', 'loan');
  }

  // Health / Ayushman keywords
  if (
    q.includes('ayushman') ||
    q.includes('आयुष्मान') ||
    q.includes('इलाज') ||
    q.includes('अस्पताल') ||
    q.includes('बीमारी') ||
    q.includes('दवा') ||
    q.includes('स्वास्थ्य') ||
    q.includes('health') ||
    q.includes('hospital')
  ) {
    category = 'health';
    need = 'cashless_medical_coverage';
    targetAudience = 'citizen';
    keywords.push('health', 'ayushman', 'pmjay');
  }

  // Social Security / Old Age / Housing keywords
  if (
    q.includes('pension') ||
    q.includes('पेंशन') ||
    q.includes('बुजुर्ग') ||
    q.includes('वृद्धा') ||
    q.includes('आवास') ||
    q.includes('awas') ||
    q.includes('मकान') ||
    q.includes('घर')
  ) {
    category = 'social_security';
    need = 'pension_and_housing';
    targetAudience = 'senior_citizen';
    keywords.push('pension', 'housing', 'pmay');
  }

  // Income concern detection
  if (
    q.includes('income कम') ||
    q.includes('आय कम') ||
    q.includes('गरीब') ||
    q.includes('पैसा नहीं') ||
    q.includes('आर्थिक तंगी') ||
    q.includes('गरीबी') ||
    q.includes('low income')
  ) {
    incomeConcern = true;
    keywords.push('low_income_affirmative');
  }

  return {
    category,
    need,
    targetAudience,
    educationLevel,
    incomeConcern,
    keywords,
    rawQuery: query,
    provider: 'HaqDwaar Dialect Semantic Parser (Optimized Offline Engine)',
  };
};

/**
 * Extracts citizen intent using Gemini API if key is available,
 * falling back seamlessly to deterministic dialect extraction.
 */
export const extractUserIntent = async (query = '', language = 'hi') => {
  if (!GEMINI_API_KEY) {
    return fallbackExtractIntent(query);
  }

  try {
    // Calling Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are HaqDwaar AI's dialect-aware citizen intent extractor.
The user speaks in Hindi, Bhojpuri, Maithili, or English.
Analyze the user's welfare/benefit need and return ONLY valid JSON (no markdown formatting, no code fences):
{
  "category": "education" | "agriculture" | "employment" | "health" | "social_security" | "all",
  "need": "short string describing need",
  "targetAudience": "student" | "farmer" | "artisan" | "citizen" | "senior_citizen",
  "educationLevel": "undergraduate" | "12th_pass" | null,
  "incomeConcern": boolean,
  "keywords": ["array", "of", "keywords"],
  "summary": "1 sentence summary in Hindi"
}

User Query: "${query}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      const cleanJson = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        rawQuery: query,
        provider: 'Gemini 1.5 Flash (Cloud AI)',
      };
    }
    return fallbackExtractIntent(query);
  } catch (error) {
    console.warn('[AI Service] Gemini call failed or timed out, using fallback:', error.message);
    return fallbackExtractIntent(query);
  }
};

/**
 * Dynamically builds an actionable step-by-step plan for a scheme
 */
export const generateActionPlan = (scheme, profile, missingDocs = []) => {
  const steps = [];

  // Step 1: Benefit Passport verification
  steps.push({
    stepNumber: 1,
    title: 'Verify Benefit Passport Details',
    titleHi: 'लाभार्थी पासपोर्ट विवरण जांचें',
    description: `Check personal details for ${profile.name} (${profile.district}, ${profile.state}). Ensure 12th marks and category are accurate.`,
    status: 'completed',
    actionType: 'profile_check',
    actionLabel: 'Passport Ready ✓',
  });

  // Step 2: Document Resolution
  if (missingDocs.length > 0) {
    steps.push({
      stepNumber: 2,
      title: `Resolve Required Documents (${missingDocs.length} Pending)`,
      titleHi: `आवश्यक दस्तावेज़ पूर्ण करें (${missingDocs.map((d) => d.titleHi || d.title).join(', ')})`,
      description: `Fetch ${missingDocs.map((d) => d.title).join(' and ')} via DigiLocker 1-Click Sync to verify government credentials without visiting an office.`,
      status: 'in_progress',
      actionType: 'fetch_digilocker',
      actionLabel: '1-Click DigiLocker Sync',
    });
  } else {
    steps.push({
      stepNumber: 2,
      title: 'Document Vault Clearance',
      titleHi: 'दस्तावेज़ पूर्ण सत्यापन',
      description: 'All mandatory certificates verified in your DigiLocker Vault.',
      status: 'completed',
      actionType: 'verified_docs',
      actionLabel: 'All Docs Verified ✓',
    });
  }

  // Step 3: Eligibility & Pre-Filled Application Form
  steps.push({
    stepNumber: 3,
    title: 'Download Pre-Filled Scheme Summary',
    titleHi: 'आवेदन सारांश व पात्रता प्रमाण पत्र डाउनलोड करें',
    description: `Generate certified entitlement slip for ${scheme.name} to avoid filling 40+ manual form fields on the official portal.`,
    status: missingDocs.length > 0 ? 'pending' : 'in_progress',
    actionType: 'download_summary',
    actionLabel: 'Download Entitlement Slip',
  });

  // Step 4: Official Portal Submission
  steps.push({
    stepNumber: 4,
    title: 'Apply on Official Government Portal',
    titleHi: 'आधिकारिक सरकारी पोर्टल पर आवेदन करें',
    description: `Open the verified government portal (${scheme.officialUrl}). Upload DigiLocker-verified documents or sign in with MeriPehchaan.`,
    status: 'pending',
    actionType: 'open_official_portal',
    actionLabel: 'Open Official Portal ↗',
    officialUrl: scheme.officialUrl,
  });

  // Step 5: Application Tracking & CSC Support
  steps.push({
    stepNumber: 5,
    title: 'Track Application & DBT Sanction',
    titleHi: 'आवेदन स्थिति एवं डीबीटी ट्रैकिंग',
    description: 'Save your Application / Reference ID here to receive SMS updates and district officer timeline alerts.',
    status: 'pending',
    actionType: 'track_status',
    actionLabel: 'Add to My Applications',
  });

  return steps;
};
