# PADHO — Learn. Prepare. Grow.

> **A Free Digital Platform for Competitive Exam Preparation for Students.**
> Empowering students after 10th standard and Intermediate with curated, verified competitive examination information, NCERT resources, and bilingual learning materials in English and Telugu.

---

## 1. Project Overview & Startup Vision

PADHO is a modern, minimal, editorial-grade educational platform built to eliminate the barriers students face in competitive exam preparation:
- **Centralized Discovery:** Consolidates dispersed official information for Engineering (JEE Main, JEE Advanced), Government (SSC CGL & CHSL), Banking (IBPS & SBI), and Railway (RRB NTPC & Group D).
- **100% Free Educational Access:** No subscriptions, no gated chapters, and no fake marketing funnels.
- **Bilingual Learning (English & తెలుగు):** Ensuring vernacular students have equal access to syllabus trackers, formulas, and verified notes in their preferred language.
- **Strict Data Integrity:** Zero fabricated student profiles, no fake leaderboard points, no invented percentages, and no dummy testimonials.

---

## 2. Design System: Modern Minimal Emerald Green

- **Canvas Background:** `#F5F4EF` (editorial warm off-white)
- **Surface:** `#FFFFFF`
- **Primary Brand:** `#153D32` (deep forest/emerald green)
- **Secondary Brand:** `#285A48`
- **Soft Accent:** `#D6E7D8` (sage light tint)
- **Main Text:** `#202A25` (rich dark slate)
- **Secondary Text:** `#727A73` (muted grey-green)
- **Border:** `#E6E8E2` (crisp subtle line)
- **Highlight:** `#D8A96B` (warm bronze/gold accent)
- **Typography:** Manrope (headings) & Inter (body)

---

## 3. Technology Architecture

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+ modular controllers). No heavy frameworks, no bloated animation libraries.
- **Backend:** 
  - **Firebase Authentication:** Student registration, login, session persistence, and role-based route guards.
  - **Cloud Firestore:** Scalable NoSQL database for examinations, subjects, topics, verified educational resources, saved bookmarks, and student contact inquiries.
  - **Firebase Storage:** Secure document storage for educational PDFs, syllabi, and study guides.
  - **Local-First Resilient Architecture:** Pre-seeded with official verified records from NTA, NCERT, SSC, IBPS, and RRB. Works seamlessly offline/locally and connects live when Firebase keys are provided.

---

## 4. Project Directory Structure

```
padho/
│
├── index.html                   # Public landing page with hero, streams, bilingual highlights
├── login.html                   # Student & administrator sign-in interface
├── register.html                # Free student registration interface
├── about.html                   # Mission, problem statements, and educational philosophy
├── contact.html                 # Contact form storing submissions into Firestore
├── examinations.html            # Category-filterable directory of all 5 exam streams
├── examination-details.html     # Dynamic examination curriculum, eligibility, and subjects
├── resources.html               # Central Educational Resources Library (search, filters, bookmarks)
├── subject.html                 # Subject & Topic explorer with chapter-level breakdowns
├── dashboard.html               # Student Dashboard (genuine database counts, recent materials)
├── saved-resources.html         # Authenticated student's bookmarked collection
│
├── admin/                       # Administrator Control Panel
│   ├── dashboard.html           # Admin operations overview and metrics
│   ├── examinations.html        # Add, edit, and delete examination records
│   ├── subjects.html            # Manage subjects mapped to examinations
│   ├── topics.html              # Manage topics mapped to subjects
│   ├── resources.html           # Manage educational resources & toggle publication
│   ├── upload-resource.html     # Full resource upload form with file validation
│   ├── messages.html            # Student contact inquiries management
│   └── settings.html            # Firebase credentials, diagnostics, and seed restore
│
├── css/
│   ├── style.css                # Emerald Green design system, typography, buttons, cards
│   ├── responsive.css           # Mobile drawer, tablet grids, touch optimizations
│   ├── animations.css           # Smooth scroll reveal, skeleton shimmer, gentle float
│   ├── auth.css                 # Login, register, and password reset styles
│   ├── dashboard.css            # Student dashboard and saved resources layout
│   └── admin.css                # Admin sidebar, tables, status badges, dropzone
│
├── js/
│   ├── firebase-config.js       # Firebase initialization, config manager, verified seed data
│   ├── auth.js                  # Auth state observer, login, register, role protection
│   ├── navigation.js            # Navbar scroll, mobile drawer, bilingual language switcher
│   ├── login.js                 # Login controller & forgot password handler
│   ├── register.js              # Student registration controller & input validation
│   ├── examinations.js          # Exam directory & dynamic syllabus renderer
│   ├── resources.js             # Resource library search, multi-filter, bookmarking
│   ├── subject.js               # Subject and topic explorer controller
│   ├── dashboard.js             # Student dashboard metrics & greeting
│   ├── saved-resources.js       # Saved bookmarks management
│   ├── contact.js               # Contact form validator & Firestore submission
│   └── admin.js                 # Admin CRUD controllers & connection diagnostics
│
├── assets/
│   ├── icons/                   # Clean SVG icons (padho-logo, exam badges)
│   └── illustrations/           # Startup hero illustration, empty-state graphics
│
├── firebase/
│   ├── firestore.rules          # Production Cloud Firestore Security Rules
│   └── storage.rules            # Production Firebase Storage Security Rules
│
└── README.md                    # Startup deployment & setup documentation
```

---

## 5. Firebase Setup Guide

### Step 1: Create a Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `padho-education` (or your chosen project name).
3. Disable or enable Google Analytics according to your preference, then click **Create Project**.

### Step 2: Register a Web Application
1. In your project dashboard, click the **Web (</>)** icon.
2. Enter an App nickname (e.g. `PADHO Web Platform`).
3. (Optional) Check "Also set up Firebase Hosting".
4. Click **Register app** and copy your `firebaseConfig` credentials object.

### Step 3: Enable Authentication
1. In the left sidebar, click **Authentication** → **Get Started**.
2. Under the **Sign-in method** tab, click **Email/Password**.
3. Enable **Email/Password** and click **Save**.

### Step 4: Create Cloud Firestore Database
1. In the left sidebar, click **Firestore Database** → **Create Database**.
2. Choose a nearby region (e.g., `asia-south1` for India).
3. Select **Production Mode** and click **Create**.
4. Deploy the rules from `firebase/firestore.rules`.

### Step 5: Configure Firebase Storage
1. In the left sidebar, click **Storage** → **Get Started**.
2. Deploy the rules from `firebase/storage.rules`.

### Step 6: Connect Credentials to PADHO
You can connect your live Firebase credentials in either of two easy ways:
1. **Via Admin Panel UI:** Log in as Administrator (`admin@padho.org`), navigate to **Settings & Firebase**, paste your API Key, Project ID, and Storage Bucket, and click **Save Firebase Credentials**.
2. **Via Code:** Open `js/firebase-config.js` and update `DEFAULT_FIREBASE_CONFIG` with your values.

---

## 6. Administrator Account Provisioning

To maintain strict security:
- The administrator role **cannot** be obtained via public registration.
- An initial secure administrator is provisioned:
  - **Email:** `admin@padho.org`
  - **Password:** `admin123`
- Administrators have access to `/admin/dashboard.html` to add/edit exams, subjects, topics, and upload educational files.

---

## 7. How to Run Locally

You can launch PADHO on any local HTTP server:

### Option A: Using Python (Built-in)
```bash
# Navigate to project directory
cd "C:\Users\venka\.gemini\antigravity\scratch\padho"

# Start lightweight HTTP server
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option B: Using Node.js (npx serve)
```bash
npx serve .
```

### Option C: VS Code / IDE Live Server
Right-click `index.html` and click **Open with Live Server**.

---

## 8. Verified Educational Data Guarantee

In compliance with strict educational standards:
- **Zero fake student records**, fake scores, or artificial progress bars.
- **All 5 examination categories** (JEE Main, JEE Advanced, SSC CGL/CHSL, Banking IBPS/SBI, Railway RRB) contain verified official links to `jeemain.nta.ac.in`, `jeeadv.ac.in`, `ssc.gov.in`, `ibps.in`, and `indianrailways.gov.in`.
- **Textbook repositories** link directly to official NCERT portals (`ncert.nic.in`).
- **Telugu educational content** provides genuine curriculum notes for Telugu medium aspirants.
(MaheshPondara/padho)
(Venkatasarankumar/padho)
(Kathikeya/padho)
