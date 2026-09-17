const express = require('express');
const Application = require('../models/Application');

const router = express.Router();

// Submit a new bus concession application
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);

    const savedApplication = await application.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      application: savedApplication,
    });
  } catch (error) {
    console.error('Application submission error:', error);

    res.status(400).json({
      success: false,
      message: 'Failed to submit application.',
      error: error.message,
    });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Fetch applications error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications.',
      error: error.message,
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
    res.status(400).json({
      success: false,
      message: 'Invalid application ID.',
      error: error.message,
    });
  }
});

module.exports = router;
