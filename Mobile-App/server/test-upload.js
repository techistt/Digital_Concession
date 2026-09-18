const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testSubmit() {
  const form = new FormData();
  form.append('fullName', 'Test Name');
  form.append('dateOfBirth', '01/01/2000');
  form.append('age', '24');
  form.append('gender', 'Male');
  form.append('guardianName', 'Test Guardian');
  form.append('phone', '1234567890');
  form.append('aadhaarNumber', '123456789012');
  form.append('email', 'test@test.com');
  form.append('address', 'Test Address');
  form.append('place', 'Test Place');
  form.append('postalName', 'Test Postal');
  form.append('pincode', '123456');
  form.append('district', 'Test District');
  form.append('institutionName', 'Test Inst');
  form.append('institutionDistrict', 'Test Inst Dist');
  form.append('course', 'Test Course');
  form.append('studentId', 'TEST-123');
  form.append('travelFrom', 'Test Origin');
  form.append('travelTo', 'Test Destination');

  // append dummy files
  const dummyFile = Buffer.from('hello world');
  
  form.append('studentPhoto', dummyFile, { filename: 'photo.jpg', contentType: 'image/jpeg' });
  form.append('studentIdCard', dummyFile, { filename: 'id.jpg', contentType: 'image/jpeg' });
  form.append('aadhaarCard', dummyFile, { filename: 'aadhaar.jpg', contentType: 'image/jpeg' });
  form.append('institutionApprovalForm', dummyFile, { filename: 'form.jpg', contentType: 'image/jpeg' });
  form.append('rationCard', dummyFile, { filename: 'ration.jpg', contentType: 'image/jpeg' });

  try {
    const res = await axios.post('http://localhost:5000/api/applications', form, {
      headers: form.getHeaders(),
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testSubmit();
