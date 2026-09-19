import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  XCircle,
  Bell,
  LogOut,
} from "lucide-react";
import { mockApplications } from "../data/mockApplications";
import ApplicationList from "./ApplicationList";
import ReviewModal from "./ReviewModal";

const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL ||
  "https://digital-concession-admin-api.onrender.com";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch applications from the Express backend
  const fetchApplications = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/api/applications`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.warn("API not running, falling back to mock data");
        setApplications(mockApplications);
      }
    } catch (error) {
      console.warn("API not running, falling back to mock data", error);
      setApplications(mockApplications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // Poll for new applications every 10 seconds
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetch(`${ADMIN_API_URL}/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      // Optimistic update
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id ? { ...app, status: "approved" } : app,
        ),
      );
    } catch (e) {
      console.error(e);
      // Fallback optimistic update if API fails
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id ? { ...app, status: "approved" } : app,
        ),
      );
    }
    setSelectedApp(null);
  };

  const handleReject = async (id) => {
    try {
      await fetch(`${ADMIN_API_URL}/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id ? { ...app, status: "rejected" } : app,
        ),
      );
    } catch (e) {
      setApplications((apps) =>
        apps.map((app) =>
          app.id === id ? { ...app, status: "rejected" } : app,
        ),
      );
    }
    setSelectedApp(null);
  };

  const filteredApps = applications.filter((app) => app.status === activeTab);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-text">
            <LayoutDashboard size={24} />
            Admin
          </div>
        </div>
        <ul className="nav-links">
          <li
            className={`nav-item ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <Users size={20} />
            Pending Reviews
            {applications.filter((a) => a.status === "pending").length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#ef4444",
                  color: "white",
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                }}
              >
                {applications.filter((a) => a.status === "pending").length}
              </span>
            )}
          </li>
          <li
            className={`nav-item ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <CheckCircle size={20} />
            Approved Passes
          </li>
          <li
            className={`nav-item ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            <XCircle size={20} />
            Rejected
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">
            {activeTab === "pending" && "Pending Applications"}
            {activeTab === "approved" && "Approved Passes"}
            {activeTab === "rejected" && "Rejected Applications"}
          </h1>

          <div className="admin-profile">
            <Bell
              size={20}
              style={{ color: "var(--text-secondary)", marginRight: "16px" }}
            />
            <div className="avatar">AD</div>
            <span>Admin User</span>
            <LogOut
              size={18}
              style={{
                marginLeft: "12px",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            />
          </div>
        </header>

        <div className="content-area">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px",
                color: "var(--text-secondary)",
              }}
            >
              Loading applications...
            </div>
          ) : (
            <ApplicationList
              applications={filteredApps}
              onViewDetails={setSelectedApp}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedApp && (
        <ReviewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={() => handleApprove(selectedApp.id)}
          onReject={() => handleReject(selectedApp.id)}
        />
      )}
    </div>
  );
};

export default Dashboard;
