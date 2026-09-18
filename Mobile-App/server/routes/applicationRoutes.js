const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG and PDF files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Submit application
router.post(
  '/',
  upload.fields([
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'studentIdCard', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'previousConcessionCard', maxCount: 1 },
    { name: 'institutionApprovalForm', maxCount: 1 },
    { name: 'rationCard', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files || {};

      // Required documents
      const requiredDocuments = [
        'studentPhoto',
        'studentIdCard',
        'aadhaarCard',
        'institutionApprovalForm',
        'rationCard',
      ];

      const missingDocuments = requiredDocuments.filter(
        (field) => !files[field]?.[0]
      );

      if (missingDocuments.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Please upload all required documents.',
          missingDocuments,
        });
      }

      const getBase64 = (fileArray) => {
        if (!fileArray || !fileArray[0]) return null;
        return `data:${fileArray[0].mimetype};base64,${fileArray[0].buffer.toString('base64')}`;
      };

      const applicationData = {
        ...req.body,
        aadhaar: req.body.aadhaarNumber, // Fix field mismatch
        studentPhoto: getBase64(files.studentPhoto),
        studentIdCard: getBase64(files.studentIdCard),
        aadhaarCard: getBase64(files.aadhaarCard),
        previousConcessionCard: getBase64(files.previousConcessionCard),
        institutionApprovalForm: getBase64(files.institutionApprovalForm),
        rationCard: getBase64(files.rationCard),
      };

      const application = await Application.create(applicationData);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully.',
        application,
      });
    } catch (error) {
      console.error('Application submission error:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit application.',
      });
    }
  }
);

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications.',
    });
  }
});

// Get one application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch application.',
    });
  }
});

module.exports = router;