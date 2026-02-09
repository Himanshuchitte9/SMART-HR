import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rolesAPI, institutesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { GitBranch, Plus, Trash2, Eye } from 'lucide-react';

export default function Roles() {
    const { instituteId } = useParams();
    const navigate = useNavigate();
    const [institute, setInstitute] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        parent_role_id: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [instituteId]);

    const loadData = async () => {
        try {
            const [instituteRes, rolesRes] = await Promise.all([
                institutesAPI.getById(instituteId),
                rolesAPI.getByInstitute(instituteId),
            ]);
            setInstitute(instituteRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await rolesAPI.create({
                ...formData,
                institute_id: instituteId,
                parent_role_id: formData.parent_role_id || null,
            });
            alert('Role created successfully!');
            setShowCreateForm(false);
            setFormData({ name: '', parent_role_id: '', description: '' });
            loadData();
        } catch (error) {
            alert('Failed to create role: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (roleId) => {
        if (!confirm('Are you sure you want to delete this role?')) return;

        try {
            await rolesAPI.delete(roleId);
            alert('Role deleted successfully!');
            loadData();
        } catch (error) {
            alert('Failed to delete role: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {institute?.name} - Roles
                        </h1>
                        <p className="text-gray-600">Manage role hierarchy and permissions</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate(`/org-chart/${instituteId}`)}
                            className="btn-secondary flex items-center"
                        >
                            <Eye className="w-5 h-5 mr-2" />
                            View Org Chart
                        </button>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="btn-primary flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Role
                        </button>
                    </div>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Role</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="Principal, Manager, etc."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Parent Role (Optional)
                                    </label>
                                    <select
                                        className="input-field"
                                        value={formData.parent_role_id}
                                        onChange={(e) => setFormData({ ...formData, parent_role_id: e.target.value })}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name} (Level {role.level})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    className="input-field"
                                    rows="2"
                                    placeholder="Describe this role..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
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
                                    {loading ? 'Creating...' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Roles List */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Role Hierarchy</h2>
                    <div className="space-y-3">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div style={{ marginLeft: `${(role.level - 1) * 24}px` }} className="flex items-center">
                                        <GitBranch className="w-5 h-5 text-primary-600 mr-3" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Level {role.level}
                                                {role.parent_role && ` • Reports to: ${role.parent_role.name}`}
                                            </p>
                                            {role.description && (
                                                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {roles.length === 0 && (
                        <div className="text-center py-12">
                            <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No roles found. Create your first role!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
