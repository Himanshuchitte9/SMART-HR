import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LeaveManagement.css';

const API_URL = 'http://localhost:5000/api';

const LeaveManagement = () => {
    const { token } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
        fetchBalance();
    }, []);

    const fetchLeaves = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/leave/my-leaves`, config);
            setLeaves(res.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalance = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/leave/balance`, config);
            setBalance(res.data);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            case 'PENDING': return 'status-pending';
            default: return '';
        }
    };

    return (
        <div className="leave-management-container">
            <h2>📅 My Leaves</h2>

            {balance && (
                <div className="balance-cards">
                    <div className="balance-card">
                        <h3>Sick Leave</h3>
                        <p className="balance-value">{balance.balance.sick}/{balance.annual.sick}</p>
                        <span className="balance-label">Available</span>
                    </div>
                    <div className="balance-card">
                        <h3>Casual Leave</h3>
                        <p className="balance-value">{balance.balance.casual}/{balance.annual.casual}</p>
                        <span className="balance-label">Available</span>
                    </div>
                    <div className="balance-card">
                        <h3>Paid Leave</h3>
                        <p className="balance-value">{balance.balance.paid}/{balance.annual.paid}</p>
                        <span className="balance-label">Available</span>
                    </div>
                </div>
            )}

            <div className="leaves-table-container">
                <h3>Leave History</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : leaves.length === 0 ? (
                    <p className="no-data">No leave applications found.</p>
                ) : (
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days</th>
                                <th>Status</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id}>
                                    <td>{leave.leaveType}</td>
                                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td>{leave.totalDays}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>{leave.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;
