import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Initialize with some mock data matching the new schema
let applications = [
  {
    id: "APP-2024-001",
    status: "pending",
    dateApplied: "2024-10-24",
    studentName: "Aditi Sharma",
    dob: "2003-05-14",
    age: 21,
    gender: "Female",
    guardianName: "Rajesh Sharma",
    phone: "9876543210",
    aadhaarNumber: "1234 5678 9012",
    email: "aditi.sharma@example.com",
    address: "123, Sunrise Apartments, Main Road",
    place: "Barton Hill",
    postalName: "Barton Hill PO",
    pincode: "695035",
    district: "Thiruvananthapuram",
    institution: "Government Engineering College, Barton Hill",
    institutionDistrict: "Thiruvananthapuram",
    course: "B.Tech Computer Science",
    rollNo: "CS21B001",
    eligibilityCriteria: "Undergraduate Student",
    rationCardType: "APL",
    rationCardNumber: "1234567890",
    travelFrom: "Trivandrum Central",
    travelTo: "GECB",
    durationMonths: 6,
    nearestDepot: "Trivandrum City Depot",
    remarks: "First time applicant",
    declaredCorrect: true,
    agreedToTerms: true,
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    idProofUrl: "https://images.unsplash.com/photo-1621360841013-c76831f12560?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    aadhaarCardUrl: "https://images.unsplash.com/photo-1621360841013-c76831f12560?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    prevConcessionUrl: null,
    approvalFormUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    rationCardUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "APP-2024-002",
    status: "pending",
    dateApplied: "2024-10-25",
    studentName: "Rahul Menon",
    dob: "2002-11-20",
    age: 22,
    gender: "Male",
    guardianName: "Suresh Menon",
    phone: "8765432109",
    aadhaarNumber: "9876 5432 1098",
    email: "rahul.menon@example.com",
    address: "45, Green Valley, Phase 2",
    place: "Kazhakootam",
    postalName: "Kazhakootam PO",
    pincode: "695582",
    district: "Thiruvananthapuram",
    institution: "College of Engineering Trivandrum",
    institutionDistrict: "Thiruvananthapuram",
    course: "B.Tech Mechanical Engineering",
    rollNo: "ME20B042",
    eligibilityCriteria: "Undergraduate Student",
    rationCardType: "BPL",
    rationCardNumber: "0987654321",
    travelFrom: "Kazhakootam",
    travelTo: "CET",
    durationMonths: 3,
    nearestDepot: "Kazhakootam Depot",
    remarks: "Renewal",
    declaredCorrect: true,
    agreedToTerms: true,
    photoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    idProofUrl: "https://images.unsplash.com/photo-1621360841013-c76831f12560?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    aadhaarCardUrl: "https://images.unsplash.com/photo-1621360841013-c76831f12560?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    prevConcessionUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    approvalFormUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    rationCardUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
];

// GET all applications
app.get('/api/applications', (req, res) => {
  res.json(applications);
});

// POST a new application from the Android APK
app.post('/api/applications', (req, res) => {
  const newApp = {
    ...req.body,
    id: `APP-${new Date().getFullYear()}-${String(applications.length + 1).padStart(3, '0')}`,
    status: 'pending',
    dateApplied: new Date().toISOString().split('T')[0]
  };
  applications.unshift(newApp); // Add to beginning of array
  res.status(201).json(newApp);
});

// PUT update application status (approve/reject)
app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex !== -1) {
    applications[appIndex].status = status;
    res.json(applications[appIndex]);
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
