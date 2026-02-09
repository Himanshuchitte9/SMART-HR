import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="profile-info">
                    <div className="info-row">
                        <label>Name:</label>
                        <span>{user?.name}</span>
                    </div>

                    <div className="info-row">
                        <label>Email:</label>
                        <span>{user?.email}</span>
                    </div>

                    <div className="info-row">
                        <label>Role:</label>
                        <span className="role-badge">{user?.role}</span>
                    </div>

                    <div className="info-row">
                        <label>Mobile:</label>
                        <span>{user?.mobile || 'Not provided'}</span>
                    </div>

                    <div className="info-row">
                        <label>Gender:</label>
                        <span>{user?.gender || 'Not provided'}</span>
                    </div>

                    <div className="info-row">
                        <label>Address:</label>
                        <span>{user?.address || 'Not provided'}</span>
                    </div>

                    <div className="info-row">
                        <label>Qualification:</label>
                        <span>{user?.qualification || 'Not provided'}</span>
                    </div>

                    <div className="info-row">
                        <label>Experience:</label>
                        <span>{user?.experience_years ? `${user.experience_years} years` : 'Not provided'}</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-edit">Edit Profile</button>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
