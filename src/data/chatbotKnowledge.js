export const CAMPUS_KNOWLEDGE = {
  institute: {
    name: "Indian Institute of Information Technology Kottayam (IIIT Kottayam)",
    aka: ["IIITK", "IIIT Kottayam", "IIIT-K"],
    type: "Institute of National Importance under IIIT (PPP) Act 2017",
    established: "2015",
    location: "Valavoor P.O, Pala, Kottayam, Kerala - 686635",
    website: "https://iiitkottayam.ac.in",
    email: "office@iiitkottayam.ac.in",
    phone: "+91-4822-202100",
    gst: "32AAAAI9154L1ZJ"
  },
  courses: [
    { name: "B.Tech in Computer Science and Engineering (CSE)", duration: "4 years", level: "UG" },
    { name: "B.Tech in Electronics and Communication Engineering (ECE)", duration: "4 years", level: "UG" },
    { name: "B.Tech in Cyber Security", duration: "4 years", level: "UG" },
    { name: "B.Tech in AI & Data Science", duration: "4 years", level: "UG" },
    { name: "M.Tech (Executive)", duration: "2 years", level: "PG", url: "https://mtech.iiitkottayam.ac.in" },
    { name: "Integrated M.Tech (iM.Tech)", duration: "5 years", level: "PG", url: "https://imtech.iiitkottayam.ac.in" },
    { name: "e-M.Tech (Online)", duration: "2 years", level: "PG", url: "https://emtech.iiitkottayam.ac.in" },
    { name: "PhD", duration: "3-5 years", level: "Doctoral", url: "https://phd.iiitkottayam.ac.in" }
  ],
  admission: {
    btech: "Through JEE Main counselling via JoSAA / CSAB",
    mtech: "Through GATE score or institute-level entrance",
    imtech: "Direct admission after 12th std / Diploma",
    phd: "Through institute-level entrance test and interview",
    fee_payment: "https://www.onlinesbi.sbi/sbicollect/icollecthome.htm"
  },
  facilities: [
    { name: "Hostel", desc: "Separate boys & girls hostels with furnished rooms, Wi-Fi, common room, dining hall" },
    { name: "Library", desc: "Digital library with journals, e-books, research databases", url: "https://opac.iiitkottayam.ac.in" },
    { name: "Gymnasium", desc: "Fully equipped gym for students and staff" },
    { name: "Sports", desc: "Basketball, volleyball, badminton, cricket, football, table tennis" },
    { name: "Medical Centre", desc: "On-campus medical facility with doctor" },
    { name: "Bank/ATM", desc: "Banking and ATM facility on campus" },
    { name: "Internet", desc: "High-speed campus Wi-Fi with 1 Gbps backbone" },
    { name: "Security", desc: "24x7 security with CCTV surveillance" },
    { name: "Mess", desc: "Student cooperative mess — breakfast, lunch, snacks, dinner daily" }
  ],
  clubs: [
    { name: "Technical Club", desc: "Coding, hackathons, workshops, tech talks" },
    { name: "Cultural Club", desc: "Dance, music, art, drama, celebrations" },
    { name: "Sports Club", desc: "Intra & inter-college sports events" },
    { name: "Trendles (Social Club)", desc: "Social awareness, community service" },
    { name: "Cyber Security Club", desc: "CTFs, security workshops, vulnerability analysis" },
    { name: "Mind Quest", desc: "Aptitude, puzzles, quizzes, brain-teasers" },
    { name: "Magazine Club", desc: "Student-run college magazine" },
    { name: "IEEE Student Branch", desc: "Technical papers, conferences, networking" },
    { name: "ACM Student Chapter", desc: "Competitive programming, CS events" }
  ],
  administration: [
    { role: "Director", name: "Prof. R. Vasantha Kumari", url: "https://iiitkottayam.ac.in/#!admin" },
    { role: "Registrar", name: "Office of the Registrar", url: "https://iiitkottayam.ac.in/#!admin" }
  ],
  departments: [
    { name: "Computer Science and Engineering (CSE)", hod: "See website", url: "https://iiitkottayam.ac.in/#!dept_head" },
    { name: "Electronics and Communication Engineering (ECE)", hod: "See website", url: "https://iiitkottayam.ac.in/#!dept_head" }
  ],
  placement: {
    url: "https://iiitkottayam.ac.in/#!placement",
    recruiters: "https://iiitkottayam.ac.in/data/pdf/recruiterscorner.pdf",
    desc: "Dedicated Training & Placement Cell. Top IT, core, startup companies visit campus."
  },
  research: {
    areas: ["Machine Learning & AI", "Cyber Security", "IoT", "VLSI Design", "Signal Processing", "Data Science", "Embedded Systems", "Computer Vision", "NLP"],
  },
  links: {
    lms: "https://iiitkottayam.ac.in/#!lmsredirect",
    nirf: "https://iiitkottayam.ac.in/#!nirf_home",
    scholarship: "https://iiitkottayam.ac.in/#!scholarship",
    contact: "https://iiitkottayam.ac.in/#!contact",
    rti: "https://iiitkottayam.ac.in/#!rti",
    antiRagging: "https://iiitkottayam.ac.in/#!antiragging",
    grievance: "https://iiitkottayam.ac.in/data/pdf/Grievance%20Redressal%20Committee.pdf",
    reach: "https://iiitkottayam.ac.in/#!reach",
    career: "https://iiitkottayam.ac.in/#!career",
    matlab: "https://www.mathworks.com/academia/tah-portal/indian-institute-of-information-technology-kottayam-31453279.html",
    faculty: "https://iiitkottayam.ac.in/#!faculty",
    admin: "https://iiitkottayam.ac.in/#!admin",
    deptHead: "https://iiitkottayam.ac.in/#!dept_head"
  }
};

export const CHATBOT_QA = [
  { q: ["what is iiit kottayam", "about iiitk", "tell me about the college", "about the institute", "what is iiitk"], a: "IIIT Kottayam (Indian Institute of Information Technology Kottayam) is an Institute of National Importance established in 2015 under the IIIT (PPP) Act 2017. Located in Valavoor, Pala, Kottayam, Kerala, it offers B.Tech, M.Tech, iM.Tech, e-M.Tech, and PhD programs." },
  { q: ["where is iiit kottayam", "location", "address", "campus location", "where"], a: "IIIT Kottayam is located at Valavoor P.O, Pala, Kottayam, Kerala - 686635, India. 📍" },
  { q: ["contact", "phone number", "email", "how to contact"], a: "📧 Email: office@iiitkottayam.ac.in\n📞 Phone: +91-4822-202100\n🌐 Website: iiitkottayam.ac.in" },
  { q: ["courses offered", "what courses", "programs", "branches", "departments"], a: "📚 B.Tech: CSE, ECE, Cyber Security, AI & Data Science\n📖 M.Tech (Executive), iM.Tech, e-M.Tech\n🎓 PhD programs\n\nAdmission through JEE Main (JoSAA/CSAB) for B.Tech." },
  { q: ["btech cse", "computer science"], a: "B.Tech CSE — 4-year program covering programming, algorithms, databases, OS, networks, AI/ML, and more." },
  { q: ["btech ece", "electronics"], a: "B.Tech ECE — 4-year program covering VLSI, signal processing, communication systems, embedded systems, IoT." },
  { q: ["cyber security", "cybersecurity course"], a: "B.Tech Cyber Security — 4-year program: network security, ethical hacking, cryptography, forensics, cyber law." },
  { q: ["ai data science", "artificial intelligence"], a: "B.Tech AI & Data Science — 4-year program: machine learning, deep learning, data analytics, NLP, big data." },
  { q: ["mtech", "masters", "postgraduate"], a: "M.Tech options:\n• Executive M.Tech — after B.Tech/MCA/M.Sc\n• iM.Tech — after 12th/Diploma (5 years)\n• e-M.Tech — Online mode\nDetails at mtech.iiitkottayam.ac.in" },
  { q: ["phd", "doctoral", "research degree"], a: "PhD programs available in CS and ECE. Apply at phd.iiitkottayam.ac.in" },
  { q: ["admission", "how to get admission", "how to apply"], a: "B.Tech: JEE Main → JoSAA/CSAB counselling\nM.Tech: GATE or institute entrance\niM.Tech: Direct after 12th\nPhD: Entrance test + interview" },
  { q: ["fee", "fees", "tuition", "pay fees"], a: "Pay fees online at SBI Collect: https://www.onlinesbi.sbi/sbicollect/icollecthome.htm" },
  { q: ["scholarship", "financial aid"], a: "Scholarships available — visit iiitkottayam.ac.in/#!scholarship" },
  { q: ["hostel", "accommodation", "rooms"], a: "Separate boys & girls hostels with furnished rooms, Wi-Fi, common rooms, and dining hall. 🏠" },
  { q: ["library", "books", "digital library"], a: "Library with physical books + digital resources (journals, e-books). OPAC: opac.iiitkottayam.ac.in 📚" },
  { q: ["gym", "gymnasium", "fitness"], a: "Fully equipped gymnasium available for students and staff. 💪" },
  { q: ["sports", "games", "playground"], a: "Basketball, volleyball, badminton, cricket, football, table tennis — indoor & outdoor! ⚽" },
  { q: ["medical", "health", "doctor"], a: "On-campus medical centre with regular doctor visits. 🏥" },
  { q: ["atm", "bank", "banking"], a: "Bank and ATM facilities available on campus. 🏦" },
  { q: ["internet", "wifi", "network"], a: "High-speed campus Wi-Fi with 1 Gbps backbone. 🌐" },
  { q: ["mess", "food", "dining", "canteen", "mess menu"], a: "Student Co-operative Mess with 4 meals daily: Breakfast, Lunch, Snacks, Dinner. Check the Mess section in CampusHub for today's menu! 🍽️" },
  { q: ["clubs", "student clubs", "societies"], a: "🔧 Technical Club\n🎭 Cultural Club\n⚽ Sports Club\n🌍 Trendles (Social)\n🔒 Cyber Security Club\n🧠 Mind Quest\n📰 Magazine\n📡 IEEE Branch\n💻 ACM Chapter" },
  { q: ["technical club", "coding club"], a: "Technical Club — coding competitions, hackathons, workshops, tech talks. Active in CP, web/app dev, AI/ML." },
  { q: ["cultural club", "cultural events"], a: "Cultural Club — dance, music, drama, art events, and annual celebrations." },
  { q: ["ieee", "ieee branch"], a: "IEEE Student Branch — technical papers, conferences, and networking events." },
  { q: ["acm", "acm chapter"], a: "ACM Student Chapter — competitive programming and CS events." },
  { q: ["placement", "placements", "jobs"], a: "Dedicated Training & Placement Cell. Top companies visit campus. Details: iiitkottayam.ac.in/#!placement 💼" },
  { q: ["recruiters", "companies"], a: "Full recruiter list: iiitkottayam.ac.in/data/pdf/recruiterscorner.pdf" },
  { q: ["research", "research groups", "research areas"], a: "Research: ML & AI, Cyber Security, IoT, VLSI, Signal Processing, Data Science, Embedded Systems, CV, NLP." },
  { q: ["lms", "learning management"], a: "LMS access: iiitkottayam.ac.in/#!lmsredirect" },
  { q: ["nirf", "ranking"], a: "NIRF ranking: iiitkottayam.ac.in/#!nirf_home" },
  { q: ["faculty", "professors", "teachers"], a: "View all faculty: iiitkottayam.ac.in/#!faculty\nDepartment Heads: iiitkottayam.ac.in/#!dept_head\nAdministration: iiitkottayam.ac.in/#!admin" },
  { q: ["administration", "admin", "director", "registrar"], a: "View administration details at: iiitkottayam.ac.in/#!admin\nFor faculty list: iiitkottayam.ac.in/#!faculty" },
  { q: ["hod", "head of department", "department head"], a: "View Heads of Department: iiitkottayam.ac.in/#!dept_head" },
  { q: ["anti ragging", "ragging"], a: "Anti-ragging info: iiitkottayam.ac.in/#!antiragging" },
  { q: ["grievance", "complaint", "redressal"], a: "Grievance Redressal Committee details available on the institute website." },
  { q: ["rti", "right to information"], a: "RTI info: iiitkottayam.ac.in/#!rti" },
  { q: ["matlab", "software"], a: "MATLAB available for IIITK students via MathWorks academic portal." },
  { q: ["help", "what can you do", "commands"], a: "I can help with:\n✅ College info & location\n✅ Courses & admission\n✅ Facilities\n✅ Clubs & activities\n✅ Placement & research\n✅ Mess menu\n✅ Faculty & admin info\n\nJust ask! 😊" },
  { q: ["hi", "hello", "hey", "good morning", "good evening"], a: "Hello! 👋 I'm your IIIT Kottayam Campus Assistant. Ask me about courses, facilities, clubs, placement, admission, and more!" },
  { q: ["thanks", "thank you", "thx"], a: "You're welcome! Feel free to ask anything else! 😊" },
  { q: ["bye", "goodbye", "see you"], a: "Goodbye! Have a great day! 👋" }
];

export const CHATBOT_SUGGESTIONS = [
  "Courses offered",
  "Hostel info",
  "Clubs",
  "Placement",
  "Mess menu",
  "Admission",
  "Contact",
  "Faculty"
];
