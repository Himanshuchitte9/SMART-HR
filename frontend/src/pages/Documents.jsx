import { useState, useEffect } from 'react';
import axios from '../api/index';
import { useAuth } from '../context/AuthContext';
import './Documents.css';

const Documents = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'PERSONAL',
        type: 'PDF'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const endpoint = user?.purpose === 'OWNER' ? '/documents/all' : '/documents/my-docs';
            const res = await axios.get(endpoint);
            setDocuments(res.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        const data = new FormData();
        data.append('document', file);
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('type', formData.type);

        setLoading(true);
        try {
            await axios.post('/documents/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Document uploaded successfully');
            setFormData({ title: '', category: 'PERSONAL', type: 'PDF' });
            setFile(null);
            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            await axios.put(`/documents/verify/${id}`);
            fetchDocuments();
        } catch (error) {
            alert('Verification failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this document?')) return;
        try {
            await axios.delete(`/documents/delete/${id}`);
            fetchDocuments();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <div className="documents-container">
            <h2>📂 Document Vault</h2>

            <div className="upload-section">
                <h3>Upload Document</h3>
                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="PERSONAL">Personal (ID, Address)</option>
                                <option value="OFFICIAL">Official (Offer Letter, Playslips)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>File</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            <div className="documents-list">
                <h3>Your Documents</h3>
                <div className="docs-grid">
                    {documents.map((doc) => (
                        <div key={doc._id} className="doc-card">
                            <div className="doc-icon">📄</div>
                            <div className="doc-info">
                                <h4>{doc.title}</h4>
                                <span className="doc-meta">{doc.category} • {new Date(doc.createdAt).toLocaleDateString()}</span>
                                <div className="doc-status">
                                    {doc.verified ? (
                                        <span className="verified-badge">✅ Verified</span>
                                    ) : (
                                        <span className="pending-badge">⏳ Pending</span>
                                    )}
                                </div>
                            </div>
                            <div className="doc-actions">
                                <a href={`http://localhost:5000/${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="view-btn">View</a>
                                {user?.purpose === 'OWNER' && !doc.verified && (
                                    <button onClick={() => handleVerify(doc._id)} className="verify-btn">Verify</button>
                                )}
                                <button onClick={() => handleDelete(doc._id)} className="delete-btn">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Documents;
