import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './SuperAdminDashboard.css';

const API_URL = 'http://localhost:5000/api';

const SuperAdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInstitutes: 0,
        pendingApprovals: 0,
        activeEmployees: 0
    });
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Fetch stats - placeholder for now
        setStats({
            totalUsers: 156,
            totalInstitutes: 23,
            pendingApprovals: 8,
            activeEmployees: 142
        });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="super-admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h1>🏢 SMART-HR</h1>
                    <p className="admin-badge">SUPER ADMIN</p>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="nav-icon">👥</span>
                        <span>User Management</span>
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'institutes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('institutes')}
                    >
                        <span className="nav-icon">🏛️</span>
                        <span>Institutes</span>
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'approvals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('approvals')}
                    >
                        <span className="nav-icon">✅</span>
                        <span>Approvals</span>
                        {stats.pendingApprovals > 0 && (
                            <span className="badge">{stats.pendingApprovals}</span>
                        )}
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <span className="nav-icon">📈</span>
                        <span>Analytics</span>
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-btn" onClick={() => navigate('/profile')}>
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </button>
                    <button className="nav-btn logout-btn" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-header">
                    <div className="header-left">
                        <h2>Welcome back, {user?.name}! 👋</h2>
                        <p className="header-subtitle">Here's what's happening today</p>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <input type="text" placeholder="Search..." />
                            <span className="search-icon">🔍</span>
                        </div>
                        <button className="notification-btn">
                            🔔
                            <span className="notification-badge">3</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="admin-content">
                    {activeTab === 'overview' && (
                        <>
                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card purple">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalUsers}</h3>
                                        <p>Total Users</p>
                                    </div>
                                    <div className="stat-trend">+12% ↗</div>
                                </div>

                                <div className="stat-card blue">
                                    <div className="stat-icon">🏛️</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalInstitutes}</h3>
                                        <p>Institutes</p>
                                    </div>
                                    <div className="stat-trend">+5% ↗</div>
                                </div>

                                <div className="stat-card orange">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>{stats.pendingApprovals}</h3>
                                        <p>Pending Approvals</p>
                                    </div>
                                    <div className="stat-trend">Needs attention</div>
                                </div>

                                <div className="stat-card green">
                                    <div className="stat-icon">💼</div>
                                    <div className="stat-info">
                                        <h3>{stats.activeEmployees}</h3>
                                        <p>Active Employees</p>
                                    </div>
                                    <div className="stat-trend">+8% ↗</div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-grid">
                                    <button className="action-card" onClick={() => setActiveTab('users')}>
                                        <span className="action-icon">➕</span>
                                        <span>Add New User</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('institutes')}>
                                        <span className="action-icon">🏢</span>
                                        <span>Create Institute</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('approvals')}>
                                        <span className="action-icon">✅</span>
                                        <span>Review Approvals</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('analytics')}>
                                        <span className="action-icon">📊</span>
                                        <span>View Reports</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <div className="activity-icon new">📝</div>
                                        <div className="activity-details">
                                            <p className="activity-title">New institute registration</p>
                                            <p className="activity-time">2 hours ago</p>
                                        </div>
                                        <button className="activity-action">Review</button>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon approved">✅</div>
                                        <div className="activity-details">
                                            <p className="activity-title">User approved: John Doe</p>
                                            <p className="activity-time">5 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-icon update">🔄</div>
                                        <div className="activity-details">
                                            <p className="activity-title">System update completed</p>
                                            <p className="activity-time">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <div className="tab-content">
                            <h2>👥 User Management</h2>
                            <p className="coming-soon">User management interface coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'institutes' && (
                        <div className="tab-content">
                            <h2>🏛️ Institute Management</h2>
                            <p className="coming-soon">Institute management interface coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'approvals' && (
                        <div className="tab-content">
                            <h2>✅ Pending Approvals</h2>
                            <p className="coming-soon">Approvals interface coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="tab-content">
                            <h2>📈 Analytics & Reports</h2>
                            <p className="coming-soon">Analytics dashboard coming soon...</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-content">
                            <h2>⚙️ System Settings</h2>
                            <p className="coming-soon">Settings panel coming soon...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
