const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        dateOfBirth: {
            type: String,
            required: true,
            trim: true,
        },

        age: {
            type: Number,
            required: true,
        },

        gender: {
            type: String,
            required: true,
            trim: true,
        },

        guardianName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        aadhaar: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        place: {
            type: String,
            required: true,
            trim: true,
        },

        postalName: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
        },

        district: {
            type: String,
            required: true,
            trim: true,
        },

        institutionName: {
            type: String,
            required: true,
            trim: true,
        },

        institutionDistrict: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: String,
            required: true,
            trim: true,
        },

        studentId: {
            type: String,
            required: true,
            trim: true,
        },

        travelFrom: {
            type: String,
            required: true,
            trim: true,
        },

        travelTo: {
            type: String,
            required: true,
            trim: true,
        },

        studentPhoto: {
            type: String,
            required: true,
        },

        studentIdCard: {
            type: String,
            required: true,
        },

        aadhaarCard: {
            type: String,
            required: true,
        },

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
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        
        qrToken: {
            type: String,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model(
    'Application',
    applicationSchema
);

module.exports = Application;
