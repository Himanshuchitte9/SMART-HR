import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AttendanceHistory.css';

const API_URL = 'http://localhost:5000/api';

const AttendanceHistory = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchHistory();
    }, [month, year]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/attendance/my-history?month=${month}&year=${year}`, config);
            setHistory(res.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PRESENT': return 'status-present';
            case 'ABSENT': return 'status-absent';
            case 'HALF_DAY': return 'status-half';
            case 'LEAVE': return 'status-leave';
            default: return '';
        }
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>📅 Attendance History</h2>
                <div className="filters">
                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : history.length === 0 ? (
                <p className="no-data">No attendance records found for this month.</p>
            ) : (
                <div className="table-responsive">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((record) => {
                                const date = new Date(record.date).toLocaleDateString();
                                const inTime = record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-';
                                const outTime = record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-';

                                let duration = '-';
                                if (record.clockIn && record.clockOut) {
                                    const diff = new Date(record.clockOut) - new Date(record.clockIn);
                                    const hours = Math.floor(diff / 3600000);
                                    const minutes = Math.floor((diff % 3600000) / 60000);
                                    duration = `${hours}h ${minutes}m`;
                                }

                                return (
                                    <tr key={record._id}>
                                        <td>{date}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>{inTime}</td>
                                        <td>{outTime}</td>
                                        <td>{duration}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
