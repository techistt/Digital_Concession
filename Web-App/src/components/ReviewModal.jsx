import React from 'react';
import { X, Check, XCircle } from 'lucide-react';

const ReviewModal = ({ application, onClose, onApprove, onReject }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Review Application - {application.id}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Declarations Banner */}
          {(application.declaredCorrect && application.agreedToTerms) ? (
             <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Check size={18} /> Student has agreed to all terms, conditions, and declarations.
             </div>
          ) : (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <XCircle size={18} /> Declarations missing.
             </div>
          )}

          <div className="review-grid">
            {/* Left Column: Details */}
            <div>
              <div className="review-section">
                <h3 className="section-title">Personal Details</h3>
                
                <div className="detail-row"><span className="detail-label">Full Name</span><span className="detail-value">{application.studentName}</span></div>
                <div className="detail-row"><span className="detail-label">Date of Birth</span><span className="detail-value">{application.dob} (Age: {application.age})</span></div>
                <div className="detail-row"><span className="detail-label">Gender</span><span className="detail-value">{application.gender}</span></div>
                <div className="detail-row"><span className="detail-label">Guardian Name</span><span className="detail-value">{application.guardianName}</span></div>
                <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{application.phone}</span></div>
                <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{application.email}</span></div>
                <div className="detail-row"><span className="detail-label">Aadhaar No.</span><span className="detail-value">{application.aadhaarNumber}</span></div>
                <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{application.address}, {application.place}</span></div>
                <div className="detail-row"><span className="detail-label">Postal</span><span className="detail-value">{application.postalName} - {application.pincode}</span></div>
                <div className="detail-row"><span className="detail-label">District</span><span className="detail-value">{application.district}</span></div>
              </div>

              <div className="review-section">
                <h3 className="section-title">Academic Details</h3>
                <div className="detail-row"><span className="detail-label">Institution</span><span className="detail-value">{application.institution}</span></div>
                <div className="detail-row"><span className="detail-label">Inst. District</span><span className="detail-value">{application.institutionDistrict}</span></div>
                <div className="detail-row"><span className="detail-label">Course</span><span className="detail-value">{application.course}</span></div>
                <div className="detail-row"><span className="detail-label">Roll/ID No.</span><span className="detail-value">{application.rollNo}</span></div>
                <div className="detail-row"><span className="detail-label">Eligibility</span><span className="detail-value">{application.eligibilityCriteria}</span></div>
              </div>

              <div className="review-section">
                <h3 className="section-title">Pass & Travel Details</h3>
                <div className="detail-row"><span className="detail-label">Route</span><span className="detail-value">{application.travelFrom} to {application.travelTo}</span></div>
                <div className="detail-row"><span className="detail-label">Duration</span><span className="detail-value">{application.durationMonths} Months</span></div>
                <div className="detail-row"><span className="detail-label">Nearest Depot</span><span className="detail-value">{application.nearestDepot}</span></div>
                <div className="detail-row"><span className="detail-label">Ration Card</span><span className="detail-value">{application.rationCardType} ({application.rationCardNumber})</span></div>
                <div className="detail-row"><span className="detail-label">Remarks</span><span className="detail-value">{application.remarks}</span></div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <div className="review-section">
                <h3 className="section-title">Uploaded Documents</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Student Photo</span>
                    {application.photoUrl ? <img src={application.photoUrl} alt="Student Photo" className="large-photo" style={{ width: '150px', height: '150px' }} /> : <span style={{color: 'var(--text-secondary)'}}>Not provided</span>}
                  </div>

                  <div>
                    <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Student ID Card</span>
                    {application.idProofUrl ? <img src={application.idProofUrl} alt="ID Card" className="document-preview" /> : <span style={{color: 'var(--text-secondary)'}}>Not provided</span>}
                  </div>

                  <div>
                    <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Aadhaar Card</span>
                    {application.aadhaarCardUrl ? <img src={application.aadhaarCardUrl} alt="Aadhaar" className="document-preview" /> : <span style={{color: 'var(--text-secondary)'}}>Not provided</span>}
                  </div>

                  <div>
                    <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Inst. Approval Form (Form 1)</span>
                    {application.approvalFormUrl ? <img src={application.approvalFormUrl} alt="Approval Form" className="document-preview" /> : <span style={{color: 'var(--text-secondary)'}}>Not provided</span>}
                  </div>

                  <div>
                    <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Ration Card</span>
                    {application.rationCardUrl ? <img src={application.rationCardUrl} alt="Ration Card" className="document-preview" /> : <span style={{color: 'var(--text-secondary)'}}>Not provided</span>}
                  </div>

                  {application.prevConcessionUrl && (
                    <div>
                      <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Previous Concession Card</span>
                      <img src={application.prevConcessionUrl} alt="Prev Concession" className="document-preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {application.status === 'pending' && (
            <>
              <button className="btn btn-reject" onClick={onReject}>
                <XCircle size={18} />
                Reject
              </button>
              <button className="btn btn-approve" onClick={onApprove}>
                <Check size={18} />
                Approve & Issue Pass
              </button>
            </>
          )}
          {application.status !== 'pending' && (
            <button className="btn" style={{ backgroundColor: '#e2e8f0', color: '#475569' }} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
