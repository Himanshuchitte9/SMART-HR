import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AttendanceWidget from '../components/AttendanceWidget';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>SmartHR</h2>
                    <span className="role-badge">{user?.role}</span>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active" onClick={() => navigate('/dashboard')}>
                        <span>📊</span> Dashboard
                    </a>
                    {user?.role === 'OWNER' && (
                        <>
                            <a href="#" className="nav-item" onClick={() => navigate('/institutes')}>
                                <span>🏢</span> Institutes
                            </a>
                            <a href="#" className="nav-item" onClick={() => navigate('/employees')}>
                                <span>👥</span> Employees
                            </a>
                            <a href="#" className="nav-item" onClick={() => navigate('/roles')}>
                                <span>🌳</span> Org Chart
                            </a>
                        </>
                    )}
                    <a href="#" className="nav-item" onClick={() => navigate('/attendance-history')}>
                        <span>⏱️</span> Attendance
                    </a>
                    <a href="#" className="nav-item" onClick={() => navigate('/apply-leave')}>
                        <span>📝</span> Apply Leave
                    </a>
                    <a href="#" className="nav-item" onClick={() => navigate('/leave-management')}>
                        <span>📅</span> My Leaves
                    </a>
                    {user?.role === 'OWNER' && (
                        <a href="#" className="nav-item" onClick={() => navigate('/leave-approval')}>
                            <span>✅</span> Leave Approvals
                        </a>
                    )}
                    <a href="#" className="nav-item" onClick={() => navigate('/profile')}>
                        <span>👤</span> Profile
                    </a>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </aside>
            <main className="main-content">
                <header className="dashboard-header">
                    <h1>Welcome, {user?.name}!</h1>
                    <p>Email: {user?.email}</p>
                </header>
                <div className="dashboard-grid">
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <AttendanceWidget />
                    </div>
                    <div className="stat-card">
                        <h3>Role</h3>
                        <p className="stat-value">{user?.role}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Status</h3>
                        <p className="stat-value">Active</p>
                    </div>
                    {user?.role === 'OWNER' && (
                        <>
                            <div className="stat-card">
                                <h3>Institutes</h3>
                                <p className="stat-value">0</p>
                            </div>
                            <div className="stat-card">
                                <h3>Employees</h3>
                                <p className="stat-value">0</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="info-section">
                    <h2>Getting Started</h2>
                    <p>Welcome to SmartHR - Your Universal HR Management System</p>
                    {user?.role === 'OWNER' && (
                        <div className="action-cards">
                            <div className="action-card">
                                <h3>🏢 Create Institute</h3>
                                <p>Set up your school, college, or organization</p>
                                <button
                                    className="action-btn"
                                    onClick={() => navigate('/institutes')}
                                >
                                    Get Started
                                </button>
                            </div>
                            <div className="action-card">
                                <h3>🌳 Build Hierarchy</h3>
                                <p>Define roles and organizational structure</p>
                                <button
                                    className="action-btn"
                                    onClick={() => navigate('/roles')}
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
