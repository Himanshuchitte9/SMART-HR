import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Employees.css';

const Employees = () => {
    const navigate = useNavigate();

    return (
        <div className="employees-container">
            <div className="employees-header">
                <h1>Employee Management</h1>
                <button className="btn-primary">
                    + Add Employee
                </button>
            </div>

            <div className="info-box">
                <h3>Coming Soon!</h3>
                <p>Employee management features will be available here.</p>
                <ul>
                    <li>View all employees</li>
                    <li>Assign roles and permissions</li>
                    <li>Manage employment history</li>
                    <li>Generate offer letters</li>
                    <li>Track applications</li>
                </ul>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Employees;
