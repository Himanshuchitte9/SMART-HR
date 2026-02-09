import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LeaveApproval.css';

const API_URL = 'http://localhost:5000/api';

const LeaveApproval = () => {
    const { token } = useAuth();
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/leave/pending`, config);
            setPendingLeaves(res.data);
        } catch (error) {
            console.error('Error fetching pending leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        setActionLoading(leaveId);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/leave/approve/${leaveId}`, {}, config);
            alert('Leave approved successfully');
            fetchPendingLeaves();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve leave');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (leaveId) => {
        const comments = prompt('Enter reason for rejection (optional):');
        setActionLoading(leaveId);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/leave/reject/${leaveId}`, { comments }, config);
            alert('Leave rejected');
            fetchPendingLeaves();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject leave');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="leave-approval-container">
            <h2>✅ Leave Approvals</h2>

            {loading ? (
                <p>Loading...</p>
            ) : pendingLeaves.length === 0 ? (
                <p className="no-data">No pending leave applications.</p>
            ) : (
                <div className="approval-grid">
                    {pendingLeaves.map((leave) => (
                        <div key={leave._id} className="approval-card">
                            <div className="card-header">
                                <h3>{leave.user.name}</h3>
                                <span className="leave-type-badge">{leave.leaveType}</span>
                            </div>
                            <div className="card-body">
                                <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
                                <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
                                <p><strong>Days:</strong> {leave.totalDays}</p>
                                <p><strong>Reason:</strong> {leave.reason}</p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(leave._id)}
                                    disabled={actionLoading === leave._id}
                                >
                                    ✅ Approve
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => handleReject(leave._id)}
                                    disabled={actionLoading === leave._id}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveApproval;
