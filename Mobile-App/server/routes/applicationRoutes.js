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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

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
    { name: 'aadhaarDocument', maxCount: 1 },
    { name: 'bonafideCertificate', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const applicationData = {
        ...req.body,
        studentPhoto: req.files?.studentPhoto?.[0]
          ? `/uploads/${req.files.studentPhoto[0].filename}`
          : null,

        aadhaarDocument: req.files?.aadhaarDocument?.[0]
          ? `/uploads/${req.files.aadhaarDocument[0].filename}`
          : null,

        bonafideCertificate: req.files?.bonafideCertificate?.[0]
          ? `/uploads/${req.files.bonafideCertificate[0].filename}`
          : null,
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