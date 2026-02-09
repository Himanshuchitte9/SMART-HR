import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roles.css';

const Roles = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="roles-container">
            <div className="roles-header">
                <h1>Role Management & Org Chart</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Create Role'}
                </button>
            </div>

            <div className="info-box">
                <h3>Coming Soon!</h3>
                <p>Role hierarchy and org chart visualization will be available here.</p>
                <ul>
                    <li>Create hierarchical roles (Principal → Vice Principal → Teacher)</li>
                    <li>Assign permissions to each role</li>
                    <li>Visualize org chart</li>
                    <li>Manage employee assignments</li>
                </ul>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Roles;
