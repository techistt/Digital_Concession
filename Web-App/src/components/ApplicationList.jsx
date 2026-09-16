import React from 'react';
import { FileText } from 'lucide-react';

const ApplicationList = ({ applications, onViewDetails }) => {
  if (applications.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h2>No applications found.</h2>
        <p>There are no {applications[0]?.status || 'pending'} applications at the moment.</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Institution</th>
            <th>Route Details</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                <div className="applicant-info">
                  <img src={app.photoUrl} alt={app.studentName} className="applicant-photo" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{app.studentName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{app.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ fontWeight: 500 }}>{app.institution}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{app.course}</div>
              </td>
              <td>{app.route}</td>
              <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge status-${app.status}`}>
                  {app.status}
                </span>
              </td>
              <td>
                <button 
                  className="action-btn"
                  onClick={() => onViewDetails(app)}
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
