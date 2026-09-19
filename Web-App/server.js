import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));

// --------------------------------------------------
// MongoDB Schema
// Must match the Student backend collection
// --------------------------------------------------

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

    // Optional document
    previousConcessionCard: {
      type: String,
      default: null,
    },

    institutionApprovalForm: {
      type: String,
      required: true,
    },

    rationCard: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    qrToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function formatAadhaar(value = "") {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function getRoute(application) {
  const travelFrom = application.travelFrom || "Home";
  const travelTo =
    application.travelTo || application.institutionName || "Institution";

  return {
    travelFrom,
    travelTo,
    route: `${travelFrom} to ${travelTo}`,
  };
}

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "Digital Concession Admin API",
    status: "running",
  });
});

// --------------------------------------------------
// GET all applications
// --------------------------------------------------

app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    const mappedApplications = applications.map((application) => {
      const routeDetails = getRoute(application);

      return {
        id: application._id.toString(),

        status: application.status,

        dateApplied: application.createdAt
          ? application.createdAt.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],

        studentName: application.fullName,
        dob: application.dateOfBirth,
        age: application.age,
        gender: application.gender,

        guardianName: application.guardianName,
        phone: application.phone,

        aadhaarNumber: formatAadhaar(application.aadhaar),

        email: application.email,

        address: application.address,
        place: application.place,
        postalName: application.postalName,
        pincode: application.pincode,
        district: application.district,

        institution: application.institutionName,
        institutionDistrict: application.institutionDistrict,

        course: application.course,
        rollNo: application.studentId,

        travelFrom: routeDetails.travelFrom,
        travelTo: routeDetails.travelTo,
        route: routeDetails.route,

        // These fields are currently not stored
        // by the Student application schema.
        eligibilityCriteria: "Undergraduate Student",
        rationCardType: "APL",
        rationCardNumber: "N/A",
        durationMonths: 6,
        nearestDepot: "Unknown",
        remarks: "Submitted via Mobile App",

        declaredCorrect: true,
        agreedToTerms: true,

        photoUrl: application.studentPhoto,
        idProofUrl: application.studentIdCard,
        aadhaarCardUrl: application.aadhaarCard,
        prevConcessionUrl: application.previousConcessionCard,
        approvalFormUrl: application.institutionApprovalForm,
        rationCardUrl: application.rationCard,

        qrToken: application.qrToken,
      };
    });

    res.json(mappedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch applications",
    });
  }
});

// --------------------------------------------------
// GET one application
// --------------------------------------------------

app.get("/api/applications/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    const routeDetails = getRoute(application);

    res.json({
      id: application._id.toString(),
      status: application.status,

      studentName: application.fullName,
      dob: application.dateOfBirth,
      age: application.age,
      gender: application.gender,

      guardianName: application.guardianName,
      phone: application.phone,
      aadhaarNumber: formatAadhaar(application.aadhaar),
      email: application.email,

      address: application.address,
      place: application.place,
      postalName: application.postalName,
      pincode: application.pincode,
      district: application.district,

      institution: application.institutionName,
      institutionDistrict: application.institutionDistrict,

      course: application.course,
      rollNo: application.studentId,

      travelFrom: routeDetails.travelFrom,
      travelTo: routeDetails.travelTo,
      route: routeDetails.route,

      photoUrl: application.studentPhoto,
      idProofUrl: application.studentIdCard,
      aadhaarCardUrl: application.aadhaarCard,
      prevConcessionUrl: application.previousConcessionCard,
      approvalFormUrl: application.institutionApprovalForm,
      rationCardUrl: application.rationCard,

      qrToken: application.qrToken,

      dateApplied: application.createdAt
        ? application.createdAt.toISOString().split("T")[0]
        : null,
    });
  } catch (error) {
    console.error("Error fetching application:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch application",
    });
  }
});

// --------------------------------------------------
// POST
// Student applications should NOT be created here
// --------------------------------------------------
app.post("/api/verify-qr", async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: "QR token is required",
      });
    }

    let parsedQr;

    try {
      parsedQr =
        typeof qrToken === "string"
          ? JSON.parse(qrToken)
          : qrToken;
    } catch {
      return res.status(400).json({
        success: false,
        valid: false,
        error: "Invalid QR format",
      });
    }

    if (!parsedQr.payload || !parsedQr.signature) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: "Invalid QR token",
      });
    }

    const secret =
      process.env.SECRET_KEY_CONDUCTOR || "CHANGE_THIS_SECRET";

    const expectedSignature = CryptoJS.HmacSHA256(
      parsedQr.payload,
      secret
    ).toString();

    if (expectedSignature !== parsedQr.signature) {
      return res.status(401).json({
        success: false,
        valid: false,
        error: "Invalid QR signature",
      });
    }

    const payloadData = JSON.parse(parsedQr.payload);

    const expiryDate = new Date(payloadData.expiry);

    if (
      Number.isNaN(expiryDate.getTime()) ||
      expiryDate < new Date()
    ) {
      return res.status(401).json({
        success: false,
        valid: false,
        error: "Pass has expired",
      });
    }

    const application = await Application.findById(payloadData.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        valid: false,
        error: "Application not found",
      });
    }

    if (application.status !== "approved") {
      return res.status(401).json({
        success: false,
        valid: false,
        error: "Pass is not approved",
      });
    }

    res.json({
      success: true,
      valid: true,
      student: {
        id: application._id.toString(),
        name: application.fullName,
        photoUrl: application.studentPhoto,
        route: `${application.travelFrom} to ${application.travelTo}`,
        travelFrom: application.travelFrom,
        travelTo: application.travelTo,
        expiry: payloadData.expiry,
      },
    });
  } catch (error) {
    console.error("QR verification error:", error);

    res.status(500).json({
      success: false,
      valid: false,
      error: "QR verification failed",
    });
  }
});

app.post("/api/applications", async (req, res) => {
  res.status(405).json({
    success: false,
    error: "Applications must be submitted through the Student App.",
  });
});

// --------------------------------------------------
// APPROVE / REJECT APPLICATION
// --------------------------------------------------

app.put("/api/applications/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status",
    });
  }

  try {
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    // ------------------------------------------------
    // APPROVAL
    // ------------------------------------------------

    if (status === "approved") {
      const routeDetails = getRoute(application);

      const payload = JSON.stringify({
        id: application._id.toString(),
        name: application.fullName,

        route: routeDetails.route,
        travelFrom: routeDetails.travelFrom,
        travelTo: routeDetails.travelTo,

        expiry: new Date(
          Date.now() + 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const secret =
        process.env.SECRET_KEY_CONDUCTOR || "CHANGE_THIS_SECRET";

      const signature = CryptoJS.HmacSHA256(
        payload,
        secret
      ).toString();

      application.qrToken = JSON.stringify({
        payload,
        signature,
      });
    }

    // ------------------------------------------------
    // REJECTION
    // ------------------------------------------------

    if (status === "rejected") {
      application.qrToken = null;
    }

    application.status = status;

    await application.save();

    res.json({
      success: true,
      id: application._id.toString(),
      status: application.status,
      qrToken: application.qrToken,
    });
  } catch (error) {
    console.error("Error updating application status:", error);

    res.status(500).json({
      success: false,
      error: "Failed to update application status",
    });
  }
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

async function startServer() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Admin API server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();