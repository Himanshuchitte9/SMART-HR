import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Announcements.css';

const API_URL = 'http://localhost:5000/api';

const Announcements = () => {
    const { token } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'MEDIUM',
        targetAudience: 'ALL',
        expiryDate: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/announcements/active`, config);
            setAnnouncements(res.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_URL}/announcements/create`, formData, config);
            alert('Announcement posted successfully');
            setFormData({ title: '', content: '', priority: 'MEDIUM', targetAudience: 'ALL', expiryDate: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            alert('Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm('Deactivate this announcement?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/announcements/deactivate/${id}`, {}, config);
            fetchAnnouncements();
        } catch (error) {
            alert('Failed to deactivate');
        }
    };

    return (
        <div className="announcements-container">
            <h2>📢 Manage Announcements</h2>

            <div className="create-announcement">
                <h3>Post New Notice</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g. Holiday on Friday"
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            placeholder="Detail message..."
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent 🚨</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Audience</label>
                            <select
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            >
                                <option value="ALL">Everyone</option>
                                <option value="EMPLOYEES">Employees Only</option>
                                <option value="ADMINS">Admins Only</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Expiry Date (Optional)</label>
                            <input
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Posting...' : '📢 Post Announcement'}
                    </button>
                </form>
            </div>

            <div className="active-announcements">
                <h3>Active Notices</h3>
                {announcements.length === 0 ? (
                    <p>No active announcements.</p>
                ) : (
                    <div className="notices-list">
                        {announcements.map((notice) => (
                            <div key={notice._id} className={`notice-item ${notice.priority.toLowerCase()}`}>
                                <div className="notice-header">
                                    <h4>{notice.title}</h4>
                                    <span className="priority-badge">{notice.priority}</span>
                                </div>
                                <p>{notice.content}</p>
                                <div className="notice-footer">
                                    <small>By: {notice.createdBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}</small>
                                    <button onClick={() => handleDeactivate(notice._id)} className="delete-btn">Archieve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
