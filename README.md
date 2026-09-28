# 🏛️ HaqDwaar AI (हकद्वार)
### *Scheme se Application Tak — Rural Citizen Benefit Readiness & Entitlement Platform*

![HaqDwaar AI](https://img.shields.io/badge/Status-Active-brightgreen)
![Node](https://img.shields.io/badge/Node-v18%2B-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac)
![License](https://img.shields.io/badge/License-MIT-purple)

HaqDwaar AI is an intelligent civic-tech platform designed to simplify Indian government welfare schemes for rural citizens. It tackles low entitlement awareness, bureaucratic paperwork hurdles, and language barriers through an intuitive bilingual interface (Hindi & English), proactive eligibility scoring, voice AI guidance, and DigiLocker integration.

---

## ✨ Key Features

- 🎯 **Benefit Readiness Score (0-100):** Real-time gauge evaluating documentation readiness, Aadhaar-bank DBT seeding, and profile eligibility.
- 🎙️ **AI Mitra (Voice & Chat Assistant):** Multilingual voice support (Hindi/English) powered by Web Speech API for low-literacy citizens.
- 📋 **Scheme Matching Engine:** Matches citizen demographics against Central & State scheme criteria (e.g. PM-Kisan, PM SVANidhi, Medhavi Vidyarthi Yojana).
- 🔒 **DigiLocker Vault Integration:** Instant certificate fetching and expiry tracking (Income, Caste, Residence, Marksheets).
- 📍 **Near Me CSC Kendra Locator:** Embedded OpenStreetMap with live GPS markers, distance calculation, operational hours, and token wait estimation.
- 📝 **7-Step Action Plan:** Step-by-step checklist to guide citizens from eligibility check to offline office verification or online portal submission.
- 📄 **Notice & Circular AI Parser:** Summarizes government PDFs and gazettes to extract deadlines and eligibility revisions in plain language.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS, Lucide Icons, React Router 7
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Document Processing:** `pdf-parse`, `multer`
- **Maps:** OpenStreetMap integration with custom beacon overlays
- **Speech:** Web Speech Recognition & SpeechSynthesis APIs

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or on MongoDB Atlas

### 1. Clone the Repository
```bash
git clone https://github.com/Palakv04/HAQ-DWAAR-AI.git
cd HAQ-DWAAR-AI
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run seed     # (Optional: seeds schemes and default data)
npm run dev      # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev      # Starts frontend on http://localhost:3000
```

---

## 🛡️ Security & Privacy
- Sensitive keys (`.env`), build files (`dist/`), and dependencies (`node_modules/`) are strictly excluded via `.gitignore`.
- Citizen identity documents are processed with simulated OAuth DigiLocker verification.

---

## 📜 License
This project is open-source under the MIT License.
