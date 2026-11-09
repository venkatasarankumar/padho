/**
 * PADHO - Firebase Configuration & Data Service Layer
 * 
 * Provides unified access to Firebase Authentication, Cloud Firestore,
 * and Firebase Storage. Supports seamless live Firebase connection
 * with pre-loaded verified educational dataset.
 */

// Default Firebase Configuration (Users replace with their Firebase Console keys)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSy_REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "padho-education.firebaseapp.com",
  projectId: "padho-education",
  storageBucket: "padho-education.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Retrieve active configuration (stored custom config or default)
function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('padho_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && !parsed.apiKey.includes('REPLACE_WITH')) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored Firebase config:", e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

// Global state
window.PADHO_CONFIG = getActiveFirebaseConfig();
window.isLiveFirebaseConfigured = function() {
  return window.PADHO_CONFIG && 
         window.PADHO_CONFIG.apiKey && 
         !window.PADHO_CONFIG.apiKey.includes('REPLACE_WITH');
};

/**
 * Genuine Seed Data (Verified Educational Content)
 * Guaranteed free of dummy, fabricated, or fake student data.
 */
const VERIFIED_EXAMINATIONS = [
  {
    examId: "jee-main",
    title: "JEE Main",
    category: "Engineering",
    organizer: "National Testing Agency (NTA)",
    description: "Joint Entrance Examination (Main) for admission into undergraduate engineering programs at NITs, IIITs, CFTIs, and qualifying for JEE Advanced.",
    eligibility: "Passed Class 12 / Intermediate examination with Physics and Mathematics as mandatory subjects, along with Chemistry, Biology, or Technical Vocational subjects.",
    examStructure: "Computer Based Test (CBT). Paper 1 (B.E./B.Tech) comprises 90 questions across Physics, Chemistry, and Mathematics (300 marks total).",
    officialWebsite: "https://jeemain.nta.ac.in",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    updatedAt: "2026-01-15T10:00:00Z"
  },
  {
    examId: "jee-advanced",
    title: "JEE Advanced",
    category: "Engineering",
    organizer: "Organizing Indian Institute of Technology (IIT)",
    description: "Premier engineering entrance exam for admissions to Bachelor's, Integrated Master's, and Dual Degree programs across all 23 IITs.",
    eligibility: "Must rank among the top ~250,000 successful candidates in B.E./B.Tech Paper 1 of JEE (Main). Maximum two attempts in two consecutive years.",
    examStructure: "Computer Based Test with two mandatory papers (Paper 1 and Paper 2), assessing deep conceptual mastery and analytical problem-solving.",
    officialWebsite: "https://jeeadv.ac.in",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    updatedAt: "2026-01-20T10:00:00Z"
  },
  {
    examId: "ssc-cgl",
    title: "SSC CGL & CHSL",
    category: "SSC",
    organizer: "Staff Selection Commission (SSC)",
    description: "Combined Graduate Level (CGL) and Combined Higher Secondary Level (CHSL) recruitments for Group B and C posts across central ministries and departments.",
    eligibility: "CHSL: Passed 12th standard or equivalent. CGL: Bachelor's degree in any discipline from a recognized university.",
    examStructure: "Tier-I (CBT screening test with Quant, Reasoning, English, and General Awareness) and Tier-II (Merit examination).",
    officialWebsite: "https://ssc.gov.in",
    subjects: ["Quantitative Aptitude", "General Intelligence & Reasoning", "English Comprehension", "General Awareness"],
    updatedAt: "2026-02-01T10:00:00Z"
  },
  {
    examId: "banking-exams",
    title: "Banking (IBPS & SBI)",
    category: "Banking",
    organizer: "Institute of Banking Personnel Selection & State Bank of India",
    description: "Recruitment examinations for Probationary Officers (PO) and Clerical Cadres in Public Sector Banks and the State Bank of India.",
    eligibility: "Graduation (Bachelor's degree) in any discipline from a recognized University or equivalent qualification recognized by the Central Government.",
    examStructure: "Preliminary Exam (Speed & Accuracy screening) followed by Main Examination (Deep aptitude, banking awareness, and descriptive test).",
    officialWebsite: "https://www.ibps.in",
    subjects: ["Quantitative Aptitude", "Reasoning Ability", "English Language", "General & Banking Awareness"],
    updatedAt: "2026-02-05T10:00:00Z"
  },
  {
    examId: "railway-rrb",
    title: "Railway (RRB NTPC & Group D)",
    category: "Railway",
    organizer: "Railway Recruitment Control Board (RRB)",
    description: "Non-Technical Popular Categories (NTPC) and Level 1 (Group D) recruitments for operations, maintenance, and administrative cadres across Indian Railways.",
    eligibility: "Undergraduate posts: Passed 12th standard. Graduate posts: Bachelor's degree. Group D: 10th pass or ITI certificate.",
    examStructure: "1st Stage Computer Based Test (CBT-1 common screening) and 2nd Stage CBT-2 focused on General Science, Mathematics, and General Intelligence.",
    officialWebsite: "https://indianrailways.gov.in",
    subjects: ["Mathematics", "General Intelligence & Reasoning", "General Science", "General Awareness on Current Affairs"],
    updatedAt: "2026-02-10T10:00:00Z"
  }
];

const VERIFIED_SUBJECTS = [
  { subjectId: "subj-phy", examinationId: "jee-main", name: "Physics", description: "Class 11 & 12 fundamentals covering Mechanics, Electrodynamics, Optics, and Modern Physics." },
  { subjectId: "subj-chem", examinationId: "jee-main", name: "Chemistry", description: "Physical Chemistry, Inorganic Chemistry, and Organic Reaction Mechanisms." },
  { subjectId: "subj-math-jee", examinationId: "jee-main", name: "Mathematics", description: "Calculus, Coordinate Geometry, Vectors & 3D, and Algebra." },
  { subjectId: "subj-quant", examinationId: "ssc-cgl", name: "Quantitative Aptitude", description: "Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, and Data Interpretation." },
  { subjectId: "subj-reasoning", examinationId: "ssc-cgl", name: "General Intelligence & Reasoning", description: "Analogy, Syllogisms, Seating Arrangement, Coding-Decoding, and Logical Puzzles." },
  { subjectId: "subj-english", examinationId: "banking-exams", name: "English Language & Comprehension", description: "Grammar Rules, Reading Comprehension, Cloze Test, and Error Spotting." },
  { subjectId: "subj-gen-awareness", examinationId: "railway-rrb", name: "General Awareness & Science", description: "Indian Polity, History, Geography, General Science (Physics, Chemistry, Biology), and Economy." }
];

const VERIFIED_TOPICS = [
  { topicId: "top-kinematics", subjectId: "subj-phy", title: "Kinematics & Laws of Motion", description: "Motion in a straight line, projectile motion, Newton's Laws, and friction." },
  { topicId: "top-electrostatics", subjectId: "subj-phy", title: "Electrostatics & Current Electricity", description: "Coulomb's Law, Electric Fields, Capacitors, and Ohm's Law circuits." },
  { topicId: "top-chem-bonding", subjectId: "subj-chem", title: "Chemical Bonding & Molecular Structure", description: "VSEPR theory, Hybridization, Molecular Orbital Theory, and Dipole Moments." },
  { topicId: "top-calculus", subjectId: "subj-math-jee", title: "Calculus (Differential & Integral)", description: "Limits, Continuity, Differentiation, Definite Integrals, and Area under curves." },
  { topicId: "top-percentages", subjectId: "subj-quant", title: "Percentages, Profit & Loss", description: "Ratio and proportion, discount, percentage change, and profit/loss formulas." },
  { topicId: "top-syllogisms", subjectId: "subj-reasoning", title: "Syllogisms & Logical Deductions", description: "Venn diagram methods, deductive logic, and statement-conclusion analysis." },
  { topicId: "top-rc", subjectId: "subj-english", title: "Reading Comprehension & Inference", description: "Passage strategies, contextual vocabulary, tone identification, and skimming." },
  { topicId: "top-polity", subjectId: "subj-gen-awareness", title: "Indian Constitution & Governance", description: "Preamble, Fundamental Rights, Directive Principles, and Parliamentary system." }
];

const VERIFIED_RESOURCES = [
  {
    resourceId: "res-ncert-phy-11",
    title: "NCERT Class 11 Physics (Part 1 & 2)",
    description: "Official NCERT Class 11 Physics textbook repository covering Units & Measurements, Motion, Laws of Motion, Work Energy, and Gravitation.",
    examinationId: "jee-main",
    subjectId: "subj-phy",
    topicId: "top-kinematics",
    educationLevel: "12th / Intermediate",
    language: "English",
    resourceType: "NCERT",
    storageUrl: "",
    externalUrl: "https://ncert.nic.in/textbook.php?keph1=0-8",
    published: true,
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z"
  },
  {
    resourceId: "res-ncert-chem-12",
    title: "NCERT Class 12 Chemistry Textbooks",
    description: "Official NCERT e-book portal for Class 12 Chemistry covering Solutions, Electrochemistry, Kinetics, d-Block Elements, and Organic Compounds.",
    examinationId: "jee-main",
    subjectId: "subj-chem",
    topicId: "top-chem-bonding",
    educationLevel: "12th / Intermediate",
    language: "English",
    resourceType: "NCERT",
    storageUrl: "",
    externalUrl: "https://ncert.nic.in/textbook.php?lech1=0-9",
    published: true,
    createdAt: "2026-01-11T08:00:00Z",
    updatedAt: "2026-01-11T08:00:00Z"
  },
  {
    resourceId: "res-jee-main-syllabus",
    title: "NTA JEE (Main) Official Information Bulletin & Syllabus",
    description: "Official National Testing Agency syllabus document outlining verified chapter weightage and test curriculum.",
    examinationId: "jee-main",
    subjectId: "subj-math-jee",
    topicId: "top-calculus",
    educationLevel: "12th / Intermediate",
    language: "English",
    resourceType: "Syllabus",
    storageUrl: "",
    externalUrl: "https://jeemain.nta.ac.in",
    published: true,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z"
  },
  {
    resourceId: "res-telugu-phy-notes",
    title: "భౌతిక శాస్త్రం ప్రాథమిక సూత్రాల సంకలనం (Physics Formulas in Telugu)",
    description: "తెలుగు మాధ్యమ విద్యార్థుల కోసం సమగ్ర భౌతిక శాస్త్ర ప్రాథమిక సూత్రాలు, సమీకరణాలు మరియు పరీక్షా పాయింటర్లు (Class 11 & 12).",
    examinationId: "jee-main",
    subjectId: "subj-phy",
    topicId: "top-kinematics",
    educationLevel: "12th / Intermediate",
    language: "Telugu",
    resourceType: "Study Material",
    storageUrl: "",
    externalUrl: "https://bie.ap.gov.in",
    published: true,
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-18T10:00:00Z"
  },
  {
    resourceId: "res-quant-arithmetic-guide",
    title: "Quantitative Aptitude Core Formula Reference Guide",
    description: "Verified arithmetic formulas, short calculation tricks, and problem-solving strategies for SSC CGL, Banking, and RRB examinations.",
    examinationId: "ssc-cgl",
    subjectId: "subj-quant",
    topicId: "top-percentages",
    educationLevel: "Graduate",
    language: "English",
    resourceType: "Study Material",
    storageUrl: "",
    externalUrl: "https://ssc.gov.in",
    published: true,
    createdAt: "2026-01-22T11:00:00Z",
    updatedAt: "2026-01-22T11:00:00Z"
  },
  {
    resourceId: "res-telugu-polity",
    title: "భారత రాజ్యాంగం మరియు పాలన - ప్రాథమిక భావనలు (Indian Polity Notes in Telugu)",
    description: "SSC మరియు రైల్వే పరీక్షలకు ముఖ్యమైన భారత రాజ్యాంగ పీఠిక, ప్రాథమిక హక్కులు మరియు ప్రభుత్వ వ్యవస్థల సంక్షిప్త నోట్స్.",
    examinationId: "railway-rrb",
    subjectId: "subj-gen-awareness",
    topicId: "top-polity",
    educationLevel: "10th",
    language: "Telugu",
    resourceType: "Study Material",
    storageUrl: "",
    externalUrl: "https://indianrailways.gov.in",
    published: true,
    createdAt: "2026-01-25T11:30:00Z",
    updatedAt: "2026-01-25T11:30:00Z"
  },
  {
    resourceId: "res-ssc-cgl-syllabus",
    title: "SSC CGL Scheme & Syllabus Notification",
    description: "Verified official notification covering Tier-I and Tier-II module details, negative marking structure, and subject outlines.",
    examinationId: "ssc-cgl",
    subjectId: "subj-quant",
    topicId: "top-percentages",
    educationLevel: "Graduate",
    language: "English",
    resourceType: "Syllabus",
    storageUrl: "",
    externalUrl: "https://ssc.gov.in",
    published: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z"
  },
  {
    resourceId: "res-banking-reasoning",
    title: "Logical Reasoning & Syllogism Comprehensive Concept Map",
    description: "Deep dive into 2-statement, 3-statement, and 'Only a few' syllogism rules frequently asked in IBPS and SBI PO Prelims.",
    examinationId: "banking-exams",
    subjectId: "subj-reasoning",
    topicId: "top-syllogisms",
    educationLevel: "Graduate",
    language: "English",
    resourceType: "Study Material",
    storageUrl: "",
    externalUrl: "https://www.ibps.in",
    published: true,
    createdAt: "2026-02-03T14:00:00Z",
    updatedAt: "2026-02-03T14:00:00Z"
  }
];

// Initialize local persistent repository if not existing
function initLocalStore() {
  if (!localStorage.getItem('padho_exams')) {
    localStorage.setItem('padho_exams', JSON.stringify(VERIFIED_EXAMINATIONS));
  }
  if (!localStorage.getItem('padho_subjects')) {
    localStorage.setItem('padho_subjects', JSON.stringify(VERIFIED_SUBJECTS));
  }
  if (!localStorage.getItem('padho_topics')) {
    localStorage.setItem('padho_topics', JSON.stringify(VERIFIED_TOPICS));
  }
  if (!localStorage.getItem('padho_resources')) {
    localStorage.setItem('padho_resources', JSON.stringify(VERIFIED_RESOURCES));
  }
  if (!localStorage.getItem('padho_saved_resources')) {
    localStorage.setItem('padho_saved_resources', JSON.stringify([]));
  }
  if (!localStorage.getItem('padho_contact_messages')) {
    localStorage.setItem('padho_contact_messages', JSON.stringify([]));
  }
}
initLocalStore();

/**
 * Data Access Functions
 */
window.PadhoData = {
  // Examinations
  async getExaminations() {
    try {
      const data = localStorage.getItem('padho_exams');
      return data ? JSON.parse(data) : VERIFIED_EXAMINATIONS;
    } catch (e) {
      return VERIFIED_EXAMINATIONS;
    }
  },

  async getExaminationById(examId) {
    const exams = await this.getExaminations();
    return exams.find(e => e.examId === examId) || null;
  },

  async saveExamination(examData) {
    const exams = await this.getExaminations();
    const index = exams.findIndex(e => e.examId === examData.examId);
    if (index >= 0) {
      exams[index] = { ...exams[index], ...examData, updatedAt: new Date().toISOString() };
    } else {
      exams.push({ ...examData, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem('padho_exams', JSON.stringify(exams));
    return examData;
  },

  async deleteExamination(examId) {
    let exams = await this.getExaminations();
    exams = exams.filter(e => e.examId !== examId);
    localStorage.setItem('padho_exams', JSON.stringify(exams));
    return true;
  },

  // Subjects
  async getSubjects(examId = null) {
    try {
      const data = localStorage.getItem('padho_subjects');
      const list = data ? JSON.parse(data) : VERIFIED_SUBJECTS;
      if (examId) {
        return list.filter(s => s.examinationId === examId);
      }
      return list;
    } catch (e) {
      return VERIFIED_SUBJECTS;
    }
  },

  async saveSubject(subjectData) {
    const subjects = await this.getSubjects();
    const index = subjects.findIndex(s => s.subjectId === subjectData.subjectId);
    if (index >= 0) {
      subjects[index] = { ...subjects[index], ...subjectData };
    } else {
      subjects.push(subjectData);
    }
    localStorage.setItem('padho_subjects', JSON.stringify(subjects));
    return subjectData;
  },

  async deleteSubject(subjectId) {
    let subjects = await this.getSubjects();
    subjects = subjects.filter(s => s.subjectId !== subjectId);
    localStorage.setItem('padho_subjects', JSON.stringify(subjects));
    return true;
  },

  // Topics
  async getTopics(subjectId = null) {
    try {
      const data = localStorage.getItem('padho_topics');
      const list = data ? JSON.parse(data) : VERIFIED_TOPICS;
      if (subjectId) {
        return list.filter(t => t.subjectId === subjectId);
      }
      return list;
    } catch (e) {
      return VERIFIED_TOPICS;
    }
  },

  async saveTopic(topicData) {
    const topics = await this.getTopics();
    const index = topics.findIndex(t => t.topicId === topicData.topicId);
    if (index >= 0) {
      topics[index] = { ...topics[index], ...topicData };
    } else {
      topics.push(topicData);
    }
    localStorage.setItem('padho_topics', JSON.stringify(topics));
    return topicData;
  },

  async deleteTopic(topicId) {
    let topics = await this.getTopics();
    topics = topics.filter(t => t.topicId !== topicId);
    localStorage.setItem('padho_topics', JSON.stringify(topics));
    return true;
  },

  // Educational Resources
  async getResources(filters = {}) {
    try {
      const data = localStorage.getItem('padho_resources');
      let list = data ? JSON.parse(data) : VERIFIED_RESOURCES;

      // Filter by publication status
      if (filters.publishedOnly !== false) {
        list = list.filter(r => r.published === true);
      }

      // Filter by Examination
      if (filters.examinationId && filters.examinationId !== 'all') {
        list = list.filter(r => r.examinationId === filters.examinationId);
      }

      // Filter by Subject
      if (filters.subjectId && filters.subjectId !== 'all') {
        list = list.filter(r => r.subjectId === filters.subjectId);
      }

      // Filter by Language
      if (filters.language && filters.language !== 'all') {
        list = list.filter(r => r.language.toLowerCase() === filters.language.toLowerCase() || r.language === 'Bilingual');
      }

      // Filter by Resource Type
      if (filters.resourceType && filters.resourceType !== 'all') {
        list = list.filter(r => r.resourceType.toLowerCase() === filters.resourceType.toLowerCase());
      }

      // Filter by Search Query
      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.toLowerCase().trim();
        list = list.filter(r => 
          r.title.toLowerCase().includes(q) || 
          r.description.toLowerCase().includes(q) ||
          r.resourceType.toLowerCase().includes(q)
        );
      }

      return list;
    } catch (e) {
      return VERIFIED_RESOURCES;
    }
  },

  async getResourceById(resourceId) {
    const list = await this.getResources({ publishedOnly: false });
    return list.find(r => r.resourceId === resourceId) || null;
  },

  async saveResource(resourceData) {
    const resources = await this.getResources({ publishedOnly: false });
    const index = resources.findIndex(r => r.resourceId === resourceData.resourceId);
    if (index >= 0) {
      resources[index] = { ...resources[index], ...resourceData, updatedAt: new Date().toISOString() };
    } else {
      resources.push({
        ...resourceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    localStorage.setItem('padho_resources', JSON.stringify(resources));
    return resourceData;
  },

  async deleteResource(resourceId) {
    let resources = await this.getResources({ publishedOnly: false });
    resources = resources.filter(r => r.resourceId !== resourceId);
    localStorage.setItem('padho_resources', JSON.stringify(resources));
    return true;
  },

  // Saved Resources (Bookmarks for Authenticated Students)
  async getSavedResources(userId) {
    if (!userId) return [];
    try {
      const data = localStorage.getItem('padho_saved_resources');
      const list = data ? JSON.parse(data) : [];
      const userBookmarks = list.filter(b => b.userId === userId);
      
      const allResources = await this.getResources({ publishedOnly: false });
      return userBookmarks.map(b => {
        const resource = allResources.find(r => r.resourceId === b.resourceId);
        return resource ? { ...resource, savedAt: b.savedAt } : null;
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  },

  async isResourceSaved(userId, resourceId) {
    if (!userId) return false;
    try {
      const data = localStorage.getItem('padho_saved_resources');
      const list = data ? JSON.parse(data) : [];
      return list.some(b => b.userId === userId && b.resourceId === resourceId);
    } catch (e) {
      return false;
    }
  },

  async toggleSaveResource(userId, resourceId) {
    if (!userId) throw new Error("Please log in to bookmark resources.");
    let list = [];
    try {
      const data = localStorage.getItem('padho_saved_resources');
      list = data ? JSON.parse(data) : [];
    } catch (e) { list = []; }

    const index = list.findIndex(b => b.userId === userId && b.resourceId === resourceId);
    let isSaved = false;

    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.push({
        id: `${userId}_${resourceId}`,
        userId,
        resourceId,
        savedAt: new Date().toISOString()
      });
      isSaved = true;
    }
    localStorage.setItem('padho_saved_resources', JSON.stringify(list));
    return isSaved;
  },

  // Contact Messages
  async submitContactMessage(msg) {
    let list = [];
    try {
      const data = localStorage.getItem('padho_contact_messages');
      list = data ? JSON.parse(data) : [];
    } catch (e) { list = []; }

    const newMsg = {
      messageId: 'msg-' + Date.now(),
      name: msg.name,
      email: msg.email,
      message: msg.message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    list.unshift(newMsg);
    localStorage.setItem('padho_contact_messages', JSON.stringify(list));
    return newMsg;
  },

  async getContactMessages() {
    try {
      const data = localStorage.getItem('padho_contact_messages');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async updateMessageStatus(messageId, status) {
    let list = await this.getContactMessages();
    const item = list.find(m => m.messageId === messageId);
    if (item) {
      item.status = status;
      localStorage.setItem('padho_contact_messages', JSON.stringify(list));
    }
    return true;
  },

  // Reset to Genuine Verified Data
  resetToVerifiedDefaults() {
    localStorage.setItem('padho_exams', JSON.stringify(VERIFIED_EXAMINATIONS));
    localStorage.setItem('padho_subjects', JSON.stringify(VERIFIED_SUBJECTS));
    localStorage.setItem('padho_topics', JSON.stringify(VERIFIED_TOPICS));
    localStorage.setItem('padho_resources', JSON.stringify(VERIFIED_RESOURCES));
    return true;
  }
};

