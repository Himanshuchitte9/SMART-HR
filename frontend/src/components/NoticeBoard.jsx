import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './NoticeBoard.css';

const API_URL = 'http://localhost:5000/api';

const NoticeBoard = () => {
    const { token } = useAuth();
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/announcements/active`, config);
            setNotices(res.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    if (notices.length === 0) return null;

    return (
        <div className="notice-board-widget">
            <h3>📢 Notice Board</h3>
            <div className="notices-scroll">
                {notices.map((notice) => (
                    <div key={notice._id} className={`notice-card ${notice.priority.toLowerCase()}`}>
                        <div className="notice-top">
                            <h5>{notice.title}</h5>
                            {notice.priority === 'URGENT' && <span className="urgent-tag">URGENT</span>}
                        </div>
                        <p>{notice.content}</p>
                        <small>{new Date(notice.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;
