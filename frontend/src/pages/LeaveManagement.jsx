import { useState, useEffect } from 'react';
import axios from '../api/index';
import { useAuth } from '../context/AuthContext';
import './LeaveManagement.css';

const LeaveManagement = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
        fetchBalance();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('/leave/my-leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalance = async () => {
        try {
            const res = await axios.get('/leave/balance');
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
            <div className="page-header">
                <h2>📅 My Leaves</h2>
                <p>Track your leave balance and history</p>
            </div>

            {balance && (
                <div className="balance-cards">
                    <div className="balance-card sick">
                        <div className="balance-icon">🤒</div>
                        <div className="balance-info">
                            <h3>Sick Leave</h3>
                            <p className="balance-value">{balance.balance.sick} / {balance.annual.sick}</p>
                            <span className="balance-label">Available Days</span>
                        </div>
                    </div>
                    <div className="balance-card casual">
                        <div className="balance-icon">🌴</div>
                        <div className="balance-info">
                            <h3>Casual Leave</h3>
                            <p className="balance-value">{balance.balance.casual} / {balance.annual.casual}</p>
                            <span className="balance-label">Available Days</span>
                        </div>
                    </div>
                    <div className="balance-card paid">
                        <div className="balance-icon">💰</div>
                        <div className="balance-info">
                            <h3>Paid Leave</h3>
                            <p className="balance-value">{balance.balance.paid} / {balance.annual.paid}</p>
                            <span className="balance-label">Available Days</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="leaves-table-container">
                <h3>Leave History</h3>
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : leaves.length === 0 ? (
                    <div className="no-data">
                        <p>No leave applications found.</p>
                        <a href="/apply-leave" className="apply-link">Apply Now</a>
                    </div>
                ) : (
                    <table className="leaves-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Days</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Approver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id}>
                                    <td><span className="leave-type-badge">{leave.leaveType}</span></td>
                                    <td>
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td>{leave.totalDays}</td>
                                    <td className="reason-cell">{leave.reason}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>{leave.approver ? leave.approver.name : '-'}</td>
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

