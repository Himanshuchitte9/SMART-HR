import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        gender: 'Male',
        address: '',
        qualification: '',
        experience_years: 0,
        purpose: 'EMPLOYEE'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.register(formData);
            const { token, ...userData } = response.data;
            login(userData, token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <h1>SmartHR</h1>
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile *</label>
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Password *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Purpose *</label>
                            <select name="purpose" value={formData.purpose} onChange={handleChange}>
                                <option value="EMPLOYEE">Employee</option>
                                <option value="OWNER">Owner</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Qualification</label>
                            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Experience (years)</label>
                            <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
