import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const API_URL = 'http://localhost:5000/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [profilePic, setProfilePic] = useState(user?.profilePicture || null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        gender: user?.gender || '',
        address: user?.address || '',
        qualification: user?.qualification || '',
        experience_years: user?.experience_years || ''
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');

            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            if (profilePic && typeof profilePic !== 'string') {
                submitData.append('profilePicture', profilePic);
            }

            await axios.put(
                `${API_URL}/auth/profile`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage('✅ Profile updated successfully!');
            setIsEditing(false);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            mobile: user?.mobile || '',
            gender: user?.gender || '',
            address: user?.address || '',
            qualification: user?.qualification || '',
            experience_years: user?.experience_years || ''
        });
        setPreviewUrl(user?.profilePicture || null);
        setProfilePic(user?.profilePicture || null);
        setIsEditing(false);
        setMessage('');
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="header-content">
                    <h1>👤 My Profile</h1>
                    <p className="subtitle">Manage your personal information</p>
                </div>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="profile-card">
                <div className="profile-avatar-section">
                    <div className="avatar-wrapper">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" className="avatar-image" />
                        ) : (
                            <div className="avatar-circle">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {isEditing && (
                            <label className="avatar-upload-btn">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                📷 Change Photo
                            </label>
                        )}
                    </div>
                    <div className="user-basic-info">
                        <h2>{user?.name}</h2>
                        <p className="user-email">{user?.email}</p>
                        <span className="role-badge-modern">{user?.role}</span>
                    </div>
                </div>

                {!isEditing ? (
                    <>
                        <div className="profile-info-grid">
                            <div className="info-card">
                                <div className="info-icon">📱</div>
                                <div className="info-content">
                                    <label>Mobile Number</label>
                                    <span>{user?.mobile || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">⚧</div>
                                <div className="info-content">
                                    <label>Gender</label>
                                    <span>{user?.gender || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">🎓</div>
                                <div className="info-content">
                                    <label>Qualification</label>
                                    <span>{user?.qualification || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">💼</div>
                                <div className="info-content">
                                    <label>Experience</label>
                                    <span>{user?.experience_years ? `${user.experience_years} years` : 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="info-card full-width">
                                <div className="info-icon">📍</div>
                                <div className="info-content">
                                    <label>Address</label>
                                    <span>{user?.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="btn-edit-modern" onClick={() => setIsEditing(true)}>
                                ✏️ Edit Profile
                            </button>
                            <button className="btn-logout-modern" onClick={handleLogout}>
                                🚪 Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-form-modern">
                        <div className="form-grid">
                            <div className="form-group-modern">
                                <label>👤 Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-group-modern">
                                <label>📧 Email (Cannot be changed)</label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group-modern">
                                <label>📱 Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                />
                            </div>

                            <div className="form-group-modern">
                                <label>⚧ Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="modern-select"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="form-group-modern">
                                <label>🎓 Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="e.g., B.Tech, MBA"
                                />
                            </div>

                            <div className="form-group-modern">
                                <label>💼 Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experience_years"
                                    value={formData.experience_years}
                                    onChange={handleChange}
                                    placeholder="Years of experience"
                                    min="0"
                                />
                            </div>

                            <div className="form-group-modern full-width">
                                <label>📍 Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your complete address"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button
                                type="submit"
                                className="btn-save-modern"
                                disabled={loading}
                            >
                                {loading ? '⏳ Saving...' : '💾 Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="btn-cancel-modern"
                                onClick={handleCancel}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
