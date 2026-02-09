import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Institutes.css';

const API_URL = 'http://localhost:5000/api';

const Institutes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'SCHOOL',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/institutes`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage('Institute created successfully! Waiting for Super Admin approval.');
            setFormData({ name: '', type: 'SCHOOL', address: '' });
            setShowForm(false);

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setMessage('Error: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="institutes-container">
            <div className="institutes-header">
                <h1>My Institutes</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Create Institute'}
                </button>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {showForm && (
                <div className="form-container">
                    <h2>Create New Institute</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Institute Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., ABC School"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="SCHOOL">School</option>
                                <option value="COLLEGE">College</option>
                                <option value="CORPORATE">Corporate</option>
                                <option value="OFFICE">Office</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Address *</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full address"
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Institute'}
                        </button>
                    </form>
                </div>
            )}

            <div className="info-box">
                <h3>Important Information</h3>
                <ul>
                    <li>Your institute will be sent for Super Admin approval</li>
                    <li>Once approved, you can start adding roles and employees</li>
                    <li>You will be the owner/admin of this institute</li>
                </ul>
            </div>
        </div>
    );
};

export default Institutes;
