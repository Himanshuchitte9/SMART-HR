import { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceWidget.css';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const AttendanceWidget = () => {
    const { token } = useAuth();
    const [status, setStatus] = useState({
        clockedIn: false,
        clockedOut: false,
        startTime: null,
        endTime: null
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchStatus();
        return () => clearInterval(timer);
    }, []);

    const fetchStatus = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/attendance/today`, config);
            setStatus(res.data);
        } catch (error) {
            console.error('Error fetching attendance status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    };

    const handleClockAction = async (action) => {
        setLoading(true);
        try {
            const location = await getLocation();
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(
                `${API_URL}/attendance/${action}`,
                { location, device: navigator.userAgent },
                config
            );

            await fetchStatus();
            alert(`Successfully ${action === 'clock-in' ? 'Clocked In' : 'Clocked Out'}!`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || 'Error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !status.startTime) return <div>Loading...</div>;

    return (
        <div className="attendance-widget">
            <h3>⏱️ Attendance</h3>
            <div className="current-time">
                {currentTime.toLocaleTimeString()}
            </div>
            <div className="current-date">
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            <div className="attendance-controls">
                {!status.clockedIn ? (
                    <button
                        className="clock-btn clock-in"
                        onClick={() => handleClockAction('clock-in')}
                        disabled={loading}
                    >
                        🟢 Clock In
                    </button>
                ) : !status.clockedOut ? (
                    <div className="status-active">
                        <p>Started at: {new Date(status.startTime).toLocaleTimeString()}</p>
                        <button
                            className="clock-btn clock-out"
                            onClick={() => handleClockAction('clock-out')}
                            disabled={loading}
                        >
                            🔴 Clock Out
                        </button>
                    </div>
                ) : (
                    <div className="status-completed">
                        <p>✅ Workday Completed</p>
                        <p>In: {new Date(status.startTime).toLocaleTimeString()}</p>
                        <p>Out: {new Date(status.endTime).toLocaleTimeString()}</p>
                    </div>
                )}
            </div>
            <button
                className="history-link-btn"
                onClick={() => window.location.href = '/attendance-history'}
                style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
            >
                View History 📅
            </button>
        </div>
    );
};

export default AttendanceWidget;
