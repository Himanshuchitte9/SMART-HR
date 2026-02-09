import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Tasks.css';

const API_URL = 'http://localhost:5000/api';

const Tasks = () => {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        fetchTasks();
        if (user?.purpose === 'OWNER') {
            fetchEmployees();
        }
    }, [user]);

    const fetchTasks = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const endpoint = user?.purpose === 'OWNER' ? `${API_URL}/tasks/all` : `${API_URL}/tasks/my-tasks`;
            const res = await axios.get(endpoint, config);
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_URL}/auth/employees`, config);
            setEmployees(res.data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_URL}/tasks/assign`, formData, config);
            alert('Task assigned successfully');
            setViewMode('list');
            fetchTasks();
            setFormData({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'MEDIUM' });
        } catch (error) {
            alert('Failed to assign task');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/tasks/status/${id}`, { status: newStatus }, config);
            fetchTasks();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h2>🎯 Performance & Tasks</h2>
                {user?.purpose === 'OWNER' && (
                    <button
                        className="create-btn"
                        onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
                    >
                        {viewMode === 'list' ? '+ Assign New Task' : 'Cancel'}
                    </button>
                )}
            </div>

            {viewMode === 'create' && (
                <div className="task-form-card">
                    <h3>Assign New Task</h3>
                    <form onSubmit={handleAssign}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Assign To</label>
                                <select
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Assign Task</button>
                    </form>
                </div>
            )}

            <div className="tasks-grid">
                {tasks.map(task => (
                    <div key={task._id} className={`task-card ${task.priority.toLowerCase()}`}>
                        <div className="task-top">
                            <h4>{task.title}</h4>
                            <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                        </div>
                        <p>{task.description}</p>
                        <div className="task-meta">
                            <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            {user?.purpose === 'OWNER' ? (
                                <span>👤 To: {task.assignedTo?.name}</span>
                            ) : (
                                <span>👤 By: {task.assignedBy?.name}</span>
                            )}
                        </div>

                        <div className="task-actions">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                className="status-select"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="REVIEW">Review</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
