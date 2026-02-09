import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ApplyLeave.css';

const API_URL = 'http://localhost:5000/api';

const ApplyLeave = () => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        leaveType: 'CASUAL',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(`${API_URL}/leave/apply`, formData, config);
            setMessage(res.data.message);
            setFormData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply for leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="apply-leave-container">
            <h2>📅 Apply for Leave</h2>

            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="leave-form">
                <div className="form-group">
                    <label>Leave Type</label>
                    <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
                        <option value="CASUAL">Casual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="PAID">Paid Leave</option>
                        <option value="UNPAID">Unpaid Leave</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Reason</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Please provide reason for leave..."
                        required
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default ApplyLeave;
