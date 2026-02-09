import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { institutesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Building2, Plus, Check, X } from 'lucide-react';

export default function Institutes() {
    const { user } = useAuthStore();
    const [institutes, setInstitutes] = useState([]);
    const [pendingInstitutes, setPendingInstitutes] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'SCHOOL',
        address: '',
        contact_email: '',
        contact_phone: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInstitutes();
    }, []);

    const loadInstitutes = async () => {
        try {
            if (user?.purpose === 'OWNER') {
                const response = await institutesAPI.getMyInstitutes();
                setInstitutes(response.data);
            }
            // Load pending for super admin (future feature)
        } catch (error) {
            console.error('Failed to load institutes:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await institutesAPI.create(formData);
            alert('Institute created successfully! Awaiting Super Admin approval.');
            setShowCreateForm(false);
            setFormData({ name: '', type: 'SCHOOL', address: '', contact_email: '', contact_phone: '' });
            loadInstitutes();
        } catch (error) {
            alert('Failed to create institute: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Institutes</h1>
                        <p className="text-gray-600">Manage your organizations</p>
                    </div>
                    {user?.purpose === 'OWNER' && (
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="btn-primary flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Institute
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Institute</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institute Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="ABC International School"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type *
                                    </label>
                                    <select
                                        className="input-field"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="SCHOOL">School</option>
                                        <option value="COLLEGE">College</option>
                                        <option value="CORPORATE">Corporate</option>
                                        <option value="OFFICE">Office</option>
                                        <option value="FACTORY">Factory</option>
                                        <option value="NGO">NGO</option>
                                        <option value="CUSTOM">Custom</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <textarea
                                    className="input-field"
                                    rows="2"
                                    placeholder="123 Education Lane, City"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        placeholder="contact@institute.com"
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        placeholder="9876543210"
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Institute'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Institutes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {institutes.map((institute) => (
                        <div key={institute.id} className="card hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-primary-600" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${institute.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        institute.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {institute.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{institute.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{institute.type}</p>

                            {institute.address && (
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{institute.address}</p>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Created {new Date(institute.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {institutes.length === 0 && !showCreateForm && (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No institutes found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
