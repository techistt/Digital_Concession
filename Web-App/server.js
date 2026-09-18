import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Mongoose Schema matching Mobile-App
const applicationSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        guardianName: { type: String, required: true },
        phone: { type: String, required: true },
        aadhaar: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        place: { type: String, required: true },
        postalName: { type: String, required: true },
        pincode: { type: String, required: true },
        district: { type: String, required: true },
        institutionName: { type: String, required: true },
        institutionDistrict: { type: String, required: true },
        course: { type: String, required: true },
        studentId: { type: String, required: true },
        travelFrom: { type: String, required: true },
        travelTo: { type: String, required: true },
        studentPhoto: { type: String, required: true },
        studentIdCard: { type: String, required: true },
        aadhaarCard: { type: String, required: true },
        previousConcessionCard: { type: String, default: null },
        institutionApprovalForm: { type: String, required: true },
        rationCard: { type: String, required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        qrToken: { type: String, default: null },
    },
    { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

const formatAadhaar = (value = '') =>
  value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

const getRoute = (app) => {
  const travelFrom = app.travelFrom || 'Home';
  const travelTo = app.travelTo || app.institutionName;

  return {
    travelFrom,
    travelTo,
    route: `${travelFrom} to ${travelTo}`,
  };
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_concession')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// GET all applications
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    
    const mappedApps = apps.map(app => {
      const routeDetails = getRoute(app);

      return ({
      id: app._id.toString(),
      status: app.status,
      dateApplied: app.createdAt ? app.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      studentName: app.fullName,
      dob: app.dateOfBirth,
      age: app.age,
      gender: app.gender,
      guardianName: app.guardianName,
      phone: app.phone,
      aadhaarNumber: formatAadhaar(app.aadhaar),
      email: app.email,
      address: app.address,
      place: app.place,
      postalName: app.postalName,
      pincode: app.pincode,
      district: app.district,
      institution: app.institutionName,
      institutionDistrict: app.institutionDistrict,
      course: app.course,
      rollNo: app.studentId, // Mapping studentId to rollNo
      eligibilityCriteria: "Undergraduate Student", // Default or fetch if added
      rationCardType: "APL", // Default or fetch if added
      rationCardNumber: "N/A", // Default
      travelFrom: routeDetails.travelFrom,
      travelTo: routeDetails.travelTo,
      route: routeDetails.route,
      durationMonths: 6, // Default
      nearestDepot: "Unknown", // Default
      remarks: "Submitted via Mobile App", // Default
      declaredCorrect: true,
      agreedToTerms: true,
      photoUrl: app.studentPhoto,
      idProofUrl: app.studentIdCard,
      aadhaarCardUrl: app.aadhaarCard,
      prevConcessionUrl: app.previousConcessionCard,
      approvalFormUrl: app.institutionApprovalForm,
      rationCardUrl: app.rationCard
    });
  });

    res.json(mappedApps);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST a new application (if still needed by some Web-App mock flow)
app.post('/api/applications', async (req, res) => {
  try {
    // Reverse map fields if needed, but assuming Web-App doesn't post real data anymore
    res.status(501).json({ error: 'Please submit applications via Mobile App' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update application status (approve/reject)
app.put('/api/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    let updateData = { status };
    if (status === 'approved') {
      const appDoc = await Application.findById(id);
      if (appDoc && !appDoc.qrToken) {
        const routeDetails = getRoute(appDoc);
        const payload = JSON.stringify({
          id: appDoc._id.toString(),
          name: appDoc.fullName,
          route: routeDetails.route,
          travelFrom: routeDetails.travelFrom,
          travelTo: routeDetails.travelTo,
          expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months
        });
        const signature = CryptoJS.HmacSHA256(payload, process.env.SECRET_KEY_CONDUCTOR || 'default_secret').toString();
        updateData.qrToken = JSON.stringify({ payload, signature });
      }
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (updatedApp) {
      res.json({ id: updatedApp._id.toString(), status: updatedApp.status });
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
