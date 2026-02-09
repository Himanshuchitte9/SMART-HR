import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Documents.css';

const API_URL = 'http://localhost:5000/api';

const Documents = () => {
    const { user, token } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'PERSONAL',
        type: 'AADHAR',
        userId: user?._id
    });
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchDocuments();
        if (user?.purpose === 'OWNER') {
            fetchEmployees();
        }
    }, [user]);

    const fetchDocuments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const endpoint = user?.purpose === 'OWNER' ? `${API_URL}/documents/all` : `${API_URL}/documents/my-docs`;
            const res = await axios.get(endpoint, config);
            setDocuments(res.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file');
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('document', file);
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('type', formData.type);
        data.append('userId', formData.userId);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post(`${API_URL}/documents/upload`, data, config);
            alert('Document uploaded successfully');
            setFile(null);
            setFormData({ ...formData, title: '' });
            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_URL}/documents/verify/${id}`, {}, config);
            fetchDocuments();
        } catch (error) {
            alert('Verification failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_URL}/documents/${id}`, config);
            fetchDocuments();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <div className="documents-container">
            <h2>📂 Document Vault</h2>

            <div className="upload-section">
                <h3>Upload New Document</h3>
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="e.g. Aadhar Card"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="PERSONAL">Personal</option>
                            {user?.purpose === 'OWNER' && <option value="OFFICIAL">Official</option>}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="AADHAR">Aadhar Card</option>
                            <option value="PAN">PAN Card</option>
                            <option value="RESUME">Resume</option>
                            <option value="OTHER">Other</option>
                            {user?.purpose === 'OWNER' && (
                                <>
                                    <option value="OFFER_LETTER">Offer Letter</option>
                                    <option value="RELIEVING_LETTER">Relieving Letter</option>
                                </>
                            )}
                        </select>
                    </div>

                    {user?.purpose === 'OWNER' && (
                        <div className="form-group">
                            <label>For Employee</label>
                            <select
                                value={formData.userId}
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            >
                                <option value={user._id}>Me (Owner)</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>File</label>
                        <input type="file" onChange={handleFileChange} required />
                    </div>

                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : '⬆️ Upload'}
                    </button>
                </form>
            </div>

            <div className="documents-list">
                <h3>Uploaded Documents</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : documents.length === 0 ? (
                    <p className="no-data">No documents found.</p>
                ) : (
                    <div className="docs-grid">
                        {documents.map((doc) => (
                            <div key={doc._id} className={`doc-card ${doc.verified ? 'verified' : ''}`}>
                                <div className="doc-icon">📄</div>
                                <div className="doc-info">
                                    <h4>{doc.title} {doc.verified && <span title="Verified">✅</span>}</h4>
                                    <p><strong>Type:</strong> {doc.type}</p>
                                    <p><strong>User:</strong> {doc.user?.name || 'Me'}</p>
                                    <small>{new Date(doc.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="doc-actions">
                                    <a href={`http://localhost:5000/${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="view-btn">
                                        👁️ View
                                    </a>
                                    {user?.purpose === 'OWNER' && !doc.verified && (
                                        <button onClick={() => handleVerify(doc._id)} className="verify-btn">
                                            ✅ Verify
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(doc._id)} className="delete-btn">
                                        ❌
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documents;
