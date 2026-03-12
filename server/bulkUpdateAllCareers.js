const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const allCareerDetails = {
  "Software Engineer": {
    qualifications: ["B.Tech/B.E in Computer Science or IT", "BCA / MCA pathway", "Strong programming portfolio"],
    exams: ["JEE Main", "JEE Advanced", "BITSAT", "GATE"],
    scholarships: ["Google Generation Scholarship", "AICTE Pragati Scholarship", "GitHub Student Developer Pack"],
    roadmap: `Learn programming → Data Structures → Build projects → Internships → Software Engineer roles`
  },
  "AI/ML Engineer": {
    qualifications: ["B.Tech in AI / Computer Science", "Strong mathematics and programming"],
    exams: ["JEE Main", "GATE"],
    scholarships: ["Google AI Scholarship", "NVIDIA Deep Learning Scholarship"],
    roadmap: `Learn Python → Machine Learning → Deep Learning → Build AI projects → AI Engineer jobs`
  },
  "Data Scientist": {
    qualifications: ["B.Tech/BSc in Data Science, Statistics or CS"],
    exams: ["JEE Main", "ISI Entrance Exam"],
    scholarships: ["Google Data Science Scholarship", "INSPIRE Scholarship"],
    roadmap: `Learn Python + Statistics → Data analysis → Machine learning → Build data projects`
  },
  "Cybersecurity Analyst": {
    qualifications: ["B.Tech/BSc in Cybersecurity or IT"],
    exams: ["CEH", "CompTIA Security+"],
    scholarships: ["SANS Cyber Scholarship", "Cybrary Training"],
    roadmap: `Learn networking → Linux → Ethical hacking → Security tools → Security analyst role`
  },
  "DevOps Engineer": {
    qualifications: ["B.Tech / BCA"],
    exams: ["GATE"],
    scholarships: ["AWS Educate", "Google Cloud Scholarships"],
    roadmap: `Learn Linux → Docker → Kubernetes → CI/CD → Cloud platforms`
  },
  "Civil Engineer": {
    qualifications: ["B.Tech Civil Engineering"],
    exams: ["JEE Main", "GATE"],
    scholarships: ["AICTE Scholarships"],
    roadmap: `Study structural engineering → internships → site engineer → project engineer`
  },
  "Mechanical Engineer": {
    qualifications: ["B.Tech Mechanical Engineering"],
    exams: ["JEE Main", "GATE"],
    scholarships: ["AICTE Scholarships"],
    roadmap: `Study thermodynamics → CAD tools → manufacturing internships`
  },
  "Electrical Engineer": {
    qualifications: ["B.Tech Electrical Engineering"],
    exams: ["JEE Main", "GATE"],
    scholarships: ["AICTE Scholarships"],
    roadmap: `Power systems → electronics → renewable energy`
  },
  "Architect": {
    qualifications: ["B.Arch"],
    exams: ["NATA", "JEE Main Paper 2"],
    scholarships: ["Architecture Council Scholarships"],
    roadmap: `Architecture studies → design projects → internships`
  },
  "Doctor (MBBS / MD)": {
    qualifications: ["MBBS", "MD/MS specialization"],
    exams: ["NEET"],
    scholarships: ["National Scholarship Portal"],
    roadmap: `NEET → MBBS → specialization → hospital practice`
  },
  "Dentist": {
    qualifications: ["BDS / MDS"],
    exams: ["NEET"],
    scholarships: ["Medical scholarships"],
    roadmap: `Dental college → internship → dental clinic`
  },
  "Nurse": {
    qualifications: ["BSc Nursing"],
    exams: ["State nursing entrance"],
    scholarships: ["Nursing scholarships"],
    roadmap: `Nursing training → hospital practice → specialization`
  },
  "Pharmacist": {
    qualifications: ["B.Pharm"],
    exams: ["State pharmacy entrance"],
    scholarships: ["Pharmacy scholarships"],
    roadmap: `Pharmacy studies → hospital pharmacy → pharmaceutical industry`
  },
  "Physiotherapist": {
    qualifications: ["BPT"],
    exams: ["Medical entrance exams"],
    scholarships: ["Healthcare scholarships"],
    roadmap: `Physiotherapy degree → clinic practice`
  },
  "Psychologist": {
    qualifications: ["BA/BSc Psychology", "Masters in Psychology"],
    exams: ["University entrance exams"],
    scholarships: ["Research scholarships"],
    roadmap: `Psychology degree → counselling training`
  },
  "Chartered Accountant (CA)": {
    qualifications: ["CA course by ICAI"],
    exams: ["CA Foundation", "CA Intermediate", "CA Final"],
    scholarships: ["ICAI Scholarships"],
    roadmap: `CA Foundation → Articleship → CA Final`
  },
  "Company Secretary (CS)": {
    qualifications: ["CS course by ICSI"],
    exams: ["CSEET", "CS Executive", "CS Professional"],
    scholarships: ["ICSI Scholarships"],
    roadmap: `CSEET → CS Executive → CS Professional`
  },
  "Financial Analyst": {
    qualifications: ["BBA / Finance"],
    exams: ["CFA"],
    scholarships: ["CFA Scholarships"],
    roadmap: `Finance degree → CFA → investment firms`
  },
  "Investment Banker": {
    qualifications: ["MBA Finance"],
    exams: ["CAT", "GMAT"],
    scholarships: ["IIM Scholarships"],
    roadmap: `Finance degree → MBA → investment bank`
  },
  "Bank PO / Bank Manager": {
    qualifications: ["Graduation"],
    exams: ["IBPS PO", "SBI PO"],
    scholarships: ["Government scholarships"],
    roadmap: `Prepare banking exams → probationary officer`
  },
  "MBA / Business Manager": {
    qualifications: ["Graduation + MBA"],
    exams: ["CAT", "XAT"],
    scholarships: ["IIM Scholarships"],
    roadmap: `MBA → management roles`
  },
  "Entrepreneur / Startup Founder": {
    qualifications: ["Any degree"],
    exams: ["None required"],
    scholarships: ["Startup India Grants"],
    roadmap: `Build startup idea → funding → scale company`
  },
  "HR Manager": {
    qualifications: ["MBA HR"],
    exams: ["CAT"],
    scholarships: ["Management scholarships"],
    roadmap: `HR studies → corporate HR roles`
  },
  "Digital Marketing Manager": {
    qualifications: ["BBA Marketing"],
    exams: ["Certifications"],
    scholarships: ["Google Digital Marketing Certification"],
    roadmap: `SEO → Ads → Analytics`
  },
  "Content Writer": {
    qualifications: ["Any degree"],
    exams: ["None"],
    scholarships: ["Writing fellowships"],
    roadmap: `Writing practice → SEO → blog portfolio`
  },
  "Graphic Designer": {
    qualifications: ["Design degree or portfolio"],
    exams: ["NID Entrance"],
    scholarships: ["Adobe scholarships"],
    roadmap: `Learn Photoshop → Illustrator → portfolio`
  },
  "UX/UI Designer": {
    qualifications: ["Design degree or portfolio"],
    exams: ["NID", "NIFT"],
    scholarships: ["Google UX Scholarship"],
    roadmap: `Design fundamentals → Figma → UX portfolio`
  },
  "Fashion Designer": {
    qualifications: ["Fashion design degree"],
    exams: ["NIFT"],
    scholarships: ["NIFT Scholarships"],
    roadmap: `Fashion design → internships`
  },
  "Film Director / Filmmaker": {
    qualifications: ["Film school"],
    exams: ["FTII Entrance"],
    scholarships: ["Film scholarships"],
    roadmap: `Film studies → assistant director`
  },
  "Journalist / News Reporter": {
    qualifications: ["Journalism degree"],
    exams: ["IIMC Entrance"],
    scholarships: ["Media scholarships"],
    roadmap: `Journalism studies → media house`
  },
  "PR & Communications Manager": {
    qualifications: ["Mass communication"],
    exams: ["MBA exams"],
    scholarships: ["Media scholarships"],
    roadmap: `Public relations → brand management`
  },
  "Lawyer / Advocate": {
    qualifications: ["LLB / BA LLB"],
    exams: ["CLAT"],
    scholarships: ["Law scholarships"],
    roadmap: `Law school → bar council`
  },
  "Corporate Lawyer": {
    qualifications: ["LLB + corporate law specialization"],
    exams: ["CLAT"],
    scholarships: ["Law scholarships"],
    roadmap: `Corporate law firms`
  },
  "Judge / Judicial Services": {
    qualifications: ["LLB"],
    exams: ["Judicial Service Exam"],
    scholarships: ["Government scholarships"],
    roadmap: `Lawyer → judicial exam`
  },
  "Army Officer": {
    qualifications: ["12th / Graduation"],
    exams: ["NDA", "CDS"],
    scholarships: ["Defence scholarships"],
    roadmap: `NDA → training → officer`
  },
  "Navy Officer": {
    qualifications: ["12th PCM"],
    exams: ["NDA"],
    scholarships: ["Defence scholarships"],
    roadmap: `Naval academy`
  },
  "Air Force Officer": {
    qualifications: ["12th PCM"],
    exams: ["NDA", "AFCAT"],
    scholarships: ["Air force scholarships"],
    roadmap: `Air force academy`
  },
  "IAS / IPS Officer (UPSC Civil Services)": {
    qualifications: ["Graduation"],
    exams: ["UPSC CSE"],
    scholarships: ["UPSC coaching scholarships"],
    roadmap: `UPSC Prelims → Mains → Interview`
  },
  "SSC CGL Officer": {
    qualifications: ["Graduation"],
    exams: ["SSC CGL"],
    scholarships: ["Government scholarships"],
    roadmap: `Prepare SSC exams`
  },
  "Environmental Scientist": {
    qualifications: ["BSc Environmental Science"],
    exams: ["University entrance exams"],
    scholarships: ["Research scholarships"],
    roadmap: `Environmental research → sustainability jobs`
  },
  "Professor / Academic Researcher": {
    qualifications: ["PhD"],
    exams: ["UGC NET"],
    scholarships: ["Research fellowships"],
    roadmap: `Masters → PhD → professor`
  },
  "Sports Professional / Athlete": {
    qualifications: ["Sports training"],
    exams: ["Sports trials"],
    scholarships: ["Khelo India Scholarship"],
    roadmap: `Professional sports training → competitions`
  }
};

async function updateAllCareers() {
  const careersRef = db.collection('careers');
  const snapshot = await careersRef.get();
  
  let updated = 0;
  
  for (const doc of snapshot.docs) {
    const careerName = doc.data().name;
    
    if (allCareerDetails[careerName]) {
      await careersRef.doc(doc.id).update(allCareerDetails[careerName]);
      console.log(`✅ Updated: ${careerName}`);
      updated++;
    } else {
      console.log(`⚠️  Skipped: ${careerName} (no data)`);
    }
  }
  
  console.log(`\n🎉 Total careers updated: ${updated}`);
  process.exit(0);
}

updateAllCareers().catch(console.error);
