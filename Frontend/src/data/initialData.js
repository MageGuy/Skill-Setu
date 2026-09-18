// Skill-Setu (Skill-सेतु) Preloaded Sovereign Datastore

export const INITIAL_STUDENT_PROFILE = {
  name: "Aarav Sharma",
  hindiName: "आरव शर्मा",
  rollNo: "22CS084",
  aicteId: "1-9382104812",
  regId: "REG-9812-4021-7734",
  skillSetuId: "SSU-2026-9382-084",
  sovereignStatus: "VERIFIED_LINKED",
  degree: "B.Tech Computer Science & Engineering",
  academicYear: "Final Year (2022 - 2026)",
  institution: "National Institute of Technology",
  cgpa: 8.84,
  readinessScore: 63, // AICTE National Benchmark %
  employmentStatus: "Open to Work",
  employmentSummary: "Actively seeking a full-time software engineering role",
  currentCompany: "",
  currentRole: "",
  currentPackage: "",
  experienceYears: 0,
  appliedCompany: "Tata Elxsi AI Labs",
  appliedRole: "Autonomous Systems & Frontend Specialist",
  skillsVerified: true,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  verifiedSkillsCount: 8,
  matchedRolesCount: 18,
  pendingExamsCount: 1,
  nsqfLevel: "Level 7 (Engineering Professional)",
  nationalRankingPercentile: 94.8
};

export const INITIAL_VERIFIED_SKILLS = [
  {
    id: "skill-1",
    name: "Data Structures & Algorithms",
    score: 95,
    category: "Core Computer Science",
    level: "NSQF Level 7",
    verifiedBy: "AICTE National Proctored Code Exam",
    verifiedDate: "14 Feb 2026",
    credentialId: "AICTE-DSA-2026-9041",
    status: "VALIDATED",
    source: "Proctored"
  },
  {
    id: "skill-2",
    name: "React.js & Modern Frontend",
    score: 94,
    category: "Software Development",
    level: "NSQF Level 7",
    verifiedBy: "Skill-Setu Automated Code Sandbox",
    verifiedDate: "28 Jan 2026",
    credentialId: "SETU-FE-REACT-7721",
    status: "VALIDATED",
    source: "Proctored"
  },
  {
    id: "skill-3",
    name: "Python for Data & Automation",
    score: 92,
    category: "Data & Systems",
    level: "NSQF Level 6",
    verifiedBy: "NPTEL / IIT Madras Online Examination",
    verifiedDate: "10 Dec 2025",
    credentialId: "NPTEL-CS-PY-4410",
    status: "VALIDATED",
    source: "Institutional Registry"
  },
  {
    id: "skill-4",
    name: "TypeScript & Static Architecture",
    score: 90,
    category: "Software Development",
    level: "NSQF Level 7",
    verifiedBy: "Skill-Setu Verified Assessment",
    verifiedDate: "19 Jan 2026",
    credentialId: "SETU-TS-ARCH-3012",
    status: "VALIDATED",
    source: "Proctored"
  },
  {
    id: "skill-5",
    name: "REST API & Microservices Integration",
    score: 92,
    category: "Backend & Systems",
    level: "NSQF Level 7",
    verifiedBy: "Verified University Transcript",
    verifiedDate: "05 Nov 2025",
    credentialId: "DL-UNIV-APIS-1190",
    status: "VALIDATED",
    source: "Institutional Registry"
  },
  {
    id: "skill-6",
    name: "HTML5 & Tailwind Design Systems",
    score: 96,
    category: "Frontend UI/UX",
    level: "NSQF Level 6",
    verifiedBy: "Skill-Setu Benchmark Suite",
    verifiedDate: "12 Jan 2026",
    credentialId: "SETU-UI-TW-8821",
    status: "VALIDATED",
    source: "Proctored"
  },
  {
    id: "skill-7",
    name: "Git & Collaborative DevSecOps",
    score: 88,
    category: "Engineering Practices",
    level: "NSQF Level 6",
    verifiedBy: "Open-Source Verification Crawler",
    verifiedDate: "20 Dec 2025",
    credentialId: "GIT-CONTRIB-4402",
    status: "VALIDATED",
    source: "Proctored"
  },
  {
    id: "skill-8",
    name: "SQL & Relational Schema Modeling",
    score: 85,
    category: "Database Systems",
    level: "NSQF Level 6",
    verifiedBy: "National Academic Repository",
    verifiedDate: "15 Oct 2025",
    credentialId: "DL-DB-MOD-5591",
    status: "VALIDATED",
    source: "Institutional Registry"
  }
];

export const INITIAL_TARGET_ROLES = [
  {
    id: "role-frontend-lead",
    title: "Senior Full-Stack / Frontend Engineer",
    tier: "Tier-1 Enterprise / MNC",
    targetReadiness: 88,
    currentMatch: 78,
    requiredSkills: [
      { name: "React.js", status: "VERIFIED", score: 94 },
      { name: "TypeScript", status: "VERIFIED", score: 90 },
      { name: "REST APIs", status: "VERIFIED", score: 92 },
      { name: "Next.js / SSR", status: "GAP", requiredScore: 85, currentScore: 40 },
      { name: "System Design (L1)", status: "GAP", requiredScore: 80, currentScore: 35 },
      { name: "Docker & Containerization", status: "GAP", requiredScore: 75, currentScore: 20 }
    ]
  },
  {
    id: "role-cloud-architect",
    title: "Cloud Native & DevOps Engineer",
    tier: "Tier-1 Cloud Provider",
    targetReadiness: 90,
    currentMatch: 64,
    requiredSkills: [
      { name: "Python", status: "VERIFIED", score: 92 },
      { name: "Git & CI/CD", status: "VERIFIED", score: 88 },
      { name: "SQL Modeling", status: "VERIFIED", score: 85 },
      { name: "Kubernetes Orchestration", status: "GAP", requiredScore: 85, currentScore: 25 },
      { name: "AWS / Azure Infrastructure", status: "GAP", requiredScore: 80, currentScore: 30 }
    ]
  },
  {
    id: "role-ai-engineer",
    title: "AI & Neural Applications Engineer",
    tier: "GovTech / DeepTech R&D",
    targetReadiness: 92,
    currentMatch: 70,
    requiredSkills: [
      { name: "Python for Data", status: "VERIFIED", score: 92 },
      { name: "Data Structures", status: "VERIFIED", score: 95 },
      { name: "LLM & Vector Embeddings", status: "GAP", requiredScore: 85, currentScore: 45 },
      { name: "PyTorch Deep Learning", status: "GAP", requiredScore: 80, currentScore: 30 }
    ]
  }
];

export const INITIAL_RECOMMENDED_COURSES = [
  {
    id: "course-1",
    title: "Advanced Next.js, Server Components & Micro-Frontends",
    provider: "SWAYAM · IIT Bombay",
    instructor: "Prof. S. Ranganathan",
    duration: "6 Weeks (Self-Paced)",
    credits: 3,
    enrolled: false,
    rating: 4.9,
    enrolledCount: 1420,
    bridgesSkills: ["Next.js / SSR", "System Design (L1)"],
    accreditation: "AICTE NSQF Level 7 Recognized",
    badgeColor: "saffron"
  },
  {
    id: "course-2",
    title: "Cloud Microservices, Docker & Kubernetes Deployments",
    provider: "NPTEL · IIT Kharagpur",
    instructor: "Dr. Ananya Sen",
    duration: "8 Weeks",
    credits: 4,
    enrolled: true,
    progress: 42,
    rating: 4.8,
    enrolledCount: 2890,
    bridgesSkills: ["Docker & Containerization", "Kubernetes Orchestration"],
    accreditation: "National Credit Framework (NCrF) Verified",
    badgeColor: "tech"
  },
  {
    id: "course-3",
    title: "Enterprise High-Scale Software Architecture & L1 Design",
    provider: "Skill India Digital Academy",
    instructor: "Industry Practitioners Board",
    duration: "4 Weeks",
    credits: 2,
    enrolled: false,
    rating: 4.7,
    enrolledCount: 980,
    bridgesSkills: ["System Design (L1)"],
    accreditation: "MeitY Certified Program",
    badgeColor: "neutral"
  }
];

export const INITIAL_CAMPUS_DRIVES = [
  {
    id: "drive-1",
    company: "Tata Consultancy Services (TCS Digital)",
    logoInitials: "TCS",
    role: "Digital Specialist Software Engineer",
    type: "Full-Time Placement",
    location: "Bengaluru / Hyderabad / Pune",
    ctc: "₹9.2 - 12.0 LPA",
    eligibilityCgpa: 7.5,
    matchPercentage: 94,
    deadline: "18 Sep 2026",
    rounds: "Proctored Coding + Tech Interview + HR",
    matchedSkills: ["React.js", "DSA", "Python", "REST APIs", "SQL"],
    missingSkills: ["Next.js (Optional)"],
    status: "OPEN",
    applied: false,
    driveDate: "22 Sep 2026"
  },
  {
    id: "drive-2",
    company: "Tata Elxsi AI Labs",
    logoInitials: "TEX",
    role: "Autonomous Systems & Frontend Specialist",
    type: "Full-Time Placement",
    location: "Bengaluru / Trivandrum",
    ctc: "₹11.5 - 14.5 LPA",
    eligibilityCgpa: 8.0,
    matchPercentage: 91,
    deadline: "20 Sep 2026",
    rounds: "AI Hackathon + Deep Architecture Review",
    matchedSkills: ["React.js", "TypeScript", "Python", "DSA"],
    missingSkills: ["Docker"],
    status: "OPEN",
    applied: true,
    appliedDate: "06 Sep 2026",
    applicationStatus: "Shortlisted for Round 1"
  },
  {
    id: "drive-3",
    company: "Microsoft India Development Center (IDC)",
    logoInitials: "MSFT",
    role: "Software Development Engineer - I (Web & Cloud)",
    type: "Full-Time Placement",
    location: "Hyderabad / Noida",
    ctc: "₹24.0 - 32.0 LPA",
    eligibilityCgpa: 8.5,
    matchPercentage: 86,
    deadline: "25 Sep 2026",
    rounds: "Online Assessment + 3 Technical Rounds",
    matchedSkills: ["DSA (95%)", "React.js", "TypeScript", "Git"],
    missingSkills: ["System Design", "Cloud Architecture"],
    status: "OPEN",
    applied: false,
    driveDate: "02 Oct 2026"
  },
  {
    id: "drive-4",
    company: "Infosys Topgear / Springboard",
    logoInitials: "INFY",
    role: "Specialist Programmer (SP Track)",
    type: "Full-Time Placement",
    location: "Bengaluru / Mysuru / Chennai",
    ctc: "₹9.5 - 11.0 LPA",
    eligibilityCgpa: 7.0,
    matchPercentage: 96,
    deadline: "15 Sep 2026",
    rounds: "HackWithInfy Fast Track Interview",
    matchedSkills: ["DSA", "React.js", "Python", "SQL", "Git"],
    missingSkills: [],
    status: "OPEN",
    applied: false,
    driveDate: "19 Sep 2026"
  },
  {
    id: "drive-5",
    company: "Zoho Corporation",
    logoInitials: "ZOHO",
    role: "Product Development Engineer",
    type: "Full-Time Placement",
    location: "Chennai / Tenkasi / Salem",
    ctc: "₹8.5 - 10.5 LPA",
    eligibilityCgpa: 7.0,
    matchPercentage: 89,
    deadline: "28 Sep 2026",
    rounds: "Advanced Logic + Core Coding + Design Round",
    matchedSkills: ["DSA", "REST APIs", "TypeScript", "HTML/Tailwind"],
    missingSkills: ["C++ Core (Preferred)"],
    status: "OPEN",
    applied: false,
    driveDate: "05 Oct 2026"
  },
  {
    id: "drive-6",
    company: "Cognizant GenC Next",
    logoInitials: "CTS",
    role: "Full-Stack Solutions Associate",
    type: "Full-Time Placement",
    location: "Kolkata / Hyderabad / Pune",
    ctc: "₹8.0 - 9.2 LPA",
    eligibilityCgpa: 6.8,
    matchPercentage: 92,
    deadline: "22 Sep 2026",
    rounds: "Adaptive Skill Assessment + Technical HR",
    matchedSkills: ["React.js", "TypeScript", "SQL", "Git"],
    missingSkills: [],
    status: "OPEN",
    applied: false,
    driveDate: "27 Sep 2026"
  }
];

export const INITIAL_ADMIN_ROSTER = [
  {
    id: "stud-01",
    name: "Aarav Sharma",
    rollNo: "22CS084",
    branch: "Computer Science & Eng.",
    cgpa: 8.84,
    skillsVerified: 8,
    readinessScore: 63,
    placementStatus: "In Active Drives",
    offersCount: 0,
    shortlistsCount: 2,
    verificationBadge: "VERIFIED_SOVEREIGN"
  },
  {
    id: "stud-02",
    name: "Pooja Deshmukh",
    rollNo: "22CS012",
    branch: "Computer Science & Eng.",
    cgpa: 9.12,
    skillsVerified: 11,
    readinessScore: 84,
    placementStatus: "Placed (TCS Digital)",
    offersCount: 1,
    shortlistsCount: 4,
    verificationBadge: "VERIFIED_SOVEREIGN"
  },
  {
    id: "stud-03",
    name: "Vikram Malhotra",
    rollNo: "22CS045",
    branch: "Computer Science & Eng.",
    cgpa: 7.95,
    skillsVerified: 6,
    readinessScore: 58,
    placementStatus: "In Active Drives",
    offersCount: 0,
    shortlistsCount: 1,
    verificationBadge: "VERIFIED_SOVEREIGN"
  },
  {
    id: "stud-04",
    name: "Ananya Iyer",
    rollNo: "22IT019",
    branch: "Information Technology",
    cgpa: 9.35,
    skillsVerified: 12,
    readinessScore: 91,
    placementStatus: "Placed (Microsoft IDC)",
    offersCount: 2,
    shortlistsCount: 5,
    verificationBadge: "VERIFIED_SOVEREIGN"
  },
  {
    id: "stud-05",
    name: "Rohan Mukherjee",
    rollNo: "22EC061",
    branch: "Electronics & Comm.",
    cgpa: 7.60,
    skillsVerified: 5,
    readinessScore: 49,
    placementStatus: "Under Verification",
    offersCount: 0,
    shortlistsCount: 0,
    verificationBadge: "PENDING_VERIFICATION"
  }
];

export const INITIAL_ADMIN_TELEMETRY = {
  totalEligibleStudents: 480,
  placedPercentage: 78.4,
  averagePackageCtc: "₹9.2 LPA",
  highestPackageCtc: "₹38.5 LPA",
  registeredRecruiters: 42,
  activeCampusDrives: 14,
  totalVerifiedCredentials: 3410
};
